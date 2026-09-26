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

/**
 * Read a JSON-lines log into an array of records (newest last).
 *
 * Com $comId, cada registro recebe um `id` derivado do texto original da linha.
 * É assim que o painel consegue apagar um lead específico: o log não tem chave
 * própria, e usar a posição na lista quebraria assim que outro fosse removido.
 */
function read_jsonl(string $path, int $cap = 0, bool $comId = false): array {
    if (!is_file($path)) return [];
    $out   = [];
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) return [];
    if ($cap > 0 && count($lines) > $cap) {
        $lines = array_slice($lines, -$cap);
    }
    foreach ($lines as $line) {
        $row = json_decode($line, true);
        if (!is_array($row)) continue;
        if ($comId) $row['id'] = substr(sha1($line), 0, 16);
        $out[] = $row;
    }
    return $out;
}

$submissions = read_jsonl(ADMIN_PRIVATE_DIR . '/submissions.log', 0, true);
$callsRaw    = read_jsonl(ADMIN_PRIVATE_DIR . '/call-clicks.log', 20000);

/** Só o essencial de uma origem, para o painel agrupar. */
function origem_curta($t): ?array {
    if (!is_array($t)) return null;
    $o = array_filter([
        'channel'  => (string)($t['channel'] ?? ''),
        'source'   => (string)($t['source'] ?? ''),
        'campaign' => (string)($t['campaign'] ?? ''),
    ], static fn($v) => $v !== '');
    return $o ?: null;
}

// Clique em ligar: fica só o que o painel usa. A jornada completa continua no
// log, mas mandá-la para o navegador em cada clique inflaria a resposta — são
// muito mais cliques que formulários.
$calls = array_map(static function ($c) {
    $a = is_array($c['attribution'] ?? null) ? $c['attribution'] : null;
    return [
        'ts'       => $c['ts'] ?? null,
        'location' => $c['location'] ?? 'unknown',
        'page'     => $c['page'] ?? '',
        // O visitante que ligou: é por ele que o painel acha o lead que ligou
        // depois de enviar o formulário (da página de agradecimento, quase sempre).
        'vid'      => $a ? (string)($a['vid'] ?? '') : '',
        'attr'     => $a ? array_filter([
            'first'         => origem_curta($a['first'] ?? null),
            'last'          => origem_curta($a['last'] ?? null),
            'lastNonDirect' => origem_curta($a['lastNonDirect'] ?? null),
            'sessions'      => (int)($a['sessions'] ?? 0),
        ]) : null,
    ];
}, $callsRaw);

/**
 * Sessões do site, JÁ AGREGADAS por dia e canal.
 *
 * Mandar uma linha por sessão seria mandar o tráfego inteiro para o navegador —
 * cresce sem teto e o painel não usa sessão individual para nada. Agregado, a
 * resposta tem o tamanho do calendário (dias × canais) por mais tráfego que o
 * site receba, e é o que permite calcular conversão por canal: leads ÷ sessões.
 */
$sessions = [];
$totalSessoes = 0;
$mes = new DateTimeImmutable('first day of this month', new DateTimeZone('UTC'));
for ($i = 0; $i < 13; $i++) {
    $arquivo = ADMIN_PRIVATE_DIR . '/sessions-' . $mes->modify("-$i month")->format('Y-m') . '.log';
    if (!is_file($arquivo)) continue;
    foreach (read_jsonl($arquivo, 120000) as $s) {
        $ts = (string)($s['ts'] ?? '');
        if ($ts === '') continue;
        $dia = substr($ts, 0, 10);
        $canal = (string)($s['channel'] ?? 'Direct');
        $chave = $dia . '|' . $canal;
        if (!isset($sessions[$chave])) {
            $sessions[$chave] = ['day' => $dia, 'channel' => $canal, 'count' => 0, 'visitors' => []];
        }
        $sessions[$chave]['count']++;
        $vid = (string)($s['vid'] ?? '');
        if ($vid !== '') $sessions[$chave]['visitors'][$vid] = true;
        $totalSessoes++;
    }
}
$sessions = array_values(array_map(static function ($r) {
    return [
        'day'      => $r['day'],
        'channel'  => $r['channel'],
        'count'    => $r['count'],
        'visitors' => count($r['visitors']),
    ];
}, $sessions));

admin_json(200, [
    'ok'          => true,
    'submissions' => $submissions,
    'calls'       => $calls,
    'callsCapped' => count($callsRaw) >= 20000,
    'sessions'    => $sessions,
    'sessionsTotal' => $totalSessoes,
    'generatedAt' => gmdate('Y-m-d\TH:i:s\Z'),
]);
