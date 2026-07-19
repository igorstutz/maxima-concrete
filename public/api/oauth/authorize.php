<?php
declare(strict_types=1);

/* ----------------------------------------------------------------------
 *  GitHub OAuth proxy — STEP 1 (authorize)
 *
 *  O Sveltia/Decap CMS abre este endpoint num popup para iniciar o login
 *  GitHub. client_id/secret vivem SOMENTE em /.private/oauth-config.php
 *  no servidor (nunca no repositório público).
 *
 *  A "Authorization callback URL" do OAuth App do GitHub deve ser:
 *      https://maximaconcrete.com/api/oauth/callback.php
 * ---------------------------------------------------------------------- */

$cfg = @include __DIR__ . '/../../.private/oauth-config.php';
if (!is_array($cfg) || empty($cfg['client_id'])) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'OAuth is not configured on the server.';
    exit;
}

session_name('maxima_oauth');
session_start();

$state = bin2hex(random_bytes(16));
$_SESSION['oauth_state'] = $state;

$params = http_build_query([
    'client_id'    => $cfg['client_id'],
    'redirect_uri' => 'https://maximaconcrete.com/api/oauth/callback.php',
    'scope'        => $cfg['scope'] ?? 'public_repo',
    'state'        => $state,
    'allow_signup' => 'false',
]);

header('Location: https://github.com/login/oauth/authorize?' . $params, true, 302);
exit;
