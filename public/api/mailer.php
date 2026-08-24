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
 *  Daí o Resend: o domínio é verificado publicando DKIM no DNS, e a partir
 *  daí toda mensagem sai assinada como maximaconcrete.com.
 *
 *  Usa a API HTTPS, não SMTP: hospedagem compartilhada costuma bloquear as
 *  portas de saída 25/465/587, e a 443 nunca é bloqueada.
 *
 *  Credenciais em .private/resend.php (fora do repositório, que é público):
 *
 *      <?php
 *      return [
 *          'api_key' => 're_...',
 *          'from'    => 'Maxima Concrete Website <no-reply@maximaconcrete.com>',
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

/** Configuração do Resend, ou null se ainda não foi instalada. */
function mailer_config(): ?array
{
    static $cache = false;
    if ($cache !== false) return $cache;

    $cache = null;
    $dir = mailer_private_dir();
    if ($dir !== null) {
        $cfg = @include $dir . '/resend.php';
        if (is_array($cfg) && !empty($cfg['api_key'])) {
            $cache = [
                'api_key' => (string)$cfg['api_key'],
                'from'    => (string)($cfg['from'] ?? 'Maxima Concrete Website <no-reply@maximaconcrete.com>'),
            ];
        }
    }
    return $cache;
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

/**
 * Envia por Resend. Devolve true se aceito.
 *
 * Só é chamada quando há configuração. Falha aqui não é fatal: quem chama
 * cai para o mail(), que ao menos entrega (ainda que em spam).
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

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($payload),
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $cfg['api_key'],
            'Content-Type: application/json',
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 8,
        CURLOPT_CONNECTTIMEOUT => 4,
    ]);
    $resposta = curl_exec($ch);
    $status   = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $erroCurl = curl_error($ch);
    curl_close($ch);

    if ($status >= 200 && $status < 300) return true;

    mailer_log(sprintf(
        'resend status=%d erro=%s resposta=%s',
        $status,
        $erroCurl,
        substr((string)$resposta, 0, 300)
    ));
    return false;
}

/**
 * Envia uma mensagem a UM destinatário.
 *
 * @param array $msg to, subject, text, reply_to (opcional),
 *                   attachment => ['name' => ..., 'data' => ...] (opcional)
 */
function enviar_email(array $msg): bool
{
    // Uma vez que o Resend falhou nesta requisição, não insiste nas mensagens
    // seguintes. O lead vai para seis destinatários: se a API estiver fora do
    // ar, seriam seis esperas de 8 segundos até o visitante ver resposta, e ele
    // desistiria antes. O que derruba a primeira (chave inválida, domínio não
    // verificado, API indisponível) derruba as outras cinco igual.
    static $resendCaiu = false;

    $cfg = mailer_config();
    if ($cfg !== null && !$resendCaiu) {
        if (mailer_send_resend($cfg, $msg)) return true;
        $resendCaiu = true;
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
