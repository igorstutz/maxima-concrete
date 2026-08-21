<?php
declare(strict_types=1);

/* ----------------------------------------------------------------------
 *  Remove um lead da listagem do painel.
 *
 *  Serve para o que aparece em toda caixa de entrada: envio de teste, spam,
 *  duplicata. Só responde a sessão autenticada.
 *
 *  O registro NÃO é destruído: a linha sai de submissions.log e vai para
 *  submissions-deleted.log, com a data da remoção. Se alguém apagar por engano
 *  o pedido de um cliente de verdade, ele continua recuperável — o histórico de
 *  leads é a coisa mais valiosa que este site guarda.
 *
 *  O `id` é o mesmo que data.php devolve: os 16 primeiros caracteres do sha1 da
 *  linha original. Identifica o registro sem depender da posição na lista.
 * ---------------------------------------------------------------------- */

require __DIR__ . '/_common.php';
admin_session_start();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

admin_require_auth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    admin_json(405, ['ok' => false, 'error' => 'Method not allowed']);
}

$entrada = json_decode((string)file_get_contents('php://input'), true);
$ids = [];
if (is_array($entrada)) {
    if (isset($entrada['id'])) {
        $ids = [(string)$entrada['id']];
    } elseif (isset($entrada['ids']) && is_array($entrada['ids'])) {
        $ids = array_map('strval', $entrada['ids']);
    }
}
$ids = array_values(array_filter($ids, static fn ($i) => preg_match('/^[a-f0-9]{16}$/', $i) === 1));

if (!$ids) {
    admin_json(400, ['ok' => false, 'error' => 'Nothing to delete']);
}

$origem  = ADMIN_PRIVATE_DIR . '/submissions.log';
$lixeira = ADMIN_PRIVATE_DIR . '/submissions-deleted.log';

if (!is_file($origem)) {
    admin_json(404, ['ok' => false, 'error' => 'No submissions yet']);
}

$fh = fopen($origem, 'r+');
if ($fh === false) {
    admin_json(500, ['ok' => false, 'error' => 'Could not open the log']);
}
flock($fh, LOCK_EX);

$mantidas  = [];
$removidas = [];
rewind($fh);
while (($linha = fgets($fh)) !== false) {
    $limpa = rtrim($linha, "\r\n");
    if ($limpa === '') continue;
    if (in_array(substr(sha1($limpa), 0, 16), $ids, true)) {
        $removidas[] = $limpa;
    } else {
        $mantidas[] = $limpa;
    }
}

if ($removidas) {
    // Primeiro guarda na lixeira; só depois reescreve o log de origem.
    $carimbo = gmdate('Y-m-d\TH:i:s\Z');
    $registro = '';
    foreach ($removidas as $linha) {
        $registro .= json_encode(['deleted_at' => $carimbo, 'record' => json_decode($linha, true)],
            JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n";
    }
    @file_put_contents($lixeira, $registro, FILE_APPEND | LOCK_EX);

    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, $mantidas ? implode("\n", $mantidas) . "\n" : '');
    fflush($fh);
}

flock($fh, LOCK_UN);
fclose($fh);

admin_json(200, [
    'ok'      => true,
    'deleted' => count($removidas),
    'kept'    => count($mantidas),
]);
