<?php
declare(strict_types=1);

/* ----------------------------------------------------------------------
 *  Leitura da jornada de atribuição enviada pelo navegador.
 *
 *  Usada pelos dois pontos de conversão — submit.php (formulário) e
 *  track-call.php (clique em ligar) — para os dois gravarem o mesmo formato.
 *  Sem isso o painel teria de entender dois esquemas para responder a mesma
 *  pergunta ("de onde veio este contato?").
 *
 *  Tudo aqui chega do navegador, então nada é confiável: o tamanho é limitado,
 *  os campos são copiados UM A UM (nunca o objeto inteiro, que deixaria
 *  qualquer chave entrar no log) e as listas são cortadas. O pior caso é um
 *  contato com origem errada — nunca um log envenenado.
 *
 *  Este arquivo só declara funções: abrir pelo navegador não faz nada.
 * ---------------------------------------------------------------------- */

if (!function_exists('attr_txt')) {
    function attr_txt($v, int $max = 160): string {
        if (!is_scalar($v)) return '';
        return substr(str_replace(["\r", "\n"], '', trim((string)$v)), 0, $max);
    }
}

if (!function_exists('attr_toque')) {
    /** Uma origem (primeira, última, última não-direta). */
    function attr_toque($t): ?array {
        if (!is_array($t)) return null;
        $out = [
            'ts'       => attr_txt($t['ts'] ?? '', 32),
            'channel'  => attr_txt($t['channel'] ?? '', 60),
            'source'   => attr_txt($t['source'] ?? '', 80),
            'medium'   => attr_txt($t['medium'] ?? '', 60),
            'campaign' => attr_txt($t['campaign'] ?? '', 120),
            'term'     => attr_txt($t['term'] ?? '', 120),
            'content'  => attr_txt($t['content'] ?? '', 120),
            'click_id' => attr_txt($t['click_id'] ?? '', 120),
            'landing'  => attr_txt($t['landing'] ?? '', 200),
            'referrer' => attr_txt($t['referrer'] ?? '', 200),
        ];
        $out = array_filter($out, static fn($v) => $v !== '');
        return $out ?: null;
    }
}

if (!function_exists('attr_parse')) {
    /**
     * @param string $raw   JSON como veio do navegador.
     * @param int    $lista Quantos toques e páginas guardar. O formulário guarda
     *                      a jornada inteira; o clique em ligar guarda menos,
     *                      porque acontece muito mais e o log é o mesmo arquivo.
     */
    function attr_parse(string $raw, int $lista = 30): ?array {
        if ($raw === '' || strlen($raw) > 12000) return null;
        $d = json_decode($raw, true);
        if (!is_array($d)) return null;

        $toques = [];
        foreach (array_slice((array)($d['touchpoints'] ?? []), -$lista) as $t) {
            if (!is_array($t)) continue;
            $linha = array_filter([
                'ts'       => attr_txt($t['ts'] ?? '', 32),
                'channel'  => attr_txt($t['channel'] ?? '', 60),
                'source'   => attr_txt($t['source'] ?? '', 80),
                'campaign' => attr_txt($t['campaign'] ?? '', 120),
                'landing'  => attr_txt($t['landing'] ?? '', 200),
            ], static fn($v) => $v !== '');
            if ($linha) $toques[] = $linha;
        }

        $paginas = [];
        foreach (array_slice((array)($d['pages'] ?? []), -$lista) as $p) {
            if (!is_array($p)) continue;
            $path = attr_txt($p['path'] ?? '', 160);
            if ($path === '') continue;
            $paginas[] = ['ts' => attr_txt($p['ts'] ?? '', 32), 'path' => $path];
        }

        $out = [
            'rev'           => max(0, min(99, (int)($d['rev'] ?? 0))),
            'vid'           => attr_txt($d['vid'] ?? '', 64),
            'first'         => attr_toque($d['first'] ?? null),
            'last'          => attr_toque($d['last'] ?? null),
            'lastNonDirect' => attr_toque($d['lastNonDirect'] ?? null),
            'sessions'      => max(0, min(9999, (int)($d['sessions'] ?? 0))),
            'touchpoints'   => $toques,
            'pages'         => $paginas,
            'createdAt'     => attr_txt($d['createdAt'] ?? '', 32),
            'fbp'           => attr_txt($d['fbp'] ?? '', 120),
            'fbc'           => attr_txt($d['fbc'] ?? '', 200),
        ];
        $out = array_filter($out, static fn($v) => $v !== '' && $v !== null && $v !== [] && $v !== 0);
        return $out ?: null;
    }
}

if (!function_exists('attr_consertar')) {
    /**
     * Conserta a jornada gravada antes da revisão 2 do rastreador.
     *
     * Até ali, trocar de página dentro do site reclassificava a visita com o
     * `document.referrer` da chegada — que não muda quando o site navega sem
     * recarregar. Quem vinha de um anúncio do Google (gclid na URL, google.com
     * no referrer) virava "Organic Search" já no primeiro clique interno, e
     * essa sessão falsa ficava como último toque e como canal creditado.
     *
     * A marca do erro é exata: um toque sem campanha e sem parâmetros na URL,
     * classificado só pelo referrer, que começa com a sessão anterior ainda
     * viva (menos de 30 min desde a última página) — e a anterior tinha vindo
     * de clique pago ou UTM. Essa troca só acontecia pelo erro: o referrer não
     * tem como mudar de canal no meio de uma sessão de verdade.
     *
     * Roda na leitura, sem reescrever o log: o registro original fica intacto.
     */
    function attr_consertar(?array $a): ?array {
        if (!$a || (int)($a['rev'] ?? 0) >= 2) return $a;
        $toques = $a['touchpoints'] ?? [];
        if (!is_array($toques) || count($toques) < 2) return $a;

        $porReferrer = ['Direct', 'Organic Search', 'Organic Social', 'Email', 'Referral'];
        $quando = static function ($ts): ?int {
            try { return (new DateTimeImmutable((string)$ts))->getTimestamp(); } catch (Throwable $e) { return null; }
        };
        $declarado = static fn(array $t): bool =>
            !in_array($t['channel'] ?? '', $porReferrer, true)
            || ($t['campaign'] ?? '') !== ''
            || strpos((string)($t['landing'] ?? ''), '?') !== false;
        $soReferrer = static fn(array $t): bool =>
            in_array($t['channel'] ?? '', $porReferrer, true) && ($t['channel'] ?? '') !== 'Direct'
            && ($t['campaign'] ?? '') === ''
            && strpos((string)($t['landing'] ?? ''), '?') === false;

        $paginas = [];
        foreach ((array)($a['pages'] ?? []) as $p) {
            $t = is_array($p) ? $quando($p['ts'] ?? '') : null;
            if ($t !== null) $paginas[] = $t;
        }

        $mantidos = [$toques[0]];
        $falsos = [];
        for ($i = 1; $i < count($toques); $i++) {
            $t = $toques[$i];
            $ant = $mantidos[count($mantidos) - 1];
            $tIni = $quando($t['ts'] ?? '');
            $aIni = $quando($ant['ts'] ?? '');
            if ($tIni !== null && $aIni !== null && $declarado($ant) && $soReferrer($t)) {
                // Última atividade antes deste toque: a própria entrada ou a
                // última página vista depois dela.
                $ultima = $aIni;
                foreach ($paginas as $pt) {
                    if ($pt >= $aIni && $pt < $tIni && $pt > $ultima) $ultima = $pt;
                }
                if ($tIni - $ultima < 30 * 60) {
                    $falsos[(string)($t['ts'] ?? '')] = true;
                    continue;
                }
            }
            $mantidos[] = $t;
        }
        if (!$falsos) return $a;

        // Volta à versão completa do toque (com click_id e referrer) quando ela
        // existe; os toques da lista guardam só o resumo.
        $completo = static function (array $t) use ($a): array {
            foreach (['first', 'last', 'lastNonDirect'] as $k) {
                if (is_array($a[$k] ?? null) && ($a[$k]['ts'] ?? null) === ($t['ts'] ?? null)) return $a[$k];
            }
            return $t;
        };

        $a['touchpoints'] = $mantidos;
        $a['sessions'] = max(1, (int)($a['sessions'] ?? count($toques)) - count($falsos));
        if (isset($falsos[(string)($a['last']['ts'] ?? '')])) {
            $a['last'] = $completo($mantidos[count($mantidos) - 1]);
        }
        if (isset($falsos[(string)($a['lastNonDirect']['ts'] ?? '')])) {
            $credito = null;
            foreach (array_reverse($mantidos) as $t) {
                if (($t['channel'] ?? '') !== 'Direct') { $credito = $completo($t); break; }
            }
            if ($credito) $a['lastNonDirect'] = $credito; else unset($a['lastNonDirect']);
        }
        return $a;
    }
}
