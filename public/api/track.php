<?php
declare(strict_types=1);

/* ----------------------------------------------------------------------
 *  Maxima Concrete — registro de sessão (atribuição).
 *
 *  Recebe UMA chamada por sessão, não por página. Serve a dois fins que o
 *  navegador não resolve sozinho:
 *
 *   1. Saber quantas visitas NÃO viraram lead. Sem esse denominador não existe
 *      taxa de conversão por canal, que é a pergunta que decide onde investir.
 *   2. Renovar o cookie do visitante num cabeçalho Set-Cookie. O Safari corta
 *      para 7 dias os cookies escritos por JavaScript, mas não os que chegam
 *      numa resposta do servidor — sem isto, todo visitante de iPhone voltaria
 *      a ser "novo" a cada semana e a jornada se perderia.
 *
 *  Grava uma linha JSON por sessão em /.private/sessions-AAAA-MM.log. Um
 *  arquivo por mês porque este log cresce com o tráfego, não com os leads:
 *  arquivo único acabaria grande demais para o painel ler.
 *
 *  Sem autenticação: só ESCREVE contagem de visita, nunca devolve nada. Aceita
 *  apenas POST de mesma origem e limita o tamanho do corpo.
 * ---------------------------------------------------------------------- */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$refOk  = $origin === ''
    || preg_match('#^https?://(www\.)?maximaconcrete\.com$#i', $origin)
    || preg_match('#^https?://maximaconcrete\.igorstutz\.online$#i', $origin)
    || preg_match('#^http://localhost(:\d+)?$#i', $origin);

if ($origin !== '' && $refOk) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
// Fogo e esquecimento: qualquer recusa sai em 204 para nunca aparecer como erro
// no console do visitante.
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !$refOk) {
    http_response_code(204);
    exit;
}

$ua = (string)($_SERVER['HTTP_USER_AGENT'] ?? '');

/**
 * Robô não é visita. Contá-los inflaria o tráfego e afundaria a taxa de
 * conversão de cada canal — e são justamente os canais orgânicos que mais
 * recebem rastreador.
 */
$ehRobo = $ua === '' || preg_match(
    '#(bot|crawl|spider|slurp|bingpreview|facebookexternalhit|headless|phantom|puppeteer|playwright|lighthouse|pingdom|uptime|curl|wget|python-requests|axios|semrush|ahrefs|mj12|dotbot|petalbot|gptbot|claudebot|ccbot)#i',
    $ua
);
if ($ehRobo) {
    http_response_code(204);
    exit;
}

$raw  = substr((string)file_get_contents('php://input'), 0, 4000);
$body = json_decode($raw, true);
if (!is_array($body)) {
    http_response_code(204);
    exit;
}

function tk_txt($v, int $max = 160): string {
    if (!is_scalar($v)) return '';
    return substr(str_replace(["\r", "\n"], '', trim((string)$v)), 0, $max);
}

/** Identificador do visitante: só o formato que o próprio site gera. */
$vid = tk_txt($body['vid'] ?? '', 64);
if ($vid === '' || !preg_match('#^[A-Za-z0-9._-]{8,64}$#', $vid)) {
    http_response_code(204);
    exit;
}

// Renova o cookie por 13 meses (o teto prático das plataformas de anúncio).
// Não é HttpOnly de propósito: o próprio script precisa lê-lo para reencontrar
// o visitante quando o localStorage for limpo.
$seguro = (($_SERVER['HTTPS'] ?? '') !== '' && $_SERVER['HTTPS'] !== 'off');
setcookie('_mxvid', $vid, [
    'expires'  => time() + 400 * 86400,
    'path'     => '/',
    'secure'   => $seguro,
    'httponly' => false,
    'samesite' => 'Lax',
]);

$dir = __DIR__ . '/../.private';
if (!is_dir($dir)) {
    @mkdir($dir, 0700, true);
}

$entrada = [
    'ts'         => gmdate('Y-m-d\TH:i:s\Z'),
    'vid'        => $vid,
    'sessions'   => (int)($body['sessions'] ?? 1),
    'first_seen' => tk_txt($body['first_seen'] ?? '', 32),
    'channel'    => tk_txt($body['channel'] ?? 'Direct', 60),
    'source'     => tk_txt($body['source'] ?? '', 80),
    'medium'     => tk_txt($body['medium'] ?? '', 60),
    'campaign'   => tk_txt($body['campaign'] ?? '', 120),
    'term'       => tk_txt($body['term'] ?? '', 120),
    'content'    => tk_txt($body['content'] ?? '', 120),
    'click_id'   => tk_txt($body['click_id'] ?? '', 120),
    'landing'    => tk_txt($body['landing'] ?? '', 200),
    'referrer'   => tk_txt($body['referrer'] ?? '', 200),
    // País/cidade não são guardados e o IP também não: para medir canal eles não
    // acrescentam nada, e o log fica sem dado pessoal nenhum.
    'device'     => preg_match('#Mobile|Android|iPhone|iPad#i', $ua) ? 'mobile' : 'desktop',
];

@file_put_contents(
    $dir . '/sessions-' . gmdate('Y-m') . '.log',
    json_encode($entrada, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n",
    FILE_APPEND | LOCK_EX
);

http_response_code(204);
