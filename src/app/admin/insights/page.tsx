"use client";

/**
 * Insights — a leitura agregada dos leads, ao lado da lista da tela Leads.
 *
 * Responde três perguntas que a lista não responde: quando os leads entram,
 * o que eles pedem e por onde chegaram. Tudo sai do mesmo `data.php` da outra
 * tela e do mesmo filtro de período, para as duas nunca discordarem no total.
 */

import { useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  Inbox,
  Loader2,
  LogOut,
  Megaphone,
  RefreshCcw,
  TrendingDown,
  TrendingUp,
  Wrench,
} from "lucide-react";
import {
  AdminNav,
  PeriodFilter,
  isLead,
  useAdminData,
  useDateRange,
  type Preset,
  type Submission,
} from "../shared";
import { GraficoColunas, ListaBarras, type Ponto } from "../charts";

type Unidade = "day" | "week" | "month";

const UNIDADES: { value: Unidade; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

/** Segunda-feira da semana de `d`, para agrupar por semana. */
function inicioDaSemana(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = (x.getDay() + 6) % 7; // segunda = 0
  x.setDate(x.getDate() - diff);
  return x;
}

/** Chave, rótulo por extenso e rótulo curto do balde a que a data pertence. */
function balde(d: Date, unidade: Unidade): { chave: string; rotulo: string; curto: string } {
  const p2 = (n: number) => `${n}`.padStart(2, "0");
  if (unidade === "month") {
    return {
      chave: `${d.getFullYear()}-${p2(d.getMonth() + 1)}`,
      rotulo: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      curto: d.toLocaleDateString("en-US", { month: "short" }),
    };
  }
  const base = unidade === "week" ? inicioDaSemana(d) : d;
  const chave = `${base.getFullYear()}-${p2(base.getMonth() + 1)}-${p2(base.getDate())}`;
  const curto = base.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return {
    chave,
    rotulo:
      unidade === "week"
        ? `Week of ${base.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
        : base.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }),
    curto,
  };
}

/** Avança um balde, para preencher os períodos sem nenhum lead. */
function proximo(d: Date, unidade: Unidade): Date {
  const x = new Date(d);
  if (unidade === "month") x.setMonth(x.getMonth() + 1);
  else x.setDate(x.getDate() + (unidade === "week" ? 7 : 1));
  return x;
}

/** Contagem por categoria, da maior para a menor. */
function contar(itens: string[]): { rotulo: string; valor: number }[] {
  const m = new Map<string, number>();
  for (const i of itens) m.set(i, (m.get(i) ?? 0) + 1);
  return Array.from(m, ([rotulo, valor]) => ({ rotulo, valor })).sort((a, b) => b.valor - a.valor);
}

function StatTile({
  icone,
  rotulo,
  valor,
  detalhe,
  delta,
}: {
  icone: React.ReactNode;
  rotulo: string;
  valor: string;
  detalhe?: string;
  delta?: { pct: number; periodo: string } | null;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-gray-400">
        {icone}
        <p className="text-xs font-medium uppercase tracking-wide">{rotulo}</p>
      </div>
      <p className="text-3xl font-bold text-gray-900">{valor}</p>
      {delta && (
        <p
          className={`mt-1.5 inline-flex items-center gap-1 text-xs font-medium ${
            delta.pct >= 0 ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {delta.pct >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {delta.pct >= 0 ? "+" : ""}
          {delta.pct.toFixed(0)}% <span className="font-normal text-gray-400">{delta.periodo}</span>
        </p>
      )}
      {detalhe && !delta && <p className="mt-1.5 truncate text-xs text-gray-500">{detalhe}</p>}
    </div>
  );
}

function Cartao({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string;
  subtitulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">{titulo}</h2>
      <p className="mb-5 mt-0.5 text-sm text-gray-500">{subtitulo}</p>
      {children}
    </div>
  );
}

export default function AdminInsightsPage() {
  const { status, data, refreshing, load, logout } = useAdminData();

  const [preset, setPreset] = useState<Preset>("30");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [unidade, setUnidade] = useState<Unidade>("day");

  const [from, to] = useDateRange(preset, customFrom, customTo);

  /** Leads do período. Candidaturas do Join Our Team ficam de fora. */
  const leads = useMemo(
    () =>
      (data?.submissions ?? []).filter((s: Submission) => {
        if (!s.ts || !isLead(s)) return false;
        const t = new Date(s.ts).getTime();
        return !Number.isNaN(t) && t >= from && t <= to;
      }),
    [data, from, to],
  );

  /** Mesmo tamanho de janela, imediatamente antes — para o "vs" dos cartões. */
  const leadsAnteriores = useMemo(() => {
    const janela = to - from;
    if (!Number.isFinite(janela) || janela <= 0 || preset === "all") return null;
    return (data?.submissions ?? []).filter((s: Submission) => {
      if (!s.ts || !isLead(s)) return false;
      const t = new Date(s.ts).getTime();
      return !Number.isNaN(t) && t >= from - janela && t < from;
    }).length;
  }, [data, from, to, preset]);

  const delta = useMemo(() => {
    if (leadsAnteriores === null || leadsAnteriores === 0) return null;
    return {
      pct: ((leads.length - leadsAnteriores) / leadsAnteriores) * 100,
      periodo: "vs previous period",
    };
  }, [leads.length, leadsAnteriores]);

  /**
   * Série temporal com os períodos vazios preenchidos: sem isso, uma semana sem
   * lead nenhum some do eixo e o gráfico mostra uma sequência que não aconteceu.
   */
  const pontos = useMemo<Ponto[]>(() => {
    if (!leads.length) return [];
    const contagem = new Map<string, { rotulo: string; curto: string; valor: number }>();
    let menor = Infinity;
    let maior = -Infinity;
    for (const l of leads) {
      const d = new Date(l.ts);
      const b = balde(d, unidade);
      const atual = contagem.get(b.chave);
      if (atual) atual.valor++;
      else contagem.set(b.chave, { rotulo: b.rotulo, curto: b.curto, valor: 1 });
      const t = d.getTime();
      if (t < menor) menor = t;
      if (t > maior) maior = t;
    }

    // Começa no primeiro balde com lead (ou no início do filtro, o que for depois)
    // e anda até o último, criando os que ficaram em zero.
    const inicio = new Date(Math.max(menor, Number.isFinite(from) && from > 0 ? from : menor));
    let cursor =
      unidade === "month"
        ? new Date(inicio.getFullYear(), inicio.getMonth(), 1)
        : unidade === "week"
          ? inicioDaSemana(inicio)
          : new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());

    const fim = new Date(maior);
    const saida: Ponto[] = [];
    let guarda = 0;
    while (cursor.getTime() <= fim.getTime() && guarda++ < 800) {
      const b = balde(cursor, unidade);
      const achado = contagem.get(b.chave);
      saida.push({ chave: b.chave, rotulo: b.rotulo, curto: b.curto, valor: achado?.valor ?? 0 });
      cursor = proximo(cursor, unidade);
    }
    return saida;
  }, [leads, unidade, from]);

  /**
   * Um lead pode pedir vários serviços, então a soma das barras passa do total
   * de leads — a porcentagem é sobre leads, e diz "em quantos % dos pedidos este
   * serviço aparece", não fatia de uma pizza.
   */
  const porProduto = useMemo(
    () => contar(leads.flatMap((l) => l.services ?? [])),
    [leads],
  );

  const porOrigem = useMemo(
    () => contar(leads.map((l) => (l.hear_about ?? "").trim() || "Not informed")),
    [leads],
  );

  const porPagina = useMemo(
    () => contar(leads.map((l) => (l.page_url ?? "").trim() || "—")).slice(0, 8),
    [leads],
  );

  const mediaPorDia = useMemo(() => {
    if (!leads.length) return "0";
    const dias = Math.max(1, Math.round((Math.min(to, Date.now()) - from) / 86400000));
    return (leads.length / dias).toFixed(1);
  }, [leads.length, from, to]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-ocean" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertCircle size={32} className="text-red-500" />
        <p className="text-gray-600">Couldn&apos;t load the dashboard data.</p>
        <button
          onClick={() => load(true)}
          className="rounded-full bg-ocean px-5 py-2.5 font-semibold text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 pb-20 pt-28">
      {/* Na recarga a tela anterior fica, esmaecida: trocar por esqueleto faria
          o layout pular a cada Refresh. */}
      <div
        className={`mx-auto max-w-6xl px-4 transition-opacity sm:px-6 lg:px-8 ${
          refreshing ? "opacity-60" : ""
        }`}
      >
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Insights</h1>
            <p className="mt-1 text-sm text-gray-500">
              Where leads come from, what they ask for, and when they arrive.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => load(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-ocean/40 hover:text-primary disabled:opacity-50"
            >
              <RefreshCcw size={15} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-red-300 hover:text-red-600"
            >
              <LogOut size={15} />
              Log out
            </button>
          </div>
        </div>

        <div className="mb-8">
          <AdminNav current="insights" />
        </div>

        {/* Uma linha de filtro acima de tudo que ela recorta; nenhum gráfico tem filtro próprio. */}
        <div className="mb-8">
          <PeriodFilter
            preset={preset}
            setPreset={setPreset}
            customFrom={customFrom}
            setCustomFrom={setCustomFrom}
            customTo={customTo}
            setCustomTo={setCustomTo}
          />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile
            icone={<Inbox size={15} />}
            rotulo="Leads"
            valor={leads.length.toLocaleString("en-US")}
            delta={delta}
            detalhe="in the selected period"
          />
          <StatTile
            icone={<BarChart3 size={15} />}
            rotulo="Average per day"
            valor={mediaPorDia}
            detalhe="across the selected period"
          />
          <StatTile
            icone={<Wrench size={15} />}
            rotulo="Top service"
            valor={porProduto[0]?.rotulo ?? "—"}
            detalhe={porProduto[0] ? `${porProduto[0].valor} requests` : "no data yet"}
          />
          <StatTile
            icone={<Megaphone size={15} />}
            rotulo="Top source"
            valor={porOrigem[0]?.rotulo ?? "—"}
            detalhe={porOrigem[0] ? `${porOrigem[0].valor} leads` : "no data yet"}
          />
        </div>

        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">New leads over time</h2>
              <p className="mt-0.5 text-sm text-gray-500">
                Form submissions per {unidade}. Hover a column for the exact count.
              </p>
            </div>
            <div className="inline-flex rounded-[12px] border border-gray-200 bg-white p-1">
              {UNIDADES.map((u) => (
                <button
                  key={u.value}
                  onClick={() => setUnidade(u.value)}
                  className={`rounded-[10px] px-3.5 py-1.5 text-sm font-medium transition ${
                    unidade === u.value
                      ? "gradient-navy text-white shadow-sm"
                      : "text-navy/70 hover:text-ocean"
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>
          <GraficoColunas pontos={pontos} unidade={unidade} />
        </div>

        {/* items-start: o cartão de origem tem menos linhas que o de serviço e
            esticar os dois na mesma altura deixaria um vão vazio embaixo dele. */}
        <div className="mb-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <Cartao
            titulo="Leads by service"
            subtitulo={`What they asked for. A lead can pick more than one, so the shares add up past 100%.`}
          >
            <ListaBarras linhas={porProduto} total={leads.length} vazio="No services in this period." />
          </Cartao>

          <Cartao titulo="Leads by source" subtitulo="How they say they found Maxima Concrete.">
            <ListaBarras linhas={porOrigem} total={leads.length} vazio="No sources in this period." />
          </Cartao>
        </div>

        <Cartao
          titulo="Leads by page"
          subtitulo="Which page the form was submitted from — the top 8."
        >
          <ListaBarras linhas={porPagina} total={leads.length} vazio="No pages in this period." />
        </Cartao>
      </div>
    </section>
  );
}
