<?php
declare(strict_types=1);

/* ----------------------------------------------------------------------
 *  URI de callback do OAuth, derivada do host da requisição.
 *
 *  O painel roda em mais de um host (produção e homologação) e o GitHub
 *  exige que o redirect_uri do authorize seja idêntico ao do token. A
 *  whitelist impede que um Host forjado transforme o proxy em open
 *  redirect — host desconhecido cai no domínio de produção.
 *
 *  Cada host precisa do seu próprio OAuth App no GitHub (um App aceita
 *  uma única Authorization callback URL).
 * ---------------------------------------------------------------------- */

function maxima_oauth_redirect_uri(): string
{
    $allowed = [
        'maximaconcrete.com',
        'www.maximaconcrete.com',
        'maximaconcrete.igorstutz.online', // homologação (VPS + Cloudflare Tunnel)
    ];

    $host = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
    if (!in_array($host, $allowed, true)) {
        $host = 'maximaconcrete.com';
    }

    return 'https://' . $host . '/api/oauth/callback.php';
}
