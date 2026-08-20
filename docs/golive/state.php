<?php
/**
 * Estado compartilhado do checklist de virada.
 *
 * A página vive no GitHub Pages (estático), então as marcações precisam de um
 * lugar comum para que quem abre o link veja o que o outro já marcou. Este
 * endpoint guarda um JSON simples no servidor.
 *
 * GET  -> devolve { items: { id: {done, by, at} }, updatedAt }
 * POST -> recebe { id, done, by } e faz MERGE (nunca sobrescreve o arquivo
 *         inteiro): duas pessoas marcando ao mesmo tempo não se apagam.
 *
 * O arquivo fica em .private/, que o deploy não sobrescreve nem apaga.
 */

$ORIGENS = [
    'https://igorstutz.github.io',
    'https://maximaconcrete.igorstutz.online',
];

$origem = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origem, $ORIGENS, true)) {
    header("Access-Control-Allow-Origin: $origem");
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dir = __DIR__ . '/../.private';
if (!is_dir($dir)) {
    // Em alguns deploys o .private fica um nível acima do documento.
    $alt = __DIR__ . '/../../.private';
    if (is_dir($alt)) {
        $dir = $alt;
    } else {
        @mkdir($dir, 0775, true);
    }
}
$arquivo = $dir . '/golive-state.json';

function ler(string $arquivo): array
{
    if (!is_file($arquivo)) {
        return ['items' => [], 'updatedAt' => null];
    }
    $bruto = file_get_contents($arquivo);
    $dados = json_decode($bruto ?: '[]', true);
    if (!is_array($dados) || !isset($dados['items']) || !is_array($dados['items'])) {
        return ['items' => [], 'updatedAt' => null];
    }
    return $dados;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(ler($arquivo));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'method not allowed']);
    exit;
}

$entrada = json_decode(file_get_contents('php://input') ?: '{}', true);
$id = isset($entrada['id']) ? preg_replace('/[^a-z0-9_-]/i', '', (string) $entrada['id']) : '';
if ($id === '') {
    http_response_code(400);
    echo json_encode(['error' => 'id obrigatorio']);
    exit;
}

$done = !empty($entrada['done']);
$by = trim((string) ($entrada['by'] ?? ''));
$by = mb_substr(preg_replace('/[^\p{L}\p{N} .\'-]/u', '', $by) ?? '', 0, 24);

// Merge sob lock: só o item recebido muda, o resto do arquivo fica como está.
$fh = fopen($arquivo, 'c+');
if ($fh === false) {
    http_response_code(500);
    echo json_encode(['error' => 'nao foi possivel gravar']);
    exit;
}
flock($fh, LOCK_EX);

$conteudo = stream_get_contents($fh);
$dados = json_decode($conteudo ?: '[]', true);
if (!is_array($dados) || !isset($dados['items']) || !is_array($dados['items'])) {
    $dados = ['items' => [], 'updatedAt' => null];
}

$dados['items'][$id] = [
    'done' => $done,
    'by' => $by,
    'at' => gmdate('c'),
];
$dados['updatedAt'] = gmdate('c');

ftruncate($fh, 0);
rewind($fh);
fwrite($fh, json_encode($dados, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
fflush($fh);
flock($fh, LOCK_UN);
fclose($fh);

echo json_encode($dados);
