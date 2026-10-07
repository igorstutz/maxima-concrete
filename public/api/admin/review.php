<?php
declare(strict_types=1);

/* ----------------------------------------------------------------------
 *  Marca um lead do formulário como válido ou inválido.
 *
 *  Só responde a sessão autenticada. Recebe { id, status } com status
 *  "valid", "invalid" ou "" (desmarca).
 *
 *  A marcação NÃO entra em submissions.log: o `id` de cada lead é o hash da
 *  linha do log (ver data.php), e reescrever a linha mudaria o id — o botão
 *  de apagar e a própria marcação perderiam o lead de vista. Ela fica num
 *  arquivo à parte, .private/lead-review.json, indexado pelo id, e data.php
 *  junta os dois na leitura.
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
$id      = is_array($entrada) ? (string)($entrada['id'] ?? '') : '';
$status  = is_array($entrada) ? (string)($entrada['status'] ?? '') : '';

if (!preg_match('/^[a-f0-9]{16}$/', $id)) {
    admin_json(400, ['ok' => false, 'error' => 'Invalid lead id']);
}
if (!in_array($status, ['valid', 'invalid', ''], true)) {
    admin_json(400, ['ok' => false, 'error' => 'Status must be valid, invalid or empty']);
}

// Só marca lead que existe: o arquivo de marcações não deve juntar ids soltos.
$existe = false;
$log = ADMIN_PRIVATE_DIR . '/submissions.log';
if (is_file($log)) {
    $fh = fopen($log, 'r');
    if ($fh !== false) {
        while (($linha = fgets($fh)) !== false) {
            $limpa = rtrim($linha, "\r\n");
            if ($limpa !== '' && substr(sha1($limpa), 0, 16) === $id) {
                $existe = true;
                break;
            }
        }
        fclose($fh);
    }
}
if (!$existe) {
    admin_json(404, ['ok' => false, 'error' => 'Lead not found']);
}

$arquivo = ADMIN_PRIVATE_DIR . '/lead-review.json';
$fh = fopen($arquivo, 'c+');
if ($fh === false) {
    admin_json(500, ['ok' => false, 'error' => 'Could not open the review file']);
}
flock($fh, LOCK_EX);

$atual = json_decode((string)stream_get_contents($fh), true);
$revisoes = is_array($atual) ? $atual : [];

if ($status === '') {
    unset($revisoes[$id]);
} else {
    $revisoes[$id] = ['status' => $status, 'at' => gmdate('Y-m-d\TH:i:s\Z')];
}

ftruncate($fh, 0);
rewind($fh);
fwrite($fh, json_encode((object)$revisoes, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . "\n");
fflush($fh);
flock($fh, LOCK_UN);
fclose($fh);

admin_json(200, ['ok' => true, 'id' => $id, 'review' => $status === '' ? null : $revisoes[$id]]);
