"use client";

/**
 * O que as duas telas do painel dividem: o formato do lead, o carregamento de
 * `data.php` (uma chamada só, traz tudo) e o recorte de período.
 *
 * Existe porque Dashboard e Insights leem exatamente os mesmos dados com o
 * mesmo filtro — duplicar a busca sairia com as duas telas discordando sobre
 * quantos leads o mês teve, que é o pior defeito possível num painel.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BarChart3, Inbox, Route } from "lucide-react";

/**
 * Um envio como o formulário deste site grava em submissions.log. Os nomes são
 * os mesmos campos do formulário — daí `first_name`/`last_name` separados e
 * `services` como lista.
 *
 * `type: "resume"` marca as candidaturas da página Join Our Team, que chegam
 * pelo mesmo log com outros campos (`name`, `position`, `resume`).
 */
/** Uma origem medida: de onde a pessoa veio numa determinada visita. */
export type Toque = {
  ts?: string;
  channel?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  click_id?: string;
  landing?: string;
  referrer?: string;
};

/**
 * A jornada até o contato, montada no navegador e anexada à conversão.
 * Ver src/lib/attribution.ts — é lá que ela é construída.
 */
export type Atribuicao = {
  vid?: string;
  first?: Toque;
  last?: Toque;
  lastNonDirect?: Toque;
  sessions?: number;
  touchpoints?: Toque[];
  pages?: { ts: string; path: string }[];
  createdAt?: string;
  fbp?: string;
  fbc?: string;
};

/**
 * Canal de crédito: a última origem que não foi acesso direto.
 *
 * É o padrão das ferramentas de medição, e a razão é prática: "direto" quase
 * sempre é a pessoa voltando por um caminho que já tinha sido pago antes —
 * creditar o direto apagaria a campanha que de fato a trouxe.
 */
export function canalDoLead(a?: Atribuicao | null): string {
  if (!a) return "Unknown";
  return a.lastNonDirect?.channel || a.last?.channel || a.first?.channel || "Unknown";
}

export type Submission = {
  /** Identificador do registro, calculado pelo servidor a partir da linha do log. */
  id?: string;
  ts: string;
  type?: string;
  first_name?: string;
  last_name?: string;
  name?: string; // candidaturas gravam o nome em um campo só
  email?: string;
  phone?: string;
  street?: string;
  zip_code?: string;
  services?: string[];
  hear_about?: string;
  page_url?: string;
  position?: string;
  resume?: string;
  message?: string;
  email_status?: string;
  email_error?: string | null;
  /** De onde veio, medido — não o que a pessoa declarou em "how did you hear". */
  attribution?: Atribuicao | null;
};

export type Call = {
  ts: string;
  location: string;
  page: string;
  /** Identificador do visitante, o mesmo gravado na jornada do lead. */
  vid?: string;
  /** Versão curta da jornada: o log guarda a completa, o painel não precisa dela. */
  attr?: { first?: Toque; last?: Toque; lastNonDirect?: Toque; sessions?: number } | null;
};

/** Sessões do site já agregadas por dia e canal no servidor. */
export type SessaoAgregada = { day: string; channel: string; count: number; visitors: number };

export type ApiData = {
  ok: boolean;
  submissions: Submission[];
  calls: Call[];
  callsCapped?: boolean;
  sessions?: SessaoAgregada[];
  sessionsTotal?: number;
  generatedAt?: string;
};

/** Nome para exibição, venha do formulário de contato ou de uma candidatura. */
export function nomeDoLead(s: Submission): string {
  const completo = [s.first_name, s.last_name].filter(Boolean).join(" ").trim();
  return completo || (s.name ?? "").trim() || "—";
}

/** Candidatura do Join Our Team não é lead de venda — fica fora dos gráficos. */
export const isLead = (s: Submission) => s.type !== "resume";

// --- período ----------------------------------------------------------------

export type Preset = "7" | "30" | "90" | "all" | "custom";

export const PRESETS: { value: Preset; label: string }[] = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "all", label: "All time" },
];

/**
 * Lê "YYYY-MM-DD" de um <input type="date"> como meia-noite LOCAL.
 * `new Date("2026-06-16")` seria meia-noite UTC, que em fuso negativo cai no dia
 * anterior — e o intervalo inteiro andaria um dia em relação ao agrupamento.
 */
export function parseLocalDate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

export function dayKey(ts: string | Date): string {
  const d = ts instanceof Date ? ts : new Date(ts);
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fmtDayLabel(ts: string): string {
  return new Date(ts).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtTime(ts: string): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Janela [de, até] em milissegundos, resolvida do preset ou das datas digitadas. */
export function useDateRange(
  preset: Preset,
  customFrom: string,
  customTo: string,
): [number, number] {
  return useMemo<[number, number]>(() => {
    const now = Date.now();
    if (preset === "all") return [0, now + 86400000];
    if (preset === "custom") {
      const fd = customFrom ? parseLocalDate(customFrom) : null;
      const td = customTo ? parseLocalDate(customTo) : null;
      return [fd ? fd.getTime() : 0, td ? td.getTime() + 86400000 - 1 : now + 86400000];
    }
    return [now - Number(preset) * 86400000, now + 86400000];
  }, [preset, customFrom, customTo]);
}

// --- dados ------------------------------------------------------------------

/**
 * Busca `data.php` e trata o 401 como "sessão expirou": manda para o login em
 * vez de deixar a tela vazia sem explicação.
 */
export function useAdminData() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [data, setData] = useState<ApiData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      try {
        const res = await fetch("/api/admin/data.php", {
          credentials: "include",
          cache: "no-store",
        });
        if (res.status === 401) {
          router.replace("/admin/login/");
          return;
        }
        setData(await res.json());
        setStatus("ready");
      } catch {
        setStatus("error");
      } finally {
        setRefreshing(false);
      }
    },
    [router],
  );

  useEffect(() => {
    load();
  }, [load]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin/logout.php", { method: "POST", credentials: "include" });
    } catch {
      /* ignore */
    }
    router.replace("/admin/login/");
  }, [router]);

  return { status, data, refreshing, load, logout };
}

// --- pedaços de interface repetidos nas duas telas ---------------------------

/** Navegação entre as telas do painel. */
export function AdminNav({ current }: { current: "dashboard" | "insights" | "attribution" }) {
  const item = (active: boolean) =>
    `inline-flex items-center gap-2 px-5 py-2 rounded-[10px] text-sm font-medium transition ${
      active ? "gradient-navy text-white shadow-sm" : "text-navy/70 hover:text-ocean"
    }`;
  return (
    <nav className="inline-flex flex-wrap rounded-[12px] bg-white border border-gray-200 p-1">
      <Link href="/admin/" className={item(current === "dashboard")}>
        <Inbox size={15} />
        Leads
      </Link>
      <Link href="/admin/insights/" className={item(current === "insights")}>
        <BarChart3 size={15} />
        Insights
      </Link>
      <Link href="/admin/attribution/" className={item(current === "attribution")}>
        <Route size={15} />
        Attribution
      </Link>
    </nav>
  );
}

/**
 * Uma única linha de filtro acima de tudo que ela recorta — as duas telas usam
 * a mesma, e nenhum gráfico ganha filtro próprio.
 */
export function PeriodFilter({
  preset,
  setPreset,
  customFrom,
  setCustomFrom,
  customTo,
  setCustomTo,
}: {
  preset: Preset;
  setPreset: (p: Preset) => void;
  customFrom: string;
  setCustomFrom: (v: string) => void;
  customTo: string;
  setCustomTo: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex rounded-[12px] bg-white border border-gray-200 p-1">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPreset(p.value)}
            className={`px-4 py-1.5 rounded-[10px] text-sm font-medium transition ${
              preset === p.value
                ? "gradient-navy text-white shadow-sm"
                : "text-navy/70 hover:text-ocean"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="inline-flex items-center gap-2 text-sm">
        <input
          type="date"
          aria-label="From date"
          value={customFrom}
          onChange={(e) => {
            setCustomFrom(e.target.value);
            setPreset("custom");
          }}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-700 focus:border-ocean outline-none"
        />
        <span className="text-gray-400">to</span>
        <input
          type="date"
          aria-label="To date"
          value={customTo}
          onChange={(e) => {
            setCustomTo(e.target.value);
            setPreset("custom");
          }}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-700 focus:border-ocean outline-none"
        />
      </div>
    </div>
  );
}

/**
 * Quando a página de agradecimento entrou no ar (deploy de 17/09/2026). Todo
 * envio do formulário de contato a partir daí termina nela — o redirecionamento
 * só acontece quando o servidor aceita o lead, que é exatamente quando ele
 * aparece no log. Antes disso a pessoa via a mensagem no próprio formulário.
 */
const THANK_YOU_DESDE = Date.parse("2026-09-17T20:20:00Z");

/** Se este lead passou pela /thank-you/ depois de enviar. */
export function viuThankYou(s: Submission): boolean {
  const t = Date.parse(s.ts);
  return isLead(s) && !Number.isNaN(t) && t >= THANK_YOU_DESDE;
}

/**
 * Ligações que cada lead fez DEPOIS de enviar o formulário, pelo identificador
 * do visitante.
 *
 * A jornada do lead é tirada na hora do envio, então nada que ele faz depois
 * entra nela — e o que ele mais faz depois é ligar da página de agradecimento.
 * Uma ligação conta para o envio mais recente daquele visitante que a antecede:
 * quem envia duas vezes não vê a mesma ligação repetida nos dois cartões.
 *
 * Recebe TODAS as ligações, não só as do período: um lead do último dia do
 * filtro pode ter ligado no dia seguinte.
 */
export function ligacoesPorLead(submissions: Submission[], calls: Call[]): Map<string, Call[]> {
  const envios = new Map<string, { chave: string; t: number }[]>();
  for (const s of submissions) {
    const vid = s.attribution?.vid;
    const t = Date.parse(s.ts);
    if (!vid || !s.id || Number.isNaN(t)) continue;
    if (!envios.has(vid)) envios.set(vid, []);
    envios.get(vid)!.push({ chave: s.id, t });
  }
  envios.forEach((lista) => lista.sort((a, b) => a.t - b.t));

  const out = new Map<string, Call[]>();
  for (const c of calls) {
    const lista = c.vid ? envios.get(c.vid) : undefined;
    const t = Date.parse(c.ts);
    if (!lista || Number.isNaN(t)) continue;
    let dono: string | null = null;
    for (const e of lista) if (e.t <= t) dono = e.chave;
    if (!dono) continue; // ligou antes de escrever: já é outra conversão
    if (!out.has(dono)) out.set(dono, []);
    out.get(dono)!.push(c);
  }
  out.forEach((lista) => lista.sort((a, b) => Date.parse(a.ts) - Date.parse(b.ts)));
  return out;
}
