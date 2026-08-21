<?php
declare(strict_types=1);

/* ----------------------------------------------------------------------
 *  Maxima Concrete — API de Conversões do Meta (envio servidor-a-servidor)
 *
 *  Reporta o mesmo lead que o Pixel já reporta pelo navegador. Serve para o
 *  que o navegador não cobre: bloqueador de anúncios, aba fechada antes do
 *  envio, iOS restringindo o Pixel. O Meta junta os dois pelo `event_id` —
 *  que é o mesmo `lead_id` gerado no formulário — e conta UM lead, não dois.
 *
 *  Credenciais em /.private/meta-capi.php (fora do repositório, que é público):
 *
 *      <?php
 *      return [
 *          'pixel_id'        => '1256309001596455',
 *          'access_token'    => '...',
 *          'test_event_code' => '',  // preencher só ao usar Test Events
 *      ];
 *
 *  Sem esse arquivo a função não faz nada — o site funciona igual.
 * ---------------------------------------------------------------------- */

/** Hash no formato que o Meta exige: minúsculo, sem espaços nas pontas, SHA-256. */
function meta_hash(string $valor): string
{
    $limpo = trim(mb_strtolower($valor, 'UTF-8'));
    return $limpo === '' ? '' : hash('sha256', $limpo);
}

/** Telefone só com dígitos e código do país, como o Meta pede (sem "+"). */
function meta_phone_digits(string $phone): string
{
    $d = preg_replace('/\D/', '', $phone) ?? '';
    if ($d === '') return '';
    if (strlen($d) === 10) return '1' . $d;      // número dos EUA sem o país
    return $d;
}

/** Acrescenta o campo hasheado só quando há valor (campo vazio piora a correspondência). */
function meta_put(array &$dados, string $chave, string $valor): void
{
    $h = meta_hash($valor);
    if ($h !== '') $dados[$chave] = [$h];
}

/**
 * Envia um evento "Lead". Nunca lança e nunca interrompe: se o Meta estiver
 * fora do ar ou o token expirar, o lead já foi entregue por e-mail e gravado no
 * log — a medição é o que pode falhar, não o atendimento ao cliente.
 *
 * @param array $lead campos do formulário já validados
 */
function meta_capi_send_lead(array $lead): void
{
    $cfg = @include __DIR__ . '/../../.private/meta-capi.php';
    if (!is_array($cfg) || empty($cfg['pixel_id']) || empty($cfg['access_token'])) {
        return; // não configurado: silêncio, sem erro
    }

    $userData = [];
    meta_put($userData, 'em', (string)($lead['email'] ?? ''));
    meta_put($userData, 'ph', meta_phone_digits((string)($lead['phone'] ?? '')));
    meta_put($userData, 'fn', (string)($lead['first_name'] ?? ''));
    meta_put($userData, 'ln', (string)($lead['last_name'] ?? ''));
    meta_put($userData, 'zp', (string)($lead['zip_code'] ?? ''));
    meta_put($userData, 'ct', (string)($lead['city'] ?? ''));
    meta_put($userData, 'country', 'us');

    // Estes NÃO são hasheados — o Meta usa para casar com a sessão do navegador.
    $userData['client_ip_address'] = (string)($_SERVER['REMOTE_ADDR'] ?? '');
    $userData['client_user_agent'] = (string)($_SERVER['HTTP_USER_AGENT'] ?? '');
    // Cookies do Pixel: chegam porque o formulário é enviado no mesmo domínio.
    // O fbp identifica o navegador; o fbc guarda o clique no anúncio e é o que
    // liga a conversão à campanha.
    if (!empty($_COOKIE['_fbp'])) $userData['fbp'] = (string)$_COOKIE['_fbp'];
    if (!empty($_COOKIE['_fbc'])) $userData['fbc'] = (string)$_COOKIE['_fbc'];

    $path = (string)($lead['page_url'] ?? '/');
    if ($path === '' || $path[0] !== '/') $path = '/' . $path;

    $evento = [
        'event_name'       => 'Lead',
        'event_time'       => time(),
        'event_id'         => (string)($lead['lead_id'] ?? ''),
        'event_source_url' => 'https://maximaconcrete.com' . $path,
        'action_source'    => 'website',
        'user_data'        => $userData,
        'custom_data'      => [
            'content_name'     => (string)($lead['form'] ?? 'contact'),
            'content_category' => $path,
        ],
    ];

    $payload = ['data' => [$evento]];
    if (!empty($cfg['test_event_code'])) {
        $payload['test_event_code'] = (string)$cfg['test_event_code'];
    }

    $url = sprintf(
        'https://graph.facebook.com/v21.0/%s/events?access_token=%s',
        rawurlencode((string)$cfg['pixel_id']),
        rawurlencode((string)$cfg['access_token'])
    );

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($payload),
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 5,
        CURLOPT_CONNECTTIMEOUT => 3,
    ]);
    $resposta = curl_exec($ch);
    $status   = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $erroCurl = curl_error($ch);
    curl_close($ch);

    // Registro enxuto para diagnóstico: sem token, sem dado pessoal.
    if ($status !== 200) {
        $log = sprintf(
            "[%s] meta-capi status=%d event_id=%s erro=%s resposta=%s\n",
            gmdate('Y-m-d\TH:i:s\Z'),
            $status,
            (string)($lead['lead_id'] ?? ''),
            $erroCurl,
            substr((string)$resposta, 0, 300)
        );
        @file_put_contents(__DIR__ . '/../../.private/meta-capi.log', $log, FILE_APPEND | LOCK_EX);
    }
}
