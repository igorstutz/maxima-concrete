"use client";

/**
 * Filtros da lista de leads por origem e perfil: tipo (pago, orgânico...),
 * plataforma, primeiro e último toque, campanha, serviço e o resto.
 *
 * Cada filtro é uma "dimensão" que extrai um ou mais valores do lead. Os
 * filtros se combinam (E), e a contagem ao lado de cada opção já considera os
 * OUTROS filtros ativos — é o que diz, antes de clicar, quantos leads sobram.
 */

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { canalDoLead, type Call, type Submission, type Toque } from "./shared";

const SEM_RASTREIO = "Not tracked";

/** Pago, orgânico, direto... a partir do nome do canal. */
function tipoDoCanal(canal: string): string {
  if (/Ads$|^Paid/.test(canal)) return "Paid";
  if (/^Organic|^AI Search$|^Referral$/.test(canal)) return "Organic";
  if (canal === "Direct") return "Direct";
  if (/^Email$|^Offline$|^Campaign/.test(canal)) return "Email & offline";
  return SEM_RASTREIO;
}

/**
 * A empresa por trás da origem — Google junta anúncio e busca, Meta junta
 * Facebook e Instagram. É a pergunta "de qual plataforma veio", que o canal
 * sozinho não responde.
 */
function plataforma(t?: Toque): string {
  if (!t?.channel) return SEM_RASTREIO;
  const canal = t.channel;
  const fonte = (t.source ?? "").toLowerCase();
  if (canal === "AI Search") return "AI assistants";
  if (canal === "Google Ads" || /google|youtube/.test(fonte)) return "Google";
  if (/^(Meta|Instagram) Ads$/.test(canal) || /facebook|instagram|^fb$|^ig$|meta|threads/.test(fonte))
    return "Meta (Facebook / Instagram)";
  if (canal === "Microsoft Ads" || /bing|microsoft|msn/.test(fonte)) return "Microsoft (Bing)";
  if (/tiktok/.test(fonte) || canal === "TikTok Ads") return "TikTok";
  if (/linkedin/.test(fonte) || canal === "LinkedIn Ads") return "LinkedIn";
  if (/nextdoor/.test(fonte)) return "Nextdoor";
  if (canal === "Direct") return "Direct";
  if (canal === "Email") return "Email";
  if (canal === "Offline") return "Offline (QR, print)";
  if (canal === "Organic Search") return "Other search engines";
  if (canal === "Referral") return "Other websites";
  return "Other";
}

/** A visita que leva o crédito: a última que não foi direta. */
const creditado = (s: Submission): Toque | undefined =>
  s.attribution?.lastNonDirect ?? s.attribution?.last ?? s.attribution?.first;

type Contexto = { ligacoes: Map<string, Call[]> };

type Dimensao = {
  chave: string;
  rotulo: string;
  valores: (s: Submission, ctx: Contexto) => string[];
  /** Ordem fixa das opções, quando ela significa algo (1, 2–3, 4+). Sem isto: por quantidade. */
  ordem?: string[];
};

const DIMENSOES: Dimensao[] = [
  {
    chave: "tipo",
    rotulo: "Type",
    valores: (s) => [s.attribution ? tipoDoCanal(canalDoLead(s.attribution)) : SEM_RASTREIO],
    ordem: ["Paid", "Organic", "Direct", "Email & offline", SEM_RASTREIO],
  },
  { chave: "plataforma", rotulo: "Platform", valores: (s) => [plataforma(creditado(s))] },
  { chave: "first", rotulo: "First touch", valores: (s) => [s.attribution?.first?.channel || SEM_RASTREIO] },
  { chave: "last", rotulo: "Last touch", valores: (s) => [s.attribution?.last?.channel || SEM_RASTREIO] },
  {
    chave: "credited",
    rotulo: "Credited channel",
    valores: (s) => [s.attribution ? canalDoLead(s.attribution) : SEM_RASTREIO],
  },
  { chave: "campanha", rotulo: "Campaign", valores: (s) => [creditado(s)?.campaign || "No campaign"] },
  { chave: "servico", rotulo: "Service", valores: (s) => (s.services?.length ? s.services : []) },
  { chave: "declarado", rotulo: "How they heard", valores: (s) => [s.hear_about?.trim() || "Not informed"] },
  {
    chave: "ligou",
    rotulo: "Called after submitting",
    valores: (s, ctx) => [s.id && ctx.ligacoes.get(s.id)?.length ? "Yes" : "No"],
    ordem: ["Yes", "No"],
  },
  {
    chave: "visitas",
    rotulo: "Visits before contact",
    valores: (s) => {
      const n = s.attribution?.sessions ?? 0;
      if (!n) return [SEM_RASTREIO];
      return [n === 1 ? "1 visit" : n <= 3 ? "2–3 visits" : "4+ visits"];
    },
    ordem: ["1 visit", "2–3 visits", "4+ visits", SEM_RASTREIO],
  },
  { chave: "pagina", rotulo: "Form page", valores: (s) => [s.page_url?.trim() || "—"] },
  { chave: "zip", rotulo: "ZIP code", valores: (s) => [s.zip_code?.trim() || "—"] },
];

export type FiltrosLead = Record<string, string>;

function bate(s: Submission, filtros: FiltrosLead, ctx: Contexto, ignorar?: string): boolean {
  for (const d of DIMENSOES) {
    if (d.chave === ignorar) continue;
    const alvo = filtros[d.chave];
    if (alvo && !d.valores(s, ctx).includes(alvo)) return false;
  }
  return true;
}

/** Aplica os filtros ativos. */
export function aplicarFiltrosLead(lista: Submission[], filtros: FiltrosLead, ctx: Contexto): Submission[] {
  if (!Object.values(filtros).some(Boolean)) return lista;
  return lista.filter((s) => bate(s, filtros, ctx));
}

export function PainelFiltrosLead({
  base,
  filtros,
  setFiltros,
  ligacoes,
}: {
  /** Os leads do período (ou da busca), antes destes filtros. */
  base: Submission[];
  filtros: FiltrosLead;
  setFiltros: (f: FiltrosLead) => void;
  ligacoes: Map<string, Call[]>;
}) {
  const [aberto, setAberto] = useState(false);
  const ctx = useMemo(() => ({ ligacoes }), [ligacoes]);
  const ativos = DIMENSOES.filter((d) => filtros[d.chave]);

  // Opções de cada filtro com a contagem sob os OUTROS filtros ativos.
  const opcoes = useMemo(() => {
    const out: Record<string, { valor: string; n: number }[]> = {};
    for (const d of DIMENSOES) {
      const conta = new Map<string, number>();
      for (const s of base) {
        if (!bate(s, filtros, ctx, d.chave)) continue;
        for (const v of new Set(d.valores(s, ctx))) conta.set(v, (conta.get(v) ?? 0) + 1);
      }
      // A opção escolhida continua na lista mesmo se zerar, para dar para trocar.
      const atual = filtros[d.chave];
      if (atual && !conta.has(atual)) conta.set(atual, 0);
      const lista = Array.from(conta, ([valor, n]) => ({ valor, n }));
      lista.sort((a, b) =>
        d.ordem
          ? (d.ordem.indexOf(a.valor) + 1 || 99) - (d.ordem.indexOf(b.valor) + 1 || 99)
          : b.n - a.n || a.valor.localeCompare(b.valor),
      );
      out[d.chave] = lista;
    }
    return out;
  }, [base, filtros, ctx]);

  const trocar = (chave: string, valor: string) => {
    const novo = { ...filtros };
    if (valor) novo[chave] = valor;
    else delete novo[chave];
    setFiltros(novo);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
            aberto || ativos.length
              ? "border-ocean bg-ocean/10 text-ocean"
              : "border-gray-200 bg-white text-gray-600 hover:border-ocean/40 hover:text-ocean"
          }`}
        >
          <SlidersHorizontal size={13} />
          Filters
          {ativos.length > 0 && (
            <span className="rounded-full bg-ocean px-1.5 text-[10px] font-semibold text-white">
              {ativos.length}
            </span>
          )}
        </button>

        {ativos.map((d) => (
          <span
            key={d.chave}
            className="inline-flex items-center gap-1 rounded-full bg-navy/5 py-1 pl-3 pr-1 text-xs text-navy"
          >
            <span className="text-gray-500">{d.rotulo}:</span>
            <span className="font-medium">{filtros[d.chave]}</span>
            <button
              type="button"
              onClick={() => trocar(d.chave, "")}
              aria-label={`Remove filter ${d.rotulo}`}
              className="flex size-5 items-center justify-center rounded-full text-gray-400 transition hover:bg-white hover:text-red-600"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        {ativos.length > 1 && (
          <button
            type="button"
            onClick={() => setFiltros({})}
            className="text-xs font-medium text-gray-500 underline-offset-2 hover:text-red-600 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {aberto && (
        <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {DIMENSOES.map((d) => (
            <label key={d.chave} className="block">
              <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-gray-400">
                {d.rotulo}
              </span>
              <select
                value={filtros[d.chave] ?? ""}
                onChange={(e) => trocar(d.chave, e.target.value)}
                className={`w-full rounded-[10px] border px-2.5 py-1.5 text-sm outline-none transition focus:border-ocean ${
                  filtros[d.chave] ? "border-ocean bg-ocean/5 text-navy" : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <option value="">Any</option>
                {opcoes[d.chave].map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.valor} ({o.n})
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
