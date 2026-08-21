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
if (!$cfg || empty($cfg['password_hash'])) {
    admin_json(503, ['ok' => false, 'error' => 'Admin is not configured yet.']);
}

$raw  = file_get_contents('php://input');
$body = json_decode((string)$raw, true);
$password = is_array($body) ? (string)($body['password'] ?? '') : (string)($_POST['password'] ?? '');

if ($password !== '' && password_verify($password, $cfg['password_hash'])) {
    session_regenerate_id(true);
    $_SESSION['admin']    = true;
    $_SESSION['login_ts'] = time();
    admin_throttle_clear();
    admin_json(200, ['ok' => true]);
}

admin_throttle_record_failure();
usleep(700000); // ~0.7s — slow down automated guessing
admin_json(401, ['ok' => false, 'error' => 'Incorrect password.']);
