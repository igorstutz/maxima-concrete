<?php
declare(strict_types=1);

/* ----------------------------------------------------------------------
 *  Área atendida: Central Ohio, pelo ZIP do formulário.
 *
 *  Os "leads" de fora de Ohio que chegavam (NY, CA, SC, FL, TX...) eram,
 *  um por um, propaganda e golpe — SEO, "estimating services", corretor de
 *  empresa, remoção de review, "mason sand" — e nenhum cliente de verdade
 *  (levantamento de 2026-09-01 a 2026-10-28: 35 de 218, todos assim).
 *  Cada um ia para os seis destinatários e contava como conversão.
 *
 *  Regra: as três primeiras casas do ZIP (o "SCF" dos Correios). 430–432
 *  cobrem todas as cidades e condados de service-areas.json (Columbus,
 *  Delaware, Union, Licking, Fairfield, Madison); 433 é Marion/Morrow/
 *  Richwood, a borda norte de Union e Delaware. Fora disso — inclusive o
 *  resto de Ohio (Cincinnati, Akron, Mansfield) — a Maxima não atende.
 *  Ampliar a área é acrescentar prefixo aqui.
 * ---------------------------------------------------------------------- */

const AREA_PREFIXOS_ZIP = ['430', '431', '432', '433'];

/**
 * "43015" ou "43015-9618", ou '' quando não há um ZIP no texto. Aceita o que
 * o visitante digita de verdade: "Marysville Ohio 43040", "43015 9618".
 */
function zip_eua(string $bruto): string
{
    if (!preg_match('/(?<!\d)(\d{5})(?:[\s-]?(\d{4}))?(?!\d)/', $bruto, $m)) {
        return '';
    }
    return isset($m[2]) && $m[2] !== '' ? "$m[1]-$m[2]" : $m[1];
}

/** Se o ZIP (já passado por zip_eua) está dentro da área atendida. */
function zip_na_area(string $zip): bool
{
    return in_array(substr($zip, 0, 3), AREA_PREFIXOS_ZIP, true);
}
