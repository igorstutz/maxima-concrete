<?php
declare(strict_types=1);

/* ----------------------------------------------------------------------
 *  Maxima Concrete — confirmação enviada ao LEAD depois do formulário.
 *
 *  Por que existe: quem preenche o formulário não atende a ligação de volta
 *  porque não reconhece o número. Este e-mail chega segundos depois do envio,
 *  diz o que acontece agora, quando ligamos, e nomeia cada número de onde a
 *  ligação ou a mensagem pode vir — um 614 desconhecido na tela vira um
 *  número que a pessoa foi avisada para esperar.
 *
 *  É o par da página /thank-you/: mesmo conteúdo, para quem fechou a aba
 *  antes de ler chegar ao mesmo lugar. Ao mudar um, mudar o outro.
 *
 *  O envio passa pelo mesmo mailer.php do resto do site (Brevo assinando com
 *  DKIM do domínio, mail() como último recurso). Isso importa mais aqui do que
 *  nos avisos internos: esta mensagem vai para a caixa que o cliente digitou —
 *  Gmail, Yahoo, Outlook.com —, e é exatamente esse tipo de destinatário que
 *  descarta em silêncio o que não está autenticado.
 *
 *  Nunca lança e nunca imprime: submit.php chama isto DEPOIS de o navegador
 *  já ter a resposta, então nada aqui pode transformar um lead capturado em
 *  erro de formulário.
 *
 *  Teste pela linha de comando, de dentro da pasta api/:
 *      php lead-autoreply.php test alguem@exemplo.com "First Last"
 * ---------------------------------------------------------------------- */

require_once __DIR__ . '/mailer.php';
require_once __DIR__ . '/email-template.php';

if (!defined('AUTOREPLY_FROM_NAME')) {
    /** Nome de exibição do remetente. O endereço continua o do mailer.php. */
    define('AUTOREPLY_FROM_NAME', 'Maxima Concrete');
    // Responder a uma mensagem automática ainda é resposta de cliente: tem de
    // cair na caixa do escritório, não no vazio do no-reply.
    define('AUTOREPLY_REPLY_TO', 'Maxima Concrete <info@maximaconcrete.com>');
    define('AUTOREPLY_MAIN_TEL', '(614) 384-5917');
    define('AUTOREPLY_MAIN_TEL_HREF', 'tel:+16143845917');
    define('AUTOREPLY_EXTENSION', 'ext. 1');
    define('AUTOREPLY_SITE', 'https://maximaconcrete.com');
    define('AUTOREPLY_ADDRESS', '4059 State Route 37 E, Suite A — Delaware, OH 43015');
    // Não reenviar para o mesmo endereço dentro desta janela: quem manda o
    // formulário duas vezes recebe uma confirmação, não duas.
    define('AUTOREPLY_DEDUPE_SECONDS', 6 * 3600);
}

if (!function_exists('autoreply_numeros')) {

/**
 * Todos os números de onde uma consultoria da Maxima Concrete pode ligar ou
 * mandar mensagem. Mesma lista da seção "Save our official consultation
 * numbers" em src/content/pages/thankyou_page.json — as duas só servem para
 * alguma coisa enquanto concordam.
 */
function autoreply_numeros(): array
{
    return [
        ['display' => '(614) 384-5917', 'tel' => '+16143845917'],
        ['display' => '(614) 769-1117', 'tel' => '+16147691117'],
    ];
}

/** Quando ligamos — os dois casos que a página de agradecimento explica. */
function autoreply_horarios(): array
{
    return [
        [
            'title' => 'During business hours',
            'hours' => 'Monday – Friday, 8:00 AM – 5:00 PM',
            'body'  => 'A member of our team will review your submission and call you at our '
                     . 'earliest opportunity during these hours. Occasionally, we may call after 5, '
                     . 'but we will not answer calls after 5.',
        ],
        [
            'title' => 'Nights & weekends',
            'hours' => 'First thing the next business day',
            'body'  => 'If you are submitting this request over the weekend or outside of our '
                     . 'regular hours, rest assured we will give you a call or text first thing on '
                     . 'the next business day.',
        ],
    ];
}

/**
 * O que fazer enquanto a ligação não vem. Os mesmos três destinos dos cartões
 * de /thank-you/ (thankyou_explore): quem leu a página e quem só abre o e-mail
 * têm de terminar nos mesmos lugares.
 */
function autoreply_links(): array
{
    return [
        [
            'title' => 'See work near you on our Project Map',
            'url'   => AUTOREPLY_SITE . '/project-map/',
            'body'  => 'Explore our interactive Project Map to find completed driveways, patios, '
                     . 'and commercial concrete projects right in your neighborhood.',
        ],
        [
            'title' => 'Our licensing, bonding, insurance & code compliance',
            'url'   => AUTOREPLY_SITE . '/licensing-insured/',
            'body'  => 'Your property is protected. Read about our full licensing, robust liability '
                     . 'insurance, structural bonding, and strict adherence to local Ohio building codes.',
        ],
        [
            'title' => 'Browse our concrete transformation gallery',
            'url'   => AUTOREPLY_SITE . '/gallery/',
            'body'  => 'Visit our Gallery for inspiration and to view the craftsmanship of our '
                     . 'stamped concrete, smooth finishes, and structural slabs.',
        ],
    ];
}

/** Pasta dos registros — a mesma de submissions.log, que é onde já se procura. */
function autoreply_dir(): ?string
{
    $dir = __DIR__ . '/../.private';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    return is_dir($dir) ? $dir : null;
}

/**
 * Uma linha JSON por tentativa. O destinatário é o único identificador
 * guardado — é o que a verificação de repetição lê de volta.
 */
function autoreply_log(array $entry): void
{
    $dir = autoreply_dir();
    if ($dir === null) return;
    $entry = ['ts' => gmdate('Y-m-d\TH:i:s\Z')] + $entry;
    @file_put_contents(
        $dir . '/lead-autoreply.log',
        json_encode($entry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n",
        FILE_APPEND | LOCK_EX
    );
}

/** Verdadeiro quando este endereço já recebeu a confirmação há pouco. */
function autoreply_enviado_recentemente(string $email): bool
{
    $dir = autoreply_dir();
    if ($dir === null) return false;
    $path = $dir . '/lead-autoreply.log';
    if (!is_file($path)) return false;

    $linhas = @file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (!$linhas) return false;

    $alvo   = strtolower($email);
    $limite = time() - AUTOREPLY_DEDUPE_SECONDS;
    // Só o fim do arquivo: uma confirmação de meses atrás não muda nada aqui, e
    // percorrer o histórico inteiro a cada lead cresce sem parar.
    foreach (array_slice($linhas, -200) as $linha) {
        $row = json_decode($linha, true);
        if (!is_array($row) || ($row['ok'] ?? false) !== true) continue;
        if (strtolower((string)($row['to'] ?? '')) !== $alvo) continue;
        if (strtotime((string)($row['ts'] ?? '')) >= $limite) return true;
    }
    return false;
}

/** Assunto, num lugar só, para o teste pela linha de comando mandar o real. */
function autoreply_assunto(): string
{
    return '🟢 We got your request — here are the numbers we call from';
}

/**
 * A metade em texto puro. Parte das pessoas lê e-mail assim, e todo filtro de
 * spam lê sempre — uma mensagem só em HTML pontua pior.
 */
function autoreply_texto(array $lead): string
{
    $first = trim((string)($lead['first'] ?? ''));

    $out  = "THANK YOU! YOUR CONCRETE PROJECT STARTS HERE.\n\n";
    $out .= 'Hi' . ($first !== '' ? ' ' . $first : ' there') . ",\n\n";
    $out .= "We have received your details and are excited to help upgrade your property\n";
    $out .= "with durable, high-quality concrete work.\n\n";

    $out .= "WHAT HAPPENS NEXT?\n\n";
    $out .= wordwrap(
        'To get you an accurate quote and clear up any questions about your project scope, '
        . 'our process always begins with a quick phone call. Calling you directly is the '
        . 'absolute fastest and most efficient way to review your site requirements and get '
        . 'you on our scheduling calendar.',
        76
    ) . "\n\n";

    $out .= "WANT TO MOVE EVEN FASTER?\n\n";
    $out .= 'Be proactive and call us right now at ' . AUTOREPLY_MAIN_TEL . ' '
        . AUTOREPLY_EXTENSION . " to speak\ndirectly with our scheduler!\n\n";

    $out .= "WHEN WILL WE CALL YOU?\n\n";
    foreach (autoreply_horarios() as $h) {
        $out .= '  ' . $h['title'] . ' — ' . $h['hours'] . "\n";
        $out .= '  ' . wordwrap($h['body'], 72, "\n  ") . "\n\n";
    }

    $out .= "PLEASE SAVE OUR OFFICIAL CONSULTATION NUMBERS\n";
    $out .= "so you know it's us calling or texting:\n\n";
    foreach (autoreply_numeros() as $n) {
        $out .= '    ' . $n['display'] . "\n";
    }
    $out .= "\n";

    $out .= "WHILE YOU WAIT, EXPLORE OUR CREDENTIALS AND PAST WORK:\n\n";
    foreach (autoreply_links() as $l) {
        $out .= '  ' . $l['title'] . "\n";
        $out .= '  ' . wordwrap($l['body'], 72, "\n  ") . "\n";
        $out .= '  ' . $l['url'] . "\n\n";
    }

    $out .= "Talk to you soon!\n\n";
    $out .= 'Questions before we call? Just reply to this email, or call us at '
        . AUTOREPLY_MAIN_TEL . ".\n\n";
    $out .= "Maxima Concrete\n";
    $out .= AUTOREPLY_ADDRESS . "\n";
    $out .= AUTOREPLY_SITE . "\n";

    return $out;
}

/**
 * A metade em HTML. Tabelas e estilo inline pelas mesmas razões de
 * email-template.php (o Outlook renderiza com o motor do Word), e as mesmas
 * cores do site, tiradas de lá.
 */
function autoreply_html(array $lead): string
{
    $fonte = EMAIL_FONTE;
    $first = trim((string)($lead['first'] ?? ''));
    $ola   = $first !== '' ? 'Hi ' . e_($first) . ',' : 'Hi there,';

    /** Rótulo de seção, o mesmo em todas. */
    $titulo = static function (string $t) use ($fonte): string {
        return '<div style="font:700 12px/1.4 ' . $fonte . ';color:' . EMAIL_SUAVE
            . ';text-transform:uppercase;letter-spacing:1px;padding:28px 0 12px;">'
            . e_($t) . '</div>';
    };

    // Quando ligamos: dois casos, uma regra cada, para a resposta do fim de
    // semana ser tão fácil de achar quanto a do dia útil.
    $horarios = '';
    foreach (autoreply_horarios() as $h) {
        $horarios .= '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" '
            . 'style="width:100%;background:' . EMAIL_FUNDO . ';border-left:3px solid ' . EMAIL_OCEAN . ';'
            . 'border-radius:0 ' . EMAIL_RAIO . ' ' . EMAIL_RAIO . ' 0;margin-bottom:10px;">'
            . '<tr><td style="padding:14px 18px;">'
            . '<div style="font:700 15px/1.4 ' . $fonte . ';color:' . EMAIL_NAVY . ';">' . e_($h['title']) . '</div>'
            . '<div style="font:600 14px/1.5 ' . $fonte . ';color:' . EMAIL_OCEAN . ';padding-top:2px;">'
            . e_($h['hours']) . '</div>'
            . '<div style="font:400 14px/1.6 ' . $fonte . ';color:' . EMAIL_TEXTO . ';padding-top:8px;">'
            . e_($h['body']) . '</div>'
            . '</td></tr></table>';
    }

    // Os números — a razão de este e-mail existir. Cada um clicável e grande o
    // bastante para ser lido de relance na notificação.
    $numeros = '';
    foreach (autoreply_numeros() as $n) {
        $numeros .= '<tr><td align="center" style="padding:6px 0;">'
            . '<a href="tel:' . e_($n['tel']) . '" style="font:700 24px/1.3 ' . $fonte . ';'
            . 'color:' . EMAIL_NAVY . ';letter-spacing:.5px;text-decoration:none;">'
            . e_($n['display']) . '</a></td></tr>';
    }

    // Enquanto espera. O título é o link: URL crua no corpo é feia e conta
    // contra a entrega.
    $links = '';
    foreach (autoreply_links() as $l) {
        $links .= '<tr><td style="padding:0 0 16px;">'
            . '<a href="' . e_($l['url']) . '" style="font:700 16px/1.4 ' . $fonte . ';'
            . 'color:' . EMAIL_OCEAN . ';text-decoration:none;">' . e_($l['title']) . ' &rarr;</a>'
            . '<div style="font:400 14px/1.6 ' . $fonte . ';color:' . EMAIL_TEXTO . ';padding-top:4px;">'
            . e_($l['body']) . '</div>'
            . '</td></tr>';
    }

    return '<!DOCTYPE html>'
    . '<html lang="en"><head><meta charset="utf-8">'
    . '<meta name="viewport" content="width=device-width,initial-scale=1">'
    . '<title>Thank you! Your concrete project starts here</title></head>'
    . '<body style="margin:0;padding:0;background-color:' . EMAIL_FUNDO . ';">'

    // Pré-cabeçalho: a linha cinza que a caixa de entrada mostra ao lado do
    // assunto. Escondida na mensagem aberta.
    . '<div style="display:none;max-height:0;overflow:hidden;opacity:0;">'
    . 'Our process starts with a quick call. It comes from (614) 384-5917 or '
    . '(614) 769-1117 &mdash; save them so you know it&rsquo;s us.</div>'

    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" '
    . 'style="background-color:' . EMAIL_FUNDO . ';padding:24px 12px;"><tr><td align="center">'
    . '<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" '
    . 'style="width:100%;max-width:600px;background:#ffffff;border:1px solid ' . EMAIL_BORDA . ';'
    . 'border-radius:' . EMAIL_RAIO . ';overflow:hidden;">'

    // Cabeçalho. bgcolor sólido primeiro: é o que o Outlook enxerga. Sem logo
    // em imagem — quase todo cliente bloqueia imagem por padrão.
    . '<tr><td bgcolor="' . EMAIL_NAVY . '" style="background-color:' . EMAIL_NAVY . ';'
    . 'background-image:linear-gradient(135deg,' . EMAIL_OCEAN . ' 0%,' . EMAIL_NAVY . ' 100%);'
    . 'padding:30px 32px;">'
    . '<div style="font:700 12px/1 ' . $fonte . ';color:#7fc4f5;letter-spacing:2.5px;'
    . 'text-transform:uppercase;">Maxima Concrete</div>'
    . '<div style="font:600 24px/1.32 ' . $fonte . ';color:#ffffff;padding-top:12px;">'
    . 'Thank you! Your concrete project starts here.</div>'
    . '</td></tr>'

    . '<tr><td style="padding:28px 32px 0;">'
    . '<div style="font:400 16px/1.6 ' . $fonte . ';color:' . EMAIL_TEXTO . ';">' . $ola . '</div>'
    . '<div style="font:400 16px/1.6 ' . $fonte . ';color:' . EMAIL_TEXTO . ';padding-top:12px;">'
    . 'We have received your details and are excited to help upgrade your property with '
    . 'durable, high-quality concrete work.</div>'

    // O que acontece agora
    . $titulo('What happens next?')
    . '<div style="font:400 15px/1.65 ' . $fonte . ';color:' . EMAIL_TEXTO . ';">'
    . 'To get you an accurate quote and clear up any questions about your project scope, our '
    . 'process always begins with a quick phone call. Calling you directly is the absolute '
    . 'fastest and most efficient way to review your site requirements and get you on our '
    . 'scheduling calendar.</div>'

    // Ligar agora, para quem não quer esperar
    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" '
    . 'style="width:100%;background:#eaf4fd;border:1px solid #cfe6f9;border-radius:' . EMAIL_RAIO . ';'
    . 'margin-top:22px;"><tr><td align="center" style="padding:22px 20px;">'
    . '<div style="font:700 12px/1.4 ' . $fonte . ';color:' . EMAIL_OCEAN . ';'
    . 'text-transform:uppercase;letter-spacing:1px;">Want to move even faster?</div>'
    . '<div style="font:400 15px/1.6 ' . $fonte . ';color:' . EMAIL_TEXTO . ';padding-top:8px;">'
    . 'Be proactive and call us right now to speak directly with our scheduler!</div>'
    . '<div style="padding-top:14px;">'
    . '<a href="' . AUTOREPLY_MAIN_TEL_HREF . '" style="display:inline-block;background:' . EMAIL_NAVY . ';'
    . 'color:#ffffff;text-decoration:none;border-radius:' . EMAIL_RAIO . ';padding:13px 24px;'
    . 'font:700 16px/1 ' . $fonte . ';">Call ' . AUTOREPLY_MAIN_TEL . '</a></div>'
    // O ramal fora do link: parte dos celulares não disca dígitos depois do
    // número, e um ramal colado ao tel: faz a ligação cair em lugar nenhum.
    . '<div style="font:600 13px/1.5 ' . $fonte . ';color:' . EMAIL_OCEAN . ';padding-top:10px;">'
    . AUTOREPLY_EXTENSION . ' &middot; Monday – Friday, 8:00 AM – 5:00 PM</div>'
    . '</td></tr></table>'

    // Quando ligamos
    . $titulo('When will we call you?')
    . $horarios

    // Os números
    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" '
    . 'style="width:100%;background:#ffffff;border:2px solid ' . EMAIL_PRIMARY . ';'
    . 'border-radius:' . EMAIL_RAIO . ';margin-top:26px;">'
    . '<tr><td align="center" style="padding:20px 20px 4px;">'
    . '<div style="font:700 12px/1.4 ' . $fonte . ';color:' . EMAIL_OCEAN . ';'
    . 'text-transform:uppercase;letter-spacing:1px;">Please save our official consultation numbers</div>'
    . '</td></tr>'
    . '<tr><td style="padding:8px 20px 0;"><table role="presentation" width="100%" '
    . 'cellpadding="0" cellspacing="0" border="0">' . $numeros . '</table></td></tr>'
    . '<tr><td align="center" style="padding:10px 24px 20px;">'
    . '<div style="font:400 14px/1.55 ' . $fonte . ';color:' . EMAIL_SUAVE . ';">'
    . 'Save them to your contacts so you know it&rsquo;s us calling or texting.</div>'
    . '</td></tr></table>'

    // Enquanto espera
    . $titulo('While you wait, explore our credentials and past work')
    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">'
    . $links . '</table>'

    // Fechamento
    . '<div style="font:700 17px/1.5 ' . $fonte . ';color:' . EMAIL_NAVY . ';padding-top:14px;">'
    . 'Talk to you soon!</div>'
    . '<div style="font:400 15px/1.65 ' . $fonte . ';color:' . EMAIL_TEXTO . ';padding:8px 0 30px;">'
    . 'Questions before we call? Just reply to this email, or call us at '
    . '<a href="' . AUTOREPLY_MAIN_TEL_HREF . '" style="color:' . EMAIL_OCEAN . ';font-weight:700;'
    . 'text-decoration:none;">' . AUTOREPLY_MAIN_TEL . '</a>.</div>'
    . '</td></tr>'

    // Assinatura
    . '<tr><td align="center" style="background:#fafbfc;border-top:1px solid ' . EMAIL_BORDA . ';'
    . 'padding:20px 32px;">'
    . '<div style="font:700 14px/1.5 ' . $fonte . ';color:' . EMAIL_NAVY . ';">Maxima Concrete</div>'
    . '<div style="font:400 13px/1.6 ' . $fonte . ';color:' . EMAIL_SUAVE . ';padding-top:4px;">'
    . e_(AUTOREPLY_ADDRESS) . '</div>'
    . '<div style="font:400 13px/1.6 ' . $fonte . ';padding-top:4px;">'
    . '<a href="' . AUTOREPLY_SITE . '" style="color:' . EMAIL_OCEAN . ';text-decoration:none;">'
    . 'maximaconcrete.com</a></div>'
    . '</td></tr>'

    . '</table></td></tr></table></body></html>';
}

/**
 * Confirma ao cliente o pedido que ele acabou de enviar.
 *
 * @param array{first_name?:string,last_name?:string,email?:string} $lead
 * @return bool se a mensagem chegou a ser aceita para envio
 */
function lead_autoreply(array $lead): bool
{
    $email = trim((string)($lead['email'] ?? ''));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        autoreply_log(['ok' => false, 'to' => $email, 'error' => 'destinatário inválido']);
        return false;
    }

    if (autoreply_enviado_recentemente($email)) {
        autoreply_log(['ok' => false, 'to' => $email, 'error' => 'pulado: confirmado há pouco']);
        return false;
    }

    $primeiro = trim((string)($lead['first_name'] ?? ''));
    $nome     = trim($primeiro . ' ' . trim((string)($lead['last_name'] ?? '')));
    $dados    = ['first' => $primeiro];

    $ok = enviar_email([
        'to'        => $email,
        'subject'   => autoreply_assunto(),
        'text'      => autoreply_texto($dados),
        'html'      => autoreply_html($dados),
        'from_name' => AUTOREPLY_FROM_NAME,
        'reply_to'  => AUTOREPLY_REPLY_TO,
    ]);

    autoreply_log(['ok' => $ok, 'to' => $email, 'name' => $nome, 'via' => mailer_ultimo_transporte()]);
    if (!$ok) {
        @error_log('[lead-autoreply.php] confirmação não enviada para ' . $email);
    }
    return $ok;
}

} // guarda function_exists

/* ── Teste pela linha de comando ────────────────────────────────────────
 *      php lead-autoreply.php test alguem@exemplo.com "First Last"
 *
 *  Manda a mensagem de verdade, para conferir o layout numa caixa de entrada
 *  real. Chama o envio direto, e não lead_autoreply(), porque a janela de
 *  repetição barraria a segunda olhada num layout ainda em ajuste.
 * -------------------------------------------------------------------- */
if (PHP_SAPI === 'cli' && isset($argv[0]) && realpath($argv[0]) === realpath(__FILE__)) {
    if (($argv[1] ?? '') !== 'test' || ($argv[2] ?? '') === '') {
        fwrite(STDERR, "uso: php lead-autoreply.php test alguem@exemplo.com \"First Last\"\n");
        exit(2);
    }

    $para  = $argv[2];
    $nome  = $argv[3] ?? 'Test Lead';
    $dados = ['first' => explode(' ', trim($nome))[0]];

    $ok = enviar_email([
        'to'        => $para,
        'subject'   => autoreply_assunto(),
        'text'      => autoreply_texto($dados),
        'html'      => autoreply_html($dados),
        'from_name' => AUTOREPLY_FROM_NAME,
        'reply_to'  => AUTOREPLY_REPLY_TO,
    ]);

    autoreply_log(['ok' => $ok, 'to' => $para, 'mode' => 'cli-test', 'via' => mailer_ultimo_transporte()]);
    echo $ok
        ? "OK    enviado para $para (via " . mailer_ultimo_transporte() . ")\n"
        : "FALHA não foi aceito — veja .private/mailer.log\n";
    exit($ok ? 0 : 1);
}
