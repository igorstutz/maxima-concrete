<?php
declare(strict_types=1);

/* ----------------------------------------------------------------------
 *  Maxima Concrete — envio de e-mail
 *
 *  Por que existe: o mail() da Hostinger não consegue provar que a mensagem
 *  é do domínio. A hospedagem compartilhada reescreve o envelope do
 *  remetente com o hostname do servidor (srv1537.main-hosting.eu) e descarta
 *  o `-f` que o PHP pede — é proteção contra um site falsificar o remetente
 *  de outro no mesmo servidor. O efeito colateral é que o SPF passa a ser
 *  verificado contra main-hosting.eu, que nada tem a ver com
 *  maximaconcrete.com, e não há DKIM assinando pelo domínio.
 *
 *  Resultado prático: o Gmail estampa "via srv1537.main-hosting.eu" e manda
 *  para spam. Nenhum ajuste de cabeçalho resolve — a assinatura tem de vir
 *  de quem tem a chave do domínio.
 *
 *  Daí o serviço externo: o domínio é verificado publicando DKIM no DNS, e a
 *  partir daí toda mensagem sai assinada como maximaconcrete.com.
 *
 *  Usa a API HTTPS, não SMTP: hospedagem compartilhada costuma bloquear as
 *  portas de saída 25/465/587, e a 443 nunca é bloqueada.
 *
 *  Brevo e Resend são aceitos. Hoje vale o Brevo: o DNS do domínio está na
 *  Wix, que não cria registro MX em subdomínio — e o Resend exige um em
 *  `send` para verificar o domínio. O Brevo se verifica só com TXT, que a Wix
 *  suporta (o _dmarc do domínio já é um). Quando o DNS sair da Wix, trocar é
 *  questão de mudar duas linhas do arquivo de configuração.
 *
 *  Credenciais em .private/mailer.php (fora do repositório, que é público):
 *
 *      <?php
 *      return [
 *          'api_key'  => 'xkeysib-...',   // ou 're_...' para o Resend
 *          'from'     => 'Maxima Concrete Website <no-reply@maximaconcrete.com>',
 *          // 'provider' => 'brevo',      // opcional: deduzido da chave
 *      ];
 *
 *  Sem esse arquivo tudo continua saindo pelo mail() de antes — o site não
 *  quebra, só segue com o problema de entrega.
 * ---------------------------------------------------------------------- */

/** Pasta .private, procurada nos dois lugares que os scripts deste site usam. */
function mailer_private_dir(): ?string
{
    foreach ([__DIR__ . '/../.private', __DIR__ . '/../../.private'] as $dir) {
        if (is_dir($dir)) return $dir;
    }
    return null;
}

/** Configuração do serviço de envio, ou null se ainda não foi instalada. */
function mailer_config(): ?array
{
    static $cache = false;
    if ($cache !== false) return $cache;

    $cache = null;
    $dir = mailer_private_dir();
    if ($dir === null) return null;

    // Aceita o nome antigo para não quebrar uma instalação já feita.
    $cfg = @include $dir . '/mailer.php';
    if (!is_array($cfg) || empty($cfg['api_key'])) {
        $cfg = @include $dir . '/resend.php';
    }
    if (!is_array($cfg) || empty($cfg['api_key'])) return null;

    $chave = (string)$cfg['api_key'];
    // O provedor sai do prefixo da chave: as duas são inconfundíveis, e assim
    // trocar de serviço é só trocar a chave, sem risco de esquecer um campo.
    $provedor = (string)($cfg['provider'] ?? '');
    if ($provedor === '') {
        // strncmp e não str_starts_with: aquela exige PHP 8 e a versão do
        // servidor não está fixada — um erro fatal aqui derruba o formulário.
        $provedor = strncmp($chave, 're_', 3) === 0 ? 'resend' : 'brevo';
    }

    $cache = [
        'api_key'  => $chave,
        'from'     => (string)($cfg['from'] ?? 'Maxima Concrete Website <no-reply@maximaconcrete.com>'),
        'provider' => $provedor,
    ];
    return $cache;
}

/**
 * Separa "Nome <email@dominio>" em nome e endereço. O Brevo pede os dois em
 * campos distintos, ao contrário do Resend, que aceita a linha inteira.
 */
function mailer_split_address(string $endereco): array
{
    if (preg_match('/^\s*(.*?)\s*<([^>]+)>\s*$/', $endereco, $m)) {
        return ['nome' => trim($m[1], " \t\"'"), 'email' => trim($m[2])];
    }
    return ['nome' => '', 'email' => trim($endereco)];
}

/** Registro de falha de envio, para diagnóstico. Sem chave, sem dado pessoal. */
function mailer_log(string $linha): void
{
    $dir = mailer_private_dir();
    if ($dir === null) return;
    @file_put_contents(
        $dir . '/mailer.log',
        '[' . gmdate('Y-m-d\TH:i:s\Z') . '] ' . $linha . "\n",
        FILE_APPEND | LOCK_EX
    );
}

/** POST em JSON. Devolve [aceito, status, resposta]. */
function mailer_post(string $url, array $cabecalhos, array $payload): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($payload),
        CURLOPT_HTTPHEADER     => array_merge($cabecalhos, ['Content-Type: application/json']),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 8,
        CURLOPT_CONNECTTIMEOUT => 4,
    ]);
    $resposta = curl_exec($ch);
    $status   = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $erro     = curl_error($ch);
    curl_close($ch);

    if ($status >= 200 && $status < 300) return [true, $status, ''];
    return [false, $status, $erro . ' ' . substr((string)$resposta, 0, 300)];
}

/**
 * Envia pelo Brevo. Devolve true se aceito.
 *
 * Só é chamada quando há configuração. Falha aqui não é fatal: quem chama
 * cai para o mail(), que ao menos entrega (ainda que em spam).
 */
function mailer_send_brevo(array $cfg, array $msg): bool
{
    $de      = mailer_split_address($cfg['from']);
    $payload = [
        'sender'      => ['name' => $de['nome'], 'email' => $de['email']],
        'to'          => [['email' => $msg['to']]],
        'subject'     => $msg['subject'],
        'textContent' => $msg['text'],
    ];
    if (!empty($msg['reply_to'])) {
        $r = mailer_split_address((string)$msg['reply_to']);
        $payload['replyTo'] = array_filter(['email' => $r['email'], 'name' => $r['nome']]);
    }
    if (!empty($msg['attachment']['name']) && isset($msg['attachment']['data'])) {
        $payload['attachment'] = [[
            'name'    => $msg['attachment']['name'],
            'content' => base64_encode((string)$msg['attachment']['data']),
        ]];
    }

    [$ok, $status, $detalhe] = mailer_post(
        'https://api.brevo.com/v3/smtp/email',
        ['api-key: ' . $cfg['api_key'], 'Accept: application/json'],
        $payload
    );
    if (!$ok) mailer_log("brevo status=$status $detalhe");
    return $ok;
}

/**
 * Envia pelo Resend. Devolve true se aceito. Mantido para quando o DNS sair
 * da Wix e o MX em subdomínio deixar de ser impedimento.
 */
function mailer_send_resend(array $cfg, array $msg): bool
{
    $payload = [
        'from'    => $cfg['from'],
        'to'      => [$msg['to']],
        'subject' => $msg['subject'],
        'text'    => $msg['text'],
    ];
    if (!empty($msg['reply_to'])) {
        $payload['reply_to'] = $msg['reply_to'];
    }
    if (!empty($msg['attachment']['name']) && isset($msg['attachment']['data'])) {
        $payload['attachments'] = [[
            'filename' => $msg['attachment']['name'],
            'content'  => base64_encode((string)$msg['attachment']['data']),
        ]];
    }

    [$ok, $status, $detalhe] = mailer_post(
        'https://api.resend.com/emails',
        ['Authorization: Bearer ' . $cfg['api_key']],
        $payload
    );
    if (!$ok) mailer_log("resend status=$status $detalhe");
    return $ok;
}

/**
 * Envia uma mensagem a UM destinatário.
 *
 * @param array $msg to, subject, text, reply_to (opcional),
 *                   attachment => ['name' => ..., 'data' => ...] (opcional)
 */
function enviar_email(array $msg): bool
{
    // Uma vez que a API falhou nesta requisição, não insiste nas mensagens
    // seguintes. O lead vai para seis destinatários: se a API estiver fora do
    // ar, seriam seis esperas de 8 segundos até o visitante ver resposta, e ele
    // desistiria antes. O que derruba a primeira (chave inválida, domínio não
    // verificado, API indisponível) derruba as outras cinco igual.
    static $apiCaiu = false;

    $cfg = mailer_config();
    if ($cfg !== null && !$apiCaiu) {
        $enviou = $cfg['provider'] === 'resend'
            ? mailer_send_resend($cfg, $msg)
            : mailer_send_brevo($cfg, $msg);
        if ($enviou) return true;
        $apiCaiu = true;
    }

    // Caminho antigo. Vale enquanto o domínio não está verificado no Resend, e
    // como rede de segurança se a API estiver fora do ar: melhor um e-mail em
    // spam do que um lead perdido.
    $fromNome  = 'Maxima Concrete Website';
    $fromEmail = 'no-reply@maximaconcrete.com';
    $hostFrom  = substr($fromEmail, strpos($fromEmail, '@') + 1);

    $headers   = [];
    $headers[] = "From: $fromNome <$fromEmail>";
    if (!empty($msg['reply_to'])) $headers[] = 'Reply-To: ' . $msg['reply_to'];
    $headers[] = 'Date: ' . date('r');
    $headers[] = sprintf(
        'Message-ID: <%s.%s@%s>',
        gmdate('YmdHis'),
        bin2hex(random_bytes(8)),
        $hostFrom
    );
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'X-Mailer: Maxima Concrete Website';

    if (!empty($msg['attachment']['name']) && isset($msg['attachment']['data'])) {
        $limite    = '=_' . md5(uniqid('', true));
        $headers[] = "Content-Type: multipart/mixed; boundary=\"$limite\"";
        $nome      = $msg['attachment']['name'];
        $corpo     = "--$limite\r\n"
            . "Content-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n"
            . $msg['text'] . "\r\n"
            . "--$limite\r\n"
            . "Content-Type: application/octet-stream; name=\"$nome\"\r\n"
            . "Content-Transfer-Encoding: base64\r\n"
            . "Content-Disposition: attachment; filename=\"$nome\"\r\n\r\n"
            . chunk_split(base64_encode((string)$msg['attachment']['data'])) . "\r\n"
            . "--$limite--";
    } else {
        $headers[] = 'Content-Type: text/plain; charset=utf-8';
        $headers[] = 'Content-Transfer-Encoding: 8bit';
        $corpo     = $msg['text'];
    }

    return @mail(
        $msg['to'],
        $msg['subject'],
        $corpo,
        implode("\r\n", $headers),
        '-f ' . $fromEmail
    );
}
