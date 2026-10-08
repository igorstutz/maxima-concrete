"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  LogOut,
  RefreshCcw,
  Inbox,
  PhoneCall,
  Mail,
  MapPin,
  ChevronDown,
  AlertCircle,
  Trash2,
  Search,
  X,
  Check,
  Ban,
} from "lucide-react";
import {
  AdminNav,
  PeriodFilter,
  dayKey,
  fmtDayLabel,
  fmtTime,
  isLead,
  ligacoesPorLead,
  nomeDoLead,
  viuThankYou,
  useAdminData,
  useDateRange,
  type Preset,
  type Revisao,
  type Submission,
} from "./shared";
import { LeadJourney } from "./journey";
import { PainelFiltrosLead, aplicarFiltrosLead, type FiltrosLead } from "./lead-filters";

const LOCATION_LABELS: Record<string, string> = {
  header: "Header",
  footer: "Footer",
  contact_form: "Contact form",
  menu: "Menu",
  body: "Page body",
  unknown: "Other",
};

/** Minúsculas e sem acento: "Jose" acha "José", "oerding" acha "Oerding". */
const normalizar = (v: string) =>
  v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

/**
 * Se o lead bate com o que foi digitado: nome (em qualquer ordem das palavras),
 * e-mail ou telefone. Telefone compara só os dígitos, porque cada lead antigo
 * chegou num formato.
 */
function bateComBusca(s: Submission, busca: string): boolean {
  const termos = normalizar(busca).split(/\s+/).filter(Boolean);
  if (!termos.length) return true;
  const texto = normalizar([nomeDoLead(s), s.email ?? ""].join(" "));
  if (termos.every((t) => texto.includes(t))) return true;
  const digitos = busca.replace(/\D/g, "");
  return digitos.length >= 3 && (s.phone ?? "").replace(/\D/g, "").includes(digitos);
}

type Filtro = "all" | "pending" | "valid" | "invalid";

const FILTROS: { value: Filtro; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Not reviewed" },
  { value: "valid", label: "Valid" },
  { value: "invalid", label: "Invalid" },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { status, data, refreshing, load, logout } = useAdminData();

  const [preset, setPreset] = useState<Preset>("30");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [tab, setTab] = useState<"submissions" | "calls">("submissions");
  const [excluindo, setExcluindo] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const buscando = busca.trim() !== "";
  // Marcações feitas nesta tela, por cima do que veio do servidor: o botão
  // responde na hora, sem esperar o Refresh. null = desmarcado.
  const [revisoes, setRevisoes] = useState<Record<string, Revisao | null>>({});
  const [filtro, setFiltro] = useState<Filtro>("all");
  const [filtrosLead, setFiltrosLead] = useState<FiltrosLead>({});
  const filtrandoOrigem = Object.keys(filtrosLead).length > 0;

  const revisaoDe = (s: Submission): Revisao | null =>
    s.id && s.id in revisoes ? revisoes[s.id] : (s.review?.status ?? null);

  /**
   * Marca o lead como válido ou inválido. Clicar de novo na marcação atual
   * desmarca. A tela muda na hora; se o servidor recusar, volta ao que era.
   */
  async function marcar(s: Submission, status: Revisao) {
    if (!s.id) return;
    const id = s.id;
    const anterior = revisaoDe(s);
    const nova = anterior === status ? null : status;
    setRevisoes((r) => ({ ...r, [id]: nova }));
    try {
      const res = await fetch("/api/admin/review.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nova ?? "" }),
      });
      if (res.status === 401) {
        router.replace("/admin/login/");
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      setRevisoes((r) => ({ ...r, [id]: anterior }));
      window.alert("Could not save. Please try again.");
    }
  }

  /**
   * Remove um lead da listagem. O registro vai para uma lixeira no servidor,
   * não é destruído — apagar por engano o pedido de um cliente de verdade seria
   * pior do que conviver com um envio de teste na lista.
   */
  async function excluirLead(s: Submission) {
    if (!s.id) return;
    const nome = nomeDoLead(s);
    const confirma = window.confirm(
      "Delete the lead from " + nome + "?\n\nIt leaves this list but stays recoverable on the server.",
    );
    if (!confirma) return;

    setExcluindo(s.id);
    try {
      const res = await fetch("/api/admin/delete.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: s.id }),
      });
      if (res.status === 401) {
        router.replace("/admin/login/");
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      await load(true);
    } catch {
      window.alert("Could not delete. Please try again.");
    } finally {
      setExcluindo(null);
    }
  }

  const [from, to] = useDateRange(preset, customFrom, customTo);

  const inRange = (ts: string) => {
    const t = new Date(ts).getTime();
    return !Number.isNaN(t) && t >= from && t <= to;
  };

  // Com algo digitado na busca, procura em TODAS as datas: quem procura um nome
  // quer achar a pessoa, e ela pode ter escrito antes do período selecionado.
  const submissions = useMemo(
    () =>
      (data?.submissions ?? [])
        .filter((s) => s.ts && (buscando ? bateComBusca(s, busca) : inRange(s.ts)))
        .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, from, to, busca, buscando]
  );

  // O cartão de resumo conta o PERÍODO, com ou sem busca: é o número que o
  // filtro de datas logo acima promete. Os resultados da busca têm contagem própria.
  const totalNoPeriodo = useMemo(
    () => (data?.submissions ?? []).filter((s) => s.ts && inRange(s.ts)).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, from, to]
  );

  const calls = useMemo(
    () => (data?.calls ?? []).filter((c) => c.ts && inRange(c.ts)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, from, to]
  );

  // Ligações de cada lead depois do envio. Sobre tudo, e não só o período:
  // o lead do último dia do filtro pode ter ligado no dia seguinte.
  const ligacoesDoLead = useMemo(
    () => ligacoesPorLead(data?.submissions ?? [], data?.calls ?? []),
    [data]
  );

  // Group submissions by local day.
  /**
   * O filtro de revisão vale sobre o que o período (ou a busca) já recortou.
   * "Not reviewed" é a fila de trabalho: ao marcar, o lead sai dela na hora.
   * Candidatura não se qualifica, então só aparece em "All".
   */
  const passaNoFiltro = (s: Submission, f: Filtro) => {
    if (f === "all") return true;
    if (!isLead(s)) return false;
    const r = revisaoDe(s);
    return f === "pending" ? r === null : r === f;
  };

  // Os dois filtros se cruzam: as contagens da revisão consideram os filtros de
  // origem, e as opções dos filtros de origem consideram a revisão escolhida —
  // todo número na tela bate com a lista que aparece embaixo dele.
  const ctxFiltros = useMemo(() => ({ ligacoes: ligacoesDoLead }), [ligacoesDoLead]);

  const contagemFiltro = useMemo(() => {
    const c: Record<Filtro, number> = { all: 0, pending: 0, valid: 0, invalid: 0 };
    for (const s of aplicarFiltrosLead(submissions, filtrosLead, ctxFiltros))
      for (const f of FILTROS) if (passaNoFiltro(s, f.value)) c[f.value]++;
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissions, revisoes, filtrosLead, ctxFiltros]);

  const porRevisao = useMemo(
    () => submissions.filter((s) => passaNoFiltro(s, filtro)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [submissions, filtro, revisoes]
  );

  const visiveis = useMemo(
    () => aplicarFiltrosLead(porRevisao, filtrosLead, ctxFiltros),
    [porRevisao, filtrosLead, ctxFiltros]
  );

  const submissionsByDay = useMemo(() => {
    const groups = new Map<string, Submission[]>();
    for (const s of visiveis) {
      const k = dayKey(s.ts);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(s);
    }
    return Array.from(groups.entries());
  }, [visiveis]);

  // Calls aggregated by day (desc) and by location.
  const callsByDay = useMemo(() => {
    const m = new Map<string, { label: string; count: number }>();
    for (const c of calls) {
      const k = dayKey(c.ts);
      if (!m.has(k)) m.set(k, { label: fmtDayLabel(c.ts), count: 0 });
      m.get(k)!.count++;
    }
    return Array.from(m.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [calls]);

  const callsByLocation = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of calls) {
      const key = c.location || "unknown";
      m.set(key, (m.get(key) ?? 0) + 1);
    }
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [calls]);

  // Por página: é o que mostra a /thank-you/ separada — pela posição ela
  // entra como "Page body", misturada com o resto do site.
  const callsByPage = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of calls) {
      const key = c.page || "unknown";
      m.set(key, (m.get(key) ?? 0) + 1);
    }
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [calls]);

  const maxDayCalls = Math.max(1, ...callsByDay.map(([, v]) => v.count));

  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-ocean" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertCircle size={32} className="text-red-500" />
        <p className="text-gray-600">
          Couldn&apos;t load the dashboard data.
        </p>
        <button
          onClick={() => load(true)}
          className="px-5 py-2.5 bg-ocean text-white font-semibold rounded-full"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Form submissions and call-button clicks.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => load(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-ocean/40 hover:text-primary transition disabled:opacity-50"
            >
              <RefreshCcw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-red-300 hover:text-red-600 transition"
            >
              <LogOut size={15} />
              Log out
            </button>
          </div>
        </div>

        {/* Navegação entre as telas do painel */}
        <div className="mb-8">
          <AdminNav current="dashboard" />
        </div>

        {/* Period filter */}
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

        {/* Summary cards (click to switch tab) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setTab("submissions")}
            className={`rounded-2xl bg-white border p-6 flex items-center gap-4 shadow-sm text-left transition ${
              tab === "submissions"
                ? "border-ocean ring-1 ring-accent/30"
                : "border-gray-100 hover:border-ocean/40"
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-ocean/10 flex items-center justify-center shrink-0">
              <Inbox size={22} className="text-ocean" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {totalNoPeriodo}
              </p>
              <p className="text-sm text-gray-500">Form submissions</p>
            </div>
          </button>
          <button
            onClick={() => setTab("calls")}
            className={`rounded-2xl bg-white border p-6 flex items-center gap-4 shadow-sm text-left transition ${
              tab === "calls"
                ? "border-primary ring-1 ring-primary/30"
                : "border-gray-100 hover:border-primary/40"
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <PhoneCall size={22} className="text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{calls.length}</p>
              <p className="text-sm text-gray-500">Call-button clicks</p>
            </div>
          </button>
        </div>

        {/* Tabs + busca */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-[12px] bg-white border border-gray-200 p-1">
          <button
            onClick={() => setTab("submissions")}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-[10px] text-sm font-medium transition ${
              tab === "submissions"
                ? "gradient-navy text-white shadow-sm"
                : "text-navy/70 hover:text-ocean"
            }`}
          >
            <Inbox size={15} />
            Form Submissions
          </button>
          <button
            onClick={() => setTab("calls")}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-[10px] text-sm font-medium transition ${
              tab === "calls"
                ? "gradient-navy text-white shadow-sm"
                : "text-navy/70 hover:text-ocean"
            }`}
          >
            <PhoneCall size={15} />
            Call Clicks
          </button>
        </div>

        {tab === "submissions" && (
          <div className="relative w-full sm:w-80">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Search by name, e-mail or phone"
              aria-label="Search leads"
              className="w-full rounded-[12px] border border-gray-200 bg-white py-2.5 pl-10 pr-9 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-ocean focus:ring-2 focus:ring-ocean/15 [&::-webkit-search-cancel-button]:hidden"
            />
            {buscando && (
              <button
                type="button"
                onClick={() => setBusca("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-navy"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}
        </div>

        {tab === "submissions" && (
          <div
            role="group"
            aria-label="Filter by review"
            className="-mt-3 mb-3 flex flex-wrap items-center gap-2"
          >
            {FILTROS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFiltro(f.value)}
                aria-pressed={filtro === f.value}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                  filtro === f.value
                    ? f.value === "valid"
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : f.value === "invalid"
                        ? "border-red-500 bg-red-500 text-white"
                        : "border-navy bg-navy text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-ocean/40 hover:text-ocean"
                }`}
              >
                {f.label}
                <span className={filtro === f.value ? "text-white/75" : "text-gray-400"}>
                  {contagemFiltro[f.value]}
                </span>
              </button>
            ))}
          </div>
        )}

        {tab === "submissions" && (
          <PainelFiltrosLead
            base={porRevisao}
            filtros={filtrosLead}
            setFiltros={setFiltrosLead}
            ligacoes={ligacoesDoLead}
          />
        )}

        {tab === "submissions" && filtrandoOrigem && !buscando && (
          <p className="-mt-3 mb-6 text-sm text-gray-500">
            Showing <span className="font-medium text-navy">{visiveis.length}</span> of{" "}
            {porRevisao.length} lead{porRevisao.length === 1 ? "" : "s"} in this period
          </p>
        )}

        {tab === "submissions" && buscando && (
          <p className="-mt-3 mb-6 text-sm text-gray-500">
            {submissions.length} result{submissions.length === 1 ? "" : "s"} for{" "}
            <span className="font-medium text-navy">&ldquo;{busca.trim()}&rdquo;</span> · searching all
            dates
          </p>
        )}

        {/* Submissions */}
        {tab === "submissions" && (
          <>
        {submissionsByDay.length === 0 ? (
          <div className="rounded-2xl bg-white border border-gray-100 p-10 text-center text-gray-400 mb-12">
            {(filtro !== "all" || filtrandoOrigem) && submissions.length > 0
              ? "No leads in this filter."
              : buscando
                ? "No leads match this search."
                : "No submissions in this period."}
          </div>
        ) : (
          <div className="space-y-6 mb-12">
            {submissionsByDay.map(([key, items]) => (
              <div key={key}>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-sm font-semibold text-gray-700">
                    {fmtDayLabel(items[0].ts)}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {items.length} lead{items.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-3">
                  {items.map((s, i) => {
                    const revisao = revisaoDe(s);
                    return (
                    <div
                      key={`${key}-${i}`}
                      // A faixa na borda esquerda deixa a lista legível de longe:
                      // verde revisado e bom, vermelho descartado, sem faixa a revisar.
                      className={`rounded-2xl bg-white border border-gray-100 p-5 shadow-sm ${
                        revisao === "valid"
                          ? "border-l-4 border-l-emerald-500"
                          : revisao === "invalid"
                            ? "border-l-4 border-l-red-400"
                            : ""
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="font-semibold text-navy">{nomeDoLead(s)}</p>
                          <p className="text-xs text-gray-400">
                            {fmtTime(s.ts)}
                            {s.page_url ? ` · ${s.page_url}` : ""}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {s.type === "resume" && (
                            <span className="text-xs bg-navy/10 text-navy font-medium rounded-full px-2.5 py-1">
                              résumé
                            </span>
                          )}
                          {s.position && (
                            <span className="text-xs bg-ocean/10 text-ocean font-medium rounded-full px-2.5 py-1">
                              {s.position}
                            </span>
                          )}
                          {(s.services ?? []).map((servico) => (
                            <span
                              key={servico}
                              className="text-xs bg-ocean/10 text-ocean font-medium rounded-full px-2.5 py-1"
                            >
                              {servico}
                            </span>
                          ))}
                          {s.hear_about && (
                            <span className="text-xs bg-gray-100 text-gray-600 font-medium rounded-full px-2.5 py-1">
                              via {s.hear_about}
                            </span>
                          )}
                          {/* Só lead de venda: candidatura do Join Our Team não se qualifica. */}
                          {s.id && isLead(s) && (
                            <div
                              role="group"
                              aria-label="Lead quality"
                              className="inline-flex rounded-[10px] border border-gray-200 p-0.5"
                            >
                              <button
                                type="button"
                                onClick={() => marcar(s, "valid")}
                                aria-pressed={revisao === "valid"}
                                title={revisao === "valid" ? "Marked as valid. Click to clear" : "Mark as a valid lead"}
                                className={`inline-flex items-center gap-1 rounded-[8px] px-2 py-0.5 text-xs font-medium transition ${
                                  revisao === "valid"
                                    ? "bg-emerald-600 text-white"
                                    : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-700"
                                }`}
                              >
                                <Check size={13} />
                                Valid
                              </button>
                              <button
                                type="button"
                                onClick={() => marcar(s, "invalid")}
                                aria-pressed={revisao === "invalid"}
                                title={revisao === "invalid" ? "Marked as invalid. Click to clear" : "Mark as an invalid lead"}
                                className={`inline-flex items-center gap-1 rounded-[8px] px-2 py-0.5 text-xs font-medium transition ${
                                  revisao === "invalid"
                                    ? "bg-red-500 text-white"
                                    : "text-gray-500 hover:bg-red-50 hover:text-red-600"
                                }`}
                              >
                                <Ban size={13} />
                                Invalid
                              </button>
                            </div>
                          )}
                          {s.id && (
                            <button
                              type="button"
                              onClick={() => excluirLead(s)}
                              disabled={excluindo === s.id}
                              title="Delete this lead"
                              aria-label={"Delete the lead from " + nomeDoLead(s)}
                              className="inline-flex items-center gap-1 rounded-[10px] border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-500 transition hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                            >
                              {excluindo === s.id ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Trash2 size={13} />
                              )}
                              Delete
                            </button>
                          )}
                          {s.email_status === "failed" && (
                            <span className="text-xs bg-amber-100 text-amber-700 font-medium rounded-full px-2.5 py-1">
                              email failed
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                        {s.phone && (
                          <a
                            href={`tel:${s.phone.replace(/[^\d+]/g, "")}`}
                            className="flex items-center gap-2 text-gray-700 hover:text-ocean"
                          >
                            <PhoneCall size={14} className="text-gray-400" />
                            {s.phone}
                          </a>
                        )}
                        {s.email && (
                          <a
                            href={`mailto:${s.email}`}
                            className="flex items-center gap-2 text-gray-700 hover:text-ocean break-all"
                          >
                            <Mail size={14} className="text-gray-400 shrink-0" />
                            {s.email}
                          </a>
                        )}
                        {(s.street || s.zip_code) && (
                          <span className="flex items-center gap-2 text-gray-700">
                            <MapPin size={14} className="text-gray-400 shrink-0" />
                            {[s.street, s.zip_code].filter(Boolean).join(", ")}
                          </span>
                        )}
                        {s.resume && s.resume !== "no file attached" && (
                          <span className="flex items-center gap-2 text-gray-700">
                            <Inbox size={14} className="text-gray-400 shrink-0" />
                            {s.resume}
                          </span>
                        )}
                      </div>

                      {s.message && (
                        <details className="mt-3 group">
                          <summary className="flex items-center gap-1 text-sm text-ocean font-medium cursor-pointer list-none">
                            <ChevronDown
                              size={14}
                              className="group-open:rotate-180 transition-transform"
                            />
                            Message
                          </summary>
                          <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-xl p-3">
                            {s.message}
                          </p>
                        </details>
                      )}

                      {/* De onde este lead veio, e por onde passou antes de escrever. */}
                      <LeadJourney
                        a={s.attribution}
                        enviadoEm={s.ts}
                        thankYou={viuThankYou(s)}
                        ligacoes={s.id ? ligacoesDoLead.get(s.id) : undefined}
                      />
                    </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}

        {/* Calls */}
        {tab === "calls" && (
          <>
        <div className="grid lg:grid-cols-2 gap-4">
          {/* By day */}
          <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">By day</h3>
            {callsByDay.length === 0 ? (
              <p className="text-gray-400 text-sm">No clicks in this period.</p>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {callsByDay.map(([key, v]) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="w-28 shrink-0 text-xs text-gray-500">
                      {v.label}
                    </span>
                    <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-ocean rounded-full"
                        style={{
                          width: `${(v.count / maxDayCalls) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-7 shrink-0 text-sm font-semibold text-gray-700 text-right">
                      {v.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* By location */}
          <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              By location on site
            </h3>
            {callsByLocation.length === 0 ? (
              <p className="text-gray-400 text-sm">No clicks in this period.</p>
            ) : (
              <div className="space-y-3">
                {callsByLocation.map(([loc, count]) => (
                  <div
                    key={loc}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600">
                      {LOCATION_LABELS[loc] ?? loc}
                    </span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* By page */}
          <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm lg:col-span-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">By page</h3>
            <p className="text-xs text-gray-400 mb-4">
              Calls from /thank-you/ come from people who had just sent the form — each one also
              shows on that lead&apos;s card.
            </p>
            {callsByPage.length === 0 ? (
              <p className="text-gray-400 text-sm">No clicks in this period.</p>
            ) : (
              <div className="grid gap-x-10 gap-y-3 sm:grid-cols-2 max-h-80 overflow-y-auto pr-1">
                {callsByPage.map(([page, count]) => (
                  <div
                    key={page}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <span className="truncate text-gray-600">
                      {page === "/" ? "Home" : page}
                    </span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {data?.callsCapped && (
          <p className="text-xs text-gray-400 mt-4">
            Showing the most recent 20,000 call clicks.
          </p>
        )}
          </>
        )}
      </div>
    </section>
  );
}
