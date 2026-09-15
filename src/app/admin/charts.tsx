"use client";

/**
 * Os gráficos do painel, em SVG escrito à mão.
 *
 * Sem biblioteca de gráfico de propósito: são duas formas (coluna e barra
 * horizontal), e uma dependência de ~500KB para isso pesaria mais que o painel
 * inteiro. Vale a mesma regra do resto do site — nada de biblioteca onde um
 * punhado de `<path>` resolve.
 *
 * Especificações fixas nos dois: uma cor só por gráfico (a categoria já está
 * escrita ao lado — pintar cada barra de uma cor seria gastar o único canal
 * livre repetindo o que o comprimento já diz), marca fina, ponta de dado
 * arredondada em 4px e reta na base, 2px de respiro entre marcas vizinhas,
 * grade em fio de cabelo sólido um passo acima do fundo, e texto sempre em tom
 * de texto — a cor fica só na marca.
 */

import { useEffect, useRef, useState } from "react";

/** Série única em todos os gráficos. Validado contra o fundo branco do cartão. */
const SERIE = "#0d5d93"; // ocean
const GRADE = "#e5e7eb"; // gray-200

const nf = new Intl.NumberFormat("en-US");

/**
 * Largura real do elemento, em pixels.
 *
 * O SVG é desenhado no tamanho medido em vez de um viewBox fixo esticado:
 * `preserveAspectRatio="none"` faria o desenho caber, mas achatando as pontas
 * arredondadas e o texto junto — o raio de 4px viraria uma elipse.
 */
function useLargura<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [largura, setLargura] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setLargura(e.contentRect.width));
    ro.observe(el);
    setLargura(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);
  return [ref, largura] as const;
}

/** Retângulo com as duas pontas do topo arredondadas e a base reta. */
function colunaPath(x: number, y: number, w: number, h: number, r = 4): string {
  const raio = Math.max(0, Math.min(r, w / 2, h));
  const base = y + h;
  return `M${x},${base} L${x},${y + raio} Q${x},${y} ${x + raio},${y} L${x + w - raio},${y} Q${x + w},${y} ${x + w},${y + raio} L${x + w},${base} Z`;
}

/** Topo do eixo Y em número redondo, para os ticks caírem em valores limpos. */
function escala(max: number): { topo: number; ticks: number[] } {
  if (max <= 0) return { topo: 1, ticks: [0, 1] };
  const passo =
    max <= 4 ? 1 : max <= 10 ? 2 : max <= 25 ? 5 : max <= 50 ? 10 : max <= 100 ? 20 : Math.ceil(max / 5 / 50) * 50;
  const topo = Math.ceil(max / passo) * passo;
  const ticks: number[] = [];
  for (let v = 0; v <= topo; v += passo) ticks.push(v);
  return { topo, ticks };
}

export type Ponto = { chave: string; rotulo: string; curto: string; valor: number };

/**
 * Entrada de leads ao longo do tempo. Colunas, porque cada barra é um período
 * fechado e contável — uma linha sugeriria valores intermediários entre os dias,
 * que não existem.
 */
export function GraficoColunas({ pontos, unidade }: { pontos: Ponto[]; unidade: string }) {
  const [caixa, largura] = useLargura<HTMLDivElement>();
  const [ativo, setAtivo] = useState<number | null>(null);
  const [tabela, setTabela] = useState(false);

  const ALTURA = 240;
  const PAD_ESQ = 36;
  const PAD_DIR = 10;
  const PAD_TOPO = 22; // cabe o rótulo direto sobre a coluna mais alta
  const BANDA_X = 26; // faixa reservada aos rótulos do eixo X, dentro da altura

  const max = Math.max(0, ...pontos.map((p) => p.valor));
  const { topo, ticks } = escala(max);
  const indiceMax = pontos.findIndex((p) => p.valor === max && max > 0);

  const plotW = Math.max(0, largura - PAD_ESQ - PAD_DIR);
  const plotH = ALTURA - PAD_TOPO - BANDA_X;

  // Banda com teto: agrupado por mês num período curto sobram duas colunas, e
  // esticá-las pela largura toda deixaria dois palitos perdidos nas pontas. O
  // grupo fica com largura própria e centralizado; a grade segue de ponta a ponta.
  const BANDA_MAX = 72;
  const plotUsado = pontos.length ? Math.min(plotW, pontos.length * BANDA_MAX) : plotW;
  const origemX = PAD_ESQ + (plotW - plotUsado) / 2;
  const banda = pontos.length ? plotUsado / pontos.length : plotUsado;
  const larguraBarra = Math.max(2, Math.min(24, banda - 2)); // 2px de respiro entre vizinhas
  const passoRotulo = Math.max(1, Math.ceil(pontos.length / Math.max(1, Math.floor(plotUsado / 70))));

  const xBanda = (i: number) => origemX + i * banda;
  const yDe = (v: number) => PAD_TOPO + plotH - (topo ? (v / topo) * plotH : 0);

  return (
    <div>
      <div ref={caixa} className="relative" style={{ height: ALTURA }}>
        {largura > 0 && pontos.length > 0 && (
          <svg
            width={largura}
            height={ALTURA}
            role="img"
            aria-label={`New leads by ${unidade}`}
            onMouseLeave={() => setAtivo(null)}
          >
            {/* Faixa clara atrás da coluna apontada, antes da grade para não cobri-la.
                Marcar o foco assim, e não esmaecendo as outras, mantém todas as
                colunas na cor cheia — esmaecendo, o gráfico inteiro ficava lavado. */}
            {ativo !== null && (
              <rect x={xBanda(ativo)} y={PAD_TOPO} width={banda} height={plotH} fill="#f3f4f6" rx={4} />
            )}

            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD_ESQ} y1={yDe(t)} x2={largura - PAD_DIR} y2={yDe(t)} stroke={GRADE} strokeWidth={1} />
                <text
                  x={PAD_ESQ - 8}
                  y={yDe(t) + 4}
                  textAnchor="end"
                  fill="#9ca3af"
                  style={{ fontSize: 11, fontVariantNumeric: "tabular-nums" }}
                >
                  {t}
                </text>
              </g>
            ))}

            {pontos.map((p, i) => {
              const y = yDe(p.valor);
              const h = PAD_TOPO + plotH - y;
              const x = xBanda(i) + (banda - larguraBarra) / 2;
              return (
                <g key={p.chave}>
                  {p.valor > 0 && <path d={colunaPath(x, y, larguraBarra, h)} fill={SERIE} />}
                  {/* Alvo de mouse da banda inteira: mirar uma coluna de 2px seria impossível. */}
                  <rect
                    x={xBanda(i)}
                    y={PAD_TOPO}
                    width={banda}
                    height={plotH}
                    fill="transparent"
                    onMouseEnter={() => setAtivo(i)}
                  />
                  {i % passoRotulo === 0 && (
                    <text
                      x={xBanda(i) + banda / 2}
                      y={ALTURA - 8}
                      textAnchor="middle"
                      fill="#9ca3af"
                      style={{ fontSize: 11 }}
                    >
                      {p.curto}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Rótulo direto só no pico — o eixo, o tooltip e a tabela carregam o resto. */}
            {indiceMax >= 0 && (
              <text
                x={xBanda(indiceMax) + banda / 2}
                y={yDe(max) - 7}
                textAnchor="middle"
                fill="#6b7280"
                style={{ fontSize: 11, fontWeight: 600 }}
              >
                {max}
              </text>
            )}

            <line
              x1={PAD_ESQ}
              y1={PAD_TOPO + plotH}
              x2={largura - PAD_DIR}
              y2={PAD_TOPO + plotH}
              stroke={GRADE}
              strokeWidth={1}
            />
          </svg>
        )}

        {!pontos.length && (
          <p className="flex h-full items-center justify-center text-sm text-gray-400">
            No leads in this period.
          </p>
        )}

        {ativo !== null && pontos[ativo] && (
          <div
            className="pointer-events-none absolute z-10 whitespace-nowrap rounded-lg bg-navy px-3 py-2 text-xs leading-snug text-white shadow-lg"
            style={{
              // Preso à coluna, e contido nas bordas do cartão para não ser cortado.
              left: Math.min(Math.max(xBanda(ativo) + banda / 2, 70), Math.max(70, largura - 70)),
              top: 0,
              transform: "translateX(-50%)",
            }}
          >
            <span className="font-semibold">{pontos[ativo].valor}</span>{" "}
            {pontos[ativo].valor === 1 ? "lead" : "leads"}
            <br />
            <span className="text-white/70">{pontos[ativo].rotulo}</span>
          </div>
        )}
      </div>

      {pontos.length > 0 && (
        <>
          <div className="mt-2 flex justify-end">
            <button
              onClick={() => setTabela((v) => !v)}
              className="text-xs font-medium text-gray-500 underline decoration-gray-300 underline-offset-2 hover:text-ocean"
            >
              {tabela ? "Hide table" : "View as table"}
            </button>
          </div>
          {tabela && (
            <div className="mt-2 max-h-56 overflow-y-auto rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-2 font-semibold">Period</th>
                    <th className="px-4 py-2 text-right font-semibold">Leads</th>
                  </tr>
                </thead>
                <tbody>
                  {pontos.map((p) => (
                    <tr key={p.chave} className="border-t border-gray-100">
                      <td className="px-4 py-1.5 text-gray-700">{p.rotulo}</td>
                      <td
                        className="px-4 py-1.5 text-right text-gray-900"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {p.valor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export type Linha = { rotulo: string; valor: number };

/**
 * Ranking por categoria (produto, origem). Barra horizontal e não pizza: são
 * mais de seis fatias e os valores ficam próximos, caso em que a pizza esconde
 * exatamente a comparação que interessa.
 *
 * A barra é HTML e não SVG porque um SVG esticado achataria o arredondamento da
 * ponta; e o próprio bloco já é a tabela do gráfico — rótulo, valor e
 * participação estão em texto, nada depende de passar o mouse.
 */
export function ListaBarras({
  linhas,
  total,
  vazio,
}: {
  linhas: Linha[];
  total: number;
  vazio: string;
}) {
  const max = Math.max(1, ...linhas.map((l) => l.valor));

  if (!linhas.length) {
    return <p className="py-10 text-center text-sm text-gray-400">{vazio}</p>;
  }

  return (
    <ul className="space-y-3.5">
      {linhas.map((l) => {
        const pct = total ? (l.valor / total) * 100 : 0;
        return (
          <li key={l.rotulo} title={`${l.rotulo}: ${nf.format(l.valor)} (${pct.toFixed(1)}%)`}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="truncate text-sm text-gray-700">{l.rotulo}</span>
              <span className="shrink-0 text-sm">
                <span
                  className="font-semibold text-gray-900"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {nf.format(l.valor)}
                </span>{" "}
                <span className="text-xs text-gray-400">{pct.toFixed(0)}%</span>
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-2 rounded-l-none rounded-r-[4px] transition-[width] duration-300"
                style={{
                  width: `${Math.max(1.5, (l.valor / max) * 100)}%`,
                  backgroundColor: SERIE,
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
