"use client";

/**
 * Attribution — de onde os contatos realmente vieram.
 *
 * A tela Insights mostra o que o lead DECLAROU em "how did you hear about us".
 * Esta mostra o que foi MEDIDO: parâmetro de clique do anúncio, UTM da campanha
 * e referrer, guardados desde a primeira visita. As duas discordam com
 * frequência — quem chega por um anúncio do Google costuma responder "Google",
 * sem distinguir anúncio de busca orgânica — e é a diferença entre as duas que
 * diz onde o dinheiro está funcionando.
 */

import { useMemo, useState } from "react";
import {
  AlertCircle,
  Loader2,
  LogOut,
  MousePointerClick,
  PhoneCall,
  RefreshCcw,
  Route,
  Target,
  Users,
} from "lucide-react";
import {
  AdminNav,
  PeriodFilter,
  canalDoLead,
  isLead,
  useAdminData,
  useDateRange,
  type Atribuicao,
  type Preset,
} from "../shared";
import { ListaBarras } from "../charts";

function Cartao({
  titulo,
  subtitulo,
  children,
  className = "",
}: {
  titulo: string;
  subtitulo: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-sm ${className}`}>
      <h2 className="text-base font-semibold text-gray-900">{titulo}</h2>
      <p className="mb-5 mt-0.5 text-sm text-gray-500">{subtitulo}</p>
      {children}
    </div>
  );
}

function StatTile({
  icone,
  rotulo,
  valor,
  detalhe,
}: {
  icone: React.ReactNode;
  rotulo: string;
  valor: string;
  detalhe?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-gray-400">
        {icone}
        <p className="text-xs font-medium uppercase tracking-wide">{rotulo}</p>
      </div>
      {/* Nome de canal é longo ("Organic Search") e no corpo de 3xl era cortado
          pelo truncate. Texto comprido encolhe e quebra em vez de sumir. */}
      <p
        className={`font-bold leading-tight text-gray-900 ${
          valor.length > 12 ? "text-xl" : "text-3xl"
        }`}
      >
        {valor}
      </p>
      {detalhe && <p className="mt-1.5 truncate text-xs text-gray-500">{detalhe}</p>}
    </div>
  );
}

function contar(itens: string[]): { rotulo: string; valor: number }[] {
  const m = new Map<string, number>();
  for (const i of itens) m.set(i, (m.get(i) ?? 0) + 1);
  return Array.from(m, ([rotulo, valor]) => ({ rotulo, valor })).sort((a, b) => b.valor - a.valor);
}

export default function AdminAttributionPage() {
  const { status, data, refreshing, load, logout } = useAdminData();

  const [preset, setPreset] = useState<Preset>("30");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [from, to] = useDateRange(preset, customFrom, customTo);

  const noPeriodo = (ts?: string | null) => {
    if (!ts) return false;
    const t = new Date(ts).getTime();
    return !Number.isNaN(t) && t >= from && t <= to;
  };

  const leads = useMemo(
    () => (data?.submissions ?? []).filter((s) => isLead(s) && noPeriodo(s.ts)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, from, to],
  );
  const calls = useMemo(
    () => (data?.calls ?? []).filter((c) => noPeriodo(c.ts)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, from, to],
  );
  const sessoes = useMemo(
    () => (data?.sessions ?? []).filter((s) => noPeriodo(`${s.day}T12:00:00Z`)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, from, to],
  );

  /** Formulário e ligação valem o mesmo: os dois são contato. */
  const contatos = useMemo(
    () => [
      ...leads.map((l) => ({ tipo: "form" as const, attr: l.attribution ?? null })),
      ...calls.map((c) => ({ tipo: "call" as const, attr: (c.attr ?? null) as Atribuicao | null })),
    ],
    [leads, calls],
  );

  const comOrigem = contatos.filter((c) => c.attr);
  const semOrigem = contatos.length - comOrigem.length;

  const porCanal = useMemo(
    () => contar(comOrigem.map((c) => canalDoLead(c.attr))),
    [comOrigem],
  );
  const porPrimeiro = useMemo(
    () => contar(comOrigem.map((c) => c.attr?.first?.channel || "Unknown")),
    [comOrigem],
  );
  const porUltimo = useMemo(
    () => contar(comOrigem.map((c) => c.attr?.last?.channel || "Unknown")),
    [comOrigem],
  );
  const porCampanha = useMemo(
    () =>
      contar(
        comOrigem
          .map((c) => c.attr?.lastNonDirect?.campaign || c.attr?.first?.campaign || "")
          .filter(Boolean),
      ).slice(0, 10),
    [comOrigem],
  );

  const canalLigacoes = useMemo(
    () => contar(calls.filter((c) => c.attr).map((c) => canalDoLead(c.attr as Atribuicao))),
    [calls],
  );

  /**
   * Conversão por canal: contatos ÷ sessões. É a única leitura que diz onde
   * investir — um canal pode trazer muito tráfego e quase nenhum contato.
   */
  const conversao = useMemo(() => {
    const sess = new Map<string, number>();
    for (const s of sessoes) sess.set(s.channel, (sess.get(s.channel) ?? 0) + s.count);
    const cont = new Map<string, number>();
    for (const c of comOrigem) {
      const canal = canalDoLead(c.attr);
      cont.set(canal, (cont.get(canal) ?? 0) + 1);
    }
    return Array.from(sess, ([canal, visitas]) => ({
      canal,
      visitas,
      contatos: cont.get(canal) ?? 0,
      taxa: visitas ? ((cont.get(canal) ?? 0) / visitas) * 100 : 0,
    }))
      .filter((r) => r.visitas >= 5) // abaixo disso a taxa é ruído
      .sort((a, b) => b.taxa - a.taxa);
  }, [sessoes, comOrigem]);

  const totalSessoes = sessoes.reduce((s, r) => s + r.count, 0);
  const totalVisitantes = sessoes.reduce((s, r) => s + r.visitors, 0);
  const aindaSemDados = (data?.sessions?.length ?? 0) === 0 && comOrigem.length === 0;

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
      <div
        className={`mx-auto max-w-6xl px-4 transition-opacity sm:px-6 lg:px-8 ${
          refreshing ? "opacity-60" : ""
        }`}
      >
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attribution</h1>
            <p className="mt-1 text-sm text-gray-500">
              Measured origin of every contact — ads, search, social, referral or direct.
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
          <AdminNav current="attribution" />
        </div>
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

        {aindaSemDados && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            <p className="font-semibold">No tracking data yet.</p>
            <p className="mt-1 leading-relaxed">
              Tracking starts collecting from the moment it goes live — it can&apos;t know where
              past leads came from. Visits and contacts from now on will show up here. Leads
              submitted before that keep the &quot;how did you hear about us&quot; answer, on the
              Insights screen.
            </p>
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile
            icone={<Users size={15} />}
            rotulo="Visits"
            valor={totalSessoes.toLocaleString("en-US")}
            detalhe={`${totalVisitantes.toLocaleString("en-US")} unique visitors`}
          />
          <StatTile
            icone={<MousePointerClick size={15} />}
            rotulo="Contacts"
            valor={contatos.length.toLocaleString("en-US")}
            detalhe={`${leads.length} forms · ${calls.length} call clicks`}
          />
          <StatTile
            icone={<Target size={15} />}
            rotulo="Conversion"
            valor={totalSessoes ? `${((contatos.length / totalSessoes) * 100).toFixed(1)}%` : "—"}
            detalhe="contacts ÷ visits"
          />
          <StatTile
            icone={<Route size={15} />}
            rotulo="Top channel"
            valor={porCanal[0]?.rotulo ?? "—"}
            detalhe={porCanal[0] ? `${porCanal[0].valor} contacts` : "no data yet"}
          />
        </div>

        <Cartao
          titulo="Contacts by channel"
          subtitulo="Credited to the last non-direct source — the standard model. Forms and call clicks together."
          className="mb-6"
        >
          <ListaBarras
            linhas={porCanal}
            total={comOrigem.length}
            vazio="No tracked contacts in this period."
          />
          {semOrigem > 0 && (
            <p className="mt-4 border-t border-gray-100 pt-3 text-xs leading-relaxed text-gray-500">
              {semOrigem} contact{semOrigem > 1 ? "s" : ""} without tracking data — either from
              before tracking went live, or from a browser that blocks storage.
            </p>
          )}
        </Cartao>

        {/* Primeiro x último toque lado a lado, cada um com sua própria escala:
            sobrepor os dois num gráfico só exigiria duas cores para dizer o que
            dois títulos dizem de graça. */}
        <div className="mb-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <Cartao titulo="First touch" subtitulo="The channel that first brought them to the site.">
            <ListaBarras linhas={porPrimeiro} total={comOrigem.length} vazio="No data yet." />
          </Cartao>
          <Cartao titulo="Last touch" subtitulo="The channel of the visit where they made contact.">
            <ListaBarras linhas={porUltimo} total={comOrigem.length} vazio="No data yet." />
          </Cartao>
        </div>

        <Cartao
          titulo="Conversion rate by channel"
          subtitulo="Contacts ÷ visits. Channels with fewer than 5 visits are left out — the rate would be noise."
          className="mb-6"
        >
          {conversao.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">Not enough traffic data yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-gray-500">
                  <tr className="border-b border-gray-100">
                    <th className="pb-2 font-semibold">Channel</th>
                    <th className="pb-2 text-right font-semibold">Visits</th>
                    <th className="pb-2 text-right font-semibold">Contacts</th>
                    <th className="pb-2 text-right font-semibold">Rate</th>
                  </tr>
                </thead>
                <tbody style={{ fontVariantNumeric: "tabular-nums" }}>
                  {conversao.map((r) => (
                    <tr key={r.canal} className="border-b border-gray-50 last:border-0">
                      <td className="py-2 text-gray-700">{r.canal}</td>
                      <td className="py-2 text-right text-gray-500">
                        {r.visitas.toLocaleString("en-US")}
                      </td>
                      <td className="py-2 text-right text-gray-900">{r.contatos}</td>
                      <td className="py-2 text-right font-semibold text-ocean">
                        {r.taxa.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Cartao>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <Cartao
            titulo="Call clicks by channel"
            subtitulo="Who tapped the phone number, and where they came from."
          >
            <ListaBarras
              linhas={canalLigacoes}
              total={calls.filter((c) => c.attr).length}
              vazio="No tracked call clicks in this period."
            />
            <p className="mt-4 flex items-start gap-2 border-t border-gray-100 pt-3 text-xs leading-relaxed text-gray-500">
              <PhoneCall size={13} className="mt-0.5 shrink-0" />
              Only calls started by tapping the number on the site. Someone who dials it by hand
              can&apos;t be attributed without a tracking phone number.
            </p>
          </Cartao>

          <Cartao titulo="Top campaigns" subtitulo="From the utm_campaign of the crediting visit.">
            <ListaBarras linhas={porCampanha} total={comOrigem.length} vazio="No campaigns tagged yet." />
          </Cartao>
        </div>
      </div>
    </section>
  );
}
