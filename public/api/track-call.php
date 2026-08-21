<?php
declare(strict_types=1);

/* ----------------------------------------------------------------------
 *  Maxima Concrete — "call" button click tracker.
 *
 *  Any <a href="tel:..."> click on the site fires a beacon here. We append
 *  one JSON line per click to /.private/call-clicks.log so the admin panel
 *  can show how many calls were initiated, by date and by page location.
 *
 *  No auth: this only ever WRITES a click count, never reads anything back.
 *  It accepts only same-origin POSTs and caps the body size.
 * ---------------------------------------------------------------------- */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$refOk  = $origin === ''
    || preg_match('#^https?://(www\.)?maximaconcrete\.com$#i', $origin)
    || preg_match('#^http://localhost(:\d+)?$#i', $origin);

if ($origin !== '' && $refOk) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !$refOk) {
    http_response_code(204); // swallow silently — this is fire-and-forget
    exit;
}

$raw  = substr((string)file_get_contents('php://input'), 0, 2000);
$body = json_decode($raw, true);

function track_clean(string $v): string {
    return substr(str_replace(["\r", "\n"], '', trim($v)), 0, 120);
}

$location = track_clean(is_array($body) ? (string)($body['location'] ?? '') : '');
$page     = track_clean(is_array($body) ? (string)($body['page'] ?? '') : '');

$dir = __DIR__ . '/../.private';
if (!is_dir($dir)) {
    @mkdir($dir, 0700, true);
}
$entry = [
    'ts'       => gmdate('Y-m-d\TH:i:s\Z'),
    'location' => $location !== '' ? $location : 'unknown',
    'page'     => $page,
    'ip'       => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'ua'       => substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 200),
];
@file_put_contents(
    $dir . '/call-clicks.log',
    json_encode($entry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n",
    FILE_APPEND | LOCK_EX
);

http_response_code(204);
