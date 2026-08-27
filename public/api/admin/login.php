<?php
declare(strict_types=1);

require __DIR__ . '/_common.php';
admin_session_start();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    admin_json(405, ['ok' => false, 'error' => 'Method not allowed']);
}

if (admin_throttle_blocked()) {
    admin_json(429, ['ok' => false, 'error' => 'Too many attempts. Try again in a few minutes.']);
}

$cfg = admin_config();

/*
 * Mais de uma senha vale para entrar.
 *
 * Serve para dar acesso a outra pessoa sem contar a senha de ninguém, e para
 * trocar uma senha sem derrubar quem está usando a outra: acrescenta-se a nova,
 * e a antiga sai depois.
 *
 * `password_hash` (uma) e `password_hashes` (lista) são aceitos juntos — o
 * arquivo que já existe no servidor continua valendo sem ser alterado.
 */
$hashes = [];
if (!empty($cfg['password_hash'])) {
    $hashes[] = (string)$cfg['password_hash'];
}
if (!empty($cfg['password_hashes']) && is_array($cfg['password_hashes'])) {
    foreach ($cfg['password_hashes'] as $h) {
        if (is_string($h) && $h !== '') $hashes[] = $h;
    }
}
if (!$cfg || !$hashes) {
    admin_json(503, ['ok' => false, 'error' => 'Admin is not configured yet.']);
}

$raw  = file_get_contents('php://input');
$body = json_decode((string)$raw, true);
$password = is_array($body) ? (string)($body['password'] ?? '') : (string)($_POST['password'] ?? '');

$ok = false;
if ($password !== '') {
    // Percorre a lista inteira mesmo depois de acertar: sair no primeiro acerto
    // faria o tempo de resposta variar conforme a posição da senha na lista.
    foreach ($hashes as $h) {
        if (password_verify($password, $h)) $ok = true;
    }
}

if ($ok) {
    session_regenerate_id(true);
    $_SESSION['admin']    = true;
    $_SESSION['login_ts'] = time();
    admin_throttle_clear();
    admin_json(200, ['ok' => true]);
}

admin_throttle_record_failure();
usleep(700000); // ~0.7s — slow down automated guessing
admin_json(401, ['ok' => false, 'error' => 'Incorrect password.']);
