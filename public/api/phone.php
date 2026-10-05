<?php
declare(strict_types=1);

/* ----------------------------------------------------------------------
 *  Telefone no padrão americano: (614) 384-5917 — código de área de 3
 *  dígitos, central de 3 e assinante de 4.
 *
 *  Cada visitante digitava de um jeito ("6143845917", "614-384-5917",
 *  "+1 614 384 5917"...) e o lead chegava assim nos e-mails e no painel.
 *  O formulário já formata enquanto a pessoa digita (src/lib/phone.ts, mesma
 *  regra); aqui é a garantia do servidor, que um POST direto não passa pela
 *  máscara.
 * ---------------------------------------------------------------------- */

/**
 * "(614) 384-5917", ou '' quando não é um número americano: 10 dígitos, ou 11
 * começando pelo 1 do país (o autopreenchimento do celular manda "+1 ...").
 */
function telefone_eua(string $bruto): string
{
    $d = preg_replace('/\D/', '', $bruto) ?? '';
    if (strlen($d) === 11 && $d[0] === '1') $d = substr($d, 1);
    if (strlen($d) !== 10) return '';
    return '(' . substr($d, 0, 3) . ') ' . substr($d, 3, 3) . '-' . substr($d, 6);
}

/**
 * Para leads já gravados: formata o que for número americano e deixa o resto
 * como chegou — um número estrangeiro reescrito à força ficaria errado.
 */
function telefone_padronizado(string $bruto): string
{
    $formatado = telefone_eua($bruto);
    return $formatado !== '' ? $formatado : trim($bruto);
}
