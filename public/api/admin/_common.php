<?php
declare(strict_types=1);

/* ----------------------------------------------------------------------
 *  Maxima Concrete — admin panel shared helpers
 *
 *  Included by login.php / data.php / logout.php. Sets up a secure PHP
 *  session, JSON output, the same-origin CORS policy used elsewhere, and
 *  a simple per-IP brute-force throttle for the login endpoint.
 *
 *  The real secret (the bcrypt password hash) lives OUTSIDE the repo and
 *  outside the web root, in /.private/admin-config.php — created on the
 *  server by hand and never deployed (the repo is public). This file has
 *  no secrets and is safe to commit.
 * ---------------------------------------------------------------------- */

const ADMIN_PRIVATE_DIR = __DIR__ . '/../../.private';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

// Same-origin in production, but echo back an allowed Origin (with
// credentials) so the panel still works if served from www. or in dev.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (
    preg_match('#^https?://(www\.)?maximaconcrete\.com$#i', $origin) ||
    preg_match('#^http://localhost(:\d+)?$#i', $origin)
) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

function admin_json(int $code, array $payload): void {
    http_response_code($code);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

/** Load the server-only admin config, or null if it isn't installed yet. */
function admin_config(): ?array {
    $path = ADMIN_PRIVATE_DIR . '/admin-config.php';
    if (!is_file($path)) {
        return null;
    }
    $cfg = require $path;
    return is_array($cfg) ? $cfg : null;
}

/** Start a hardened session cookie scoped to this site. */
function admin_session_start(): void {
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'secure'   => (($_SERVER['HTTPS'] ?? '') !== '' && $_SERVER['HTTPS'] !== 'off'),
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_name('maxima_admin');
    session_start();
}

function admin_require_auth(): void {
    if (empty($_SESSION['admin'])) {
        admin_json(401, ['ok' => false, 'error' => 'Not authenticated']);
    }
    // Hard cap session age at 12h regardless of activity.
    if ((time() - (int)($_SESSION['login_ts'] ?? 0)) > 43200) {
        $_SESSION = [];
        admin_json(401, ['ok' => false, 'error' => 'Session expired']);
    }
}

function admin_client_ip(): string {
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

/* ---- Brute-force throttle (per IP, file-backed) ---------------------- */

const ADMIN_THROTTLE_WINDOW = 900;   // 15 min
const ADMIN_THROTTLE_MAX    = 8;     // failures before lockout

function admin_throttle_path(): string {
    return ADMIN_PRIVATE_DIR . '/admin-throttle.json';
}

function admin_throttle_load(): array {
    $path = admin_throttle_path();
    if (!is_file($path)) return [];
    $data = json_decode((string)@file_get_contents($path), true);
    return is_array($data) ? $data : [];
}

/** Returns true if the current IP is currently locked out. */
function admin_throttle_blocked(): bool {
    $data = admin_throttle_load();
    $ip   = admin_client_ip();
    $now  = time();
    $hits = array_filter(
        $data[$ip] ?? [],
        static fn ($t) => ($now - (int)$t) < ADMIN_THROTTLE_WINDOW
    );
    return count($hits) >= ADMIN_THROTTLE_MAX;
}

function admin_throttle_record_failure(): void {
    $data = admin_throttle_load();
    $ip   = admin_client_ip();
    $now  = time();
    $hits = array_values(array_filter(
        $data[$ip] ?? [],
        static fn ($t) => ($now - (int)$t) < ADMIN_THROTTLE_WINDOW
    ));
    $hits[] = $now;
    $data[$ip] = $hits;
    @file_put_contents(admin_throttle_path(), json_encode($data), LOCK_EX);
}

function admin_throttle_clear(): void {
    $data = admin_throttle_load();
    unset($data[admin_client_ip()]);
    @file_put_contents(admin_throttle_path(), json_encode($data), LOCK_EX);
}
