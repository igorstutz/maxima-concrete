<?php
declare(strict_types=1);

/* ----------------------------------------------------------------------
 *  Maxima Concrete — aparência dos e-mails do site
 *
 *  Regras de e-mail, que não são as da web:
 *
 *  - layout em <table>, não flex nem grid: o Outlook para Windows renderiza
 *    com o motor do Word, que não conhece nenhum dos dois;
 *  - CSS sempre inline, porque parte dos clientes descarta <style>;
 *  - gradiente com `bgcolor` sólido embaixo: o Outlook ignora
 *    background-image e ficaria sem fundo nenhum, texto branco no branco;
 *  - nenhuma imagem externa: quase todo cliente bloqueia por padrão até o
 *    leitor liberar, e um logo que não carrega é pior que um bem tipografado;
 *  - largura 600px, o consenso que cabe em qualquer painel de leitura.
 *
 *  Cores iguais às do site (globals.css): navy #041c2d, ocean #0d5d93,
 *  primary #1e90ff, surface #f5f7fa.
 * ---------------------------------------------------------------------- */

const EMAIL_NAVY    = '#041c2d';
const EMAIL_OCEAN   = '#0d5d93';
const EMAIL_PRIMARY = '#1e90ff';
const EMAIL_FUNDO   = '#f5f7fa';
const EMAIL_BORDA   = '#e2e8f0';
const EMAIL_TEXTO   = '#1f2937';
const EMAIL_SUAVE   = '#6b7280';
/** "Pouco arredondadas", como o site, que usa 10px nos botões. */
const EMAIL_RAIO    = '6px';
const EMAIL_FONTE   = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,Helvetica,sans-serif";

/** Escapa para HTML. Tudo aqui vem de formulário público. */
function e_(string $v): string
{
    return htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Uma linha rótulo/valor da tabela de dados. */
function email_linha(string $rotulo, string $valor, bool $ultima = false): string
{
    if (trim($valor) === '') $valor = '—';
    $borda = $ultima ? '' : 'border-bottom:1px solid ' . EMAIL_BORDA . ';';
    return '<tr>'
        . '<td style="padding:12px 0;' . $borda . 'font:600 12px/1.4 ' . EMAIL_FONTE . ';color:' . EMAIL_SUAVE
        . ';text-transform:uppercase;letter-spacing:.6px;width:38%;vertical-align:top;">' . e_($rotulo) . '</td>'
        . '<td style="padding:12px 0;' . $borda . 'font:400 15px/1.5 ' . EMAIL_FONTE . ';color:' . EMAIL_TEXTO
        . ';vertical-align:top;">' . $valor . '</td>'
        . '</tr>';
}

/** Serviços como etiquetas. inline-block é seguro; flex não seria. */
function email_etiquetas(array $itens): string
{
    if (!$itens) return '—';
    $html = '';
    foreach ($itens as $i) {
        $html .= '<span style="display:inline-block;background:#eaf4fd;color:' . EMAIL_OCEAN
            . ';border:1px solid #cfe6f9;border-radius:4px;padding:4px 10px;margin:0 6px 6px 0;'
            . 'font:600 13px/1.4 ' . EMAIL_FONTE . ';">' . e_($i) . '</span>';
    }
    return $html;
}

/**
 * Casca comum: cabeçalho em gradiente, conteúdo, rodapé.
 *
 * @param string $titulo    linha grande do cabeçalho
 * @param string $conteudo  HTML já montado do miolo
 * @param string $rodape    HTML da faixa de metadados
 */
function email_moldura(string $titulo, string $conteudo, string $rodape): string
{
    return '<!DOCTYPE html>'
    . '<html lang="en"><head><meta charset="utf-8">'
    . '<meta name="viewport" content="width=device-width,initial-scale=1">'
    . '<title>' . e_($titulo) . '</title></head>'
    . '<body style="margin:0;padding:0;background-color:' . EMAIL_FUNDO . ';">'
    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" '
    . 'style="background-color:' . EMAIL_FUNDO . ';padding:24px 12px;"><tr><td align="center">'

    . '<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" '
    . 'style="width:100%;max-width:600px;background:#ffffff;border:1px solid ' . EMAIL_BORDA . ';'
    . 'border-radius:' . EMAIL_RAIO . ';overflow:hidden;">'

    // Cabeçalho. bgcolor sólido primeiro: é o que o Outlook enxerga.
    . '<tr><td bgcolor="' . EMAIL_NAVY . '" style="background-color:' . EMAIL_NAVY . ';'
    . 'background-image:linear-gradient(135deg,' . EMAIL_OCEAN . ' 0%,' . EMAIL_NAVY . ' 100%);'
    . 'padding:28px 32px;">'
    . '<div style="font:700 12px/1 ' . EMAIL_FONTE . ';color:#7fc4f5;letter-spacing:2.5px;'
    . 'text-transform:uppercase;">Maxima Concrete</div>'
    . '<div style="font:600 23px/1.35 ' . EMAIL_FONTE . ';color:#ffffff;padding-top:10px;">'
    . e_($titulo) . '</div>'
    . '</td></tr>'

    . '<tr><td style="padding:28px 32px;">' . $conteudo . '</td></tr>'

    . '<tr><td style="background:#fafbfc;border-top:1px solid ' . EMAIL_BORDA . ';padding:16px 32px;'
    . 'font:400 12px/1.7 ' . EMAIL_FONTE . ';color:' . EMAIL_SUAVE . ';">' . $rodape . '</td></tr>'

    . '</table>'
    . '<div style="font:400 12px/1.6 ' . EMAIL_FONTE . ';color:#9aa3af;padding-top:14px;">'
    . 'Sent automatically by the Maxima Concrete website.</div>'
    . '</td></tr></table></body></html>';
}

/** Faixa de metadados do rodapé. */
function email_rodape(string $pagina, string $ip): string
{
    return '<strong style="color:' . EMAIL_TEXTO . ';">Page:</strong> ' . e_($pagina !== '' ? $pagina : '/')
        . '<br><strong style="color:' . EMAIL_TEXTO . ';">Submitted:</strong> ' . e_(gmdate('M j, Y \a\t H:i')) . ' UTC'
        . '<br><strong style="color:' . EMAIL_TEXTO . ';">From IP:</strong> ' . e_($ip);
}

/** E-mail de novo pedido de orçamento (formulário de contato). */
function email_html_lead(array $d): string
{
    $nome  = (string)$d['name'];
    $fone  = (string)$d['phone'];
    $email = (string)$d['email'];
    $digitos = preg_replace('/\D/', '', $fone) ?? '';

    // Nome em destaque, com telefone e e-mail clicáveis: quem abre isso está
    // quase sempre prestes a ligar de volta.
    $topo = '<div style="font:700 22px/1.3 ' . EMAIL_FONTE . ';color:' . EMAIL_NAVY . ';">' . e_($nome) . '</div>';
    $acoes = [];
    if ($digitos !== '') {
        $acoes[] = '<a href="tel:+' . e_(strlen($digitos) === 10 ? '1' . $digitos : $digitos) . '" '
            . 'style="display:inline-block;background:' . EMAIL_NAVY . ';color:#ffffff;text-decoration:none;'
            . 'border-radius:' . EMAIL_RAIO . ';padding:11px 20px;margin:0 8px 8px 0;'
            . 'font:600 14px/1 ' . EMAIL_FONTE . ';">Call ' . e_($fone) . '</a>';
    }
    if ($email !== '') {
        $acoes[] = '<a href="mailto:' . e_($email) . '" '
            . 'style="display:inline-block;background:#ffffff;color:' . EMAIL_NAVY . ';text-decoration:none;'
            . 'border:1px solid ' . EMAIL_NAVY . ';border-radius:' . EMAIL_RAIO . ';padding:10px 20px;'
            . 'margin:0 8px 8px 0;font:600 14px/1 ' . EMAIL_FONTE . ';">Reply by email</a>';
    }
    if ($acoes) $topo .= '<div style="padding-top:16px;">' . implode('', $acoes) . '</div>';

    $tabela = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" '
        . 'style="width:100%;border-top:1px solid ' . EMAIL_BORDA . ';margin-top:24px;">'
        . email_linha('Phone', $fone !== '' ? '<a href="tel:' . e_($fone) . '" style="color:' . EMAIL_OCEAN . ';">' . e_($fone) . '</a>' : '')
        . email_linha('Email', $email !== '' ? '<a href="mailto:' . e_($email) . '" style="color:' . EMAIL_OCEAN . ';">' . e_($email) . '</a>' : '')
        . email_linha('Address', e_((string)$d['street']))
        . email_linha('ZIP', e_((string)$d['zip']))
        . email_linha('Services', email_etiquetas((array)$d['services']))
        . email_linha('How they heard', e_((string)$d['hear_about']), true)
        . '</table>';

    $mensagem = '';
    if (trim((string)$d['message']) !== '') {
        $mensagem = '<div style="font:600 12px/1.4 ' . EMAIL_FONTE . ';color:' . EMAIL_SUAVE
            . ';text-transform:uppercase;letter-spacing:.6px;padding:24px 0 10px;">Message</div>'
            . '<div style="background:' . EMAIL_FUNDO . ';border-left:3px solid ' . EMAIL_PRIMARY . ';'
            . 'border-radius:0 ' . EMAIL_RAIO . ' ' . EMAIL_RAIO . ' 0;padding:16px 18px;'
            . 'font:400 15px/1.65 ' . EMAIL_FONTE . ';color:' . EMAIL_TEXTO . ';white-space:pre-wrap;">'
            . e_((string)$d['message']) . '</div>';
    }

    return email_moldura(
        'New Estimate Request',
        $topo . $tabela . $mensagem,
        email_rodape((string)$d['page'], (string)$d['ip'])
    );
}

/** E-mail de currículo (Join Our Team). */
function email_html_resume(array $d): string
{
    $nome = (string)$d['name'];
    $topo = '<div style="font:700 22px/1.3 ' . EMAIL_FONTE . ';color:' . EMAIL_NAVY . ';">' . e_($nome) . '</div>'
        . '<div style="font:400 15px/1.5 ' . EMAIL_FONTE . ';color:' . EMAIL_SUAVE . ';padding-top:6px;">'
        . 'Applying for: <strong style="color:' . EMAIL_TEXTO . ';">'
        . e_((string)$d['position'] !== '' ? (string)$d['position'] : 'Not specified') . '</strong></div>';

    $email = (string)$d['email'];
    $fone  = (string)$d['phone'];
    $tabela = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" '
        . 'style="width:100%;border-top:1px solid ' . EMAIL_BORDA . ';margin-top:22px;">'
        . email_linha('Phone', $fone !== '' ? '<a href="tel:' . e_($fone) . '" style="color:' . EMAIL_OCEAN . ';">' . e_($fone) . '</a>' : '')
        . email_linha('Email', $email !== '' ? '<a href="mailto:' . e_($email) . '" style="color:' . EMAIL_OCEAN . ';">' . e_($email) . '</a>' : '')
        . email_linha('Resume', e_((string)$d['resume']), true)
        . '</table>';

    $mensagem = '';
    if (trim((string)$d['message']) !== '') {
        $mensagem = '<div style="font:600 12px/1.4 ' . EMAIL_FONTE . ';color:' . EMAIL_SUAVE
            . ';text-transform:uppercase;letter-spacing:.6px;padding:24px 0 10px;">About them</div>'
            . '<div style="background:' . EMAIL_FUNDO . ';border-left:3px solid ' . EMAIL_PRIMARY . ';'
            . 'border-radius:0 ' . EMAIL_RAIO . ' ' . EMAIL_RAIO . ' 0;padding:16px 18px;'
            . 'font:400 15px/1.65 ' . EMAIL_FONTE . ';color:' . EMAIL_TEXTO . ';white-space:pre-wrap;">'
            . e_((string)$d['message']) . '</div>';
    }

    return email_moldura(
        'New Job Application',
        $topo . $tabela . $mensagem,
        email_rodape('/join-our-team/', (string)$d['ip'])
    );
}
