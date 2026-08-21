<?php
declare(strict_types=1);

/* ----------------------------------------------------------------------
 *  Admin panel data feed. Returns, only for an authenticated session:
 *    - submissions: every contact-form lead (from /.private/submissions.log)
 *    - calls:       every "call" button click (from /.private/call-clicks.log)
 *  Both logs are JSON-lines. Malformed lines are skipped.
 * ---------------------------------------------------------------------- */

require __DIR__ . '/_common.php';
admin_session_start();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

admin_require_auth();

/** Read a JSON-lines log into an array of records (newest last). */
function read_jsonl(string $path, int $cap = 0): array {
    if (!is_file($path)) return [];
    $out   = [];
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) return [];
    if ($cap > 0 && count($lines) > $cap) {
        $lines = array_slice($lines, -$cap);
    }
    foreach ($lines as $line) {
        $row = json_decode($line, true);
        if (is_array($row)) $out[] = $row;
    }
    return $out;
}

$submissions = read_jsonl(ADMIN_PRIVATE_DIR . '/submissions.log');
$callsRaw    = read_jsonl(ADMIN_PRIVATE_DIR . '/call-clicks.log', 20000);

// Trim call records to just what the panel needs (no I/UA payload).
$calls = array_map(static function ($c) {
    return [
        'ts'       => $c['ts'] ?? null,
        'location' => $c['location'] ?? 'unknown',
        'page'     => $c['page'] ?? '',
    ];
}, $callsRaw);

admin_json(200, [
    'ok'          => true,
    'submissions' => $submissions,
    'calls'       => $calls,
    'callsCapped' => count($callsRaw) >= 20000,
    'generatedAt' => gmdate('Y-m-d\TH:i:s\Z'),
]);
