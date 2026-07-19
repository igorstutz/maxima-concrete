<?php
declare(strict_types=1);

/* ----------------------------------------------------------------------
 *  GitHub OAuth proxy — STEP 2 (callback)
 *
 *  O GitHub redireciona de volta com ?code=...&state=.... Verificamos o
 *  state, trocamos o code por um access token e entregamos o token à
 *  janela do CMS via handshake postMessage ("authorizing:github" →
 *  "authorization:github:...").
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

$code  = (string)($_GET['code'] ?? '');
$state = (string)($_GET['state'] ?? '');
$expected = (string)($_SESSION['oauth_state'] ?? '');
unset($_SESSION['oauth_state']);

if ($code === '' || $state === '' || $expected === '' || !hash_equals($expected, $state)) {
    http_response_code(400);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Invalid or expired OAuth state. Please try logging in again.';
    exit;
}

$ch = curl_init('https://github.com/login/oauth/access_token');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ['Accept: application/json', 'User-Agent: maxima-concrete-cms'],
    CURLOPT_POSTFIELDS     => http_build_query([
        'client_id'     => $cfg['client_id'],
        'client_secret' => $cfg['client_secret'],
        'code'          => $code,
        'redirect_uri'  => 'https://maximaconcrete.com/api/oauth/callback.php',
    ]),
    CURLOPT_TIMEOUT        => 15,
]);
$resp = curl_exec($ch);
$data = is_string($resp) ? json_decode($resp, true) : null;
curl_close($ch);

$token = is_array($data) ? (string)($data['access_token'] ?? '') : '';

if ($token === '') {
    $result = ['error' => 'No access token returned by GitHub.'];
    $message = 'authorization:github:error:' . json_encode($result);
} else {
    $result = ['token' => $token, 'provider' => 'github'];
    $message = 'authorization:github:success:' . json_encode($result);
}

header('Content-Type: text/html; charset=utf-8');
?>
<!doctype html>
<html lang="en">
<head><meta charset="utf-8" /><title>Completing sign-in…</title></head>
<body>
<p>Completing sign-in… you can close this window.</p>
<script>
  (function () {
    var message = <?php echo json_encode($message); ?>;
    function receiveMessage(e) {
      window.opener.postMessage(message, e.origin);
      window.removeEventListener("message", receiveMessage, false);
    }
    if (window.opener) {
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    }
  })();
</script>
</body>
</html>
