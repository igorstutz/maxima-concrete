"use client";

/**
 * A jornada de um lead: por onde ele chegou e o que visitou antes de escrever.
 *
 * Fica recolhida por padrão. A lista de leads é para dar conta do dia — quem
 * abre o painel quer ver quem chegou e ligar de volta; a jornada só interessa
 * quando alguém pergunta "de onde veio este?", e aberta por padrão empurraria
 * os leads seguintes para fora da tela.
 */

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ClipboardCheck, ExternalLink, MousePointerClick, PhoneCall, Route } from "lucide-react";
import { canalDoLead, type Atribuicao, type Call, type Toque } from "./shared";

const hora = (ts?: string) =>
  ts
    ? new Date(ts).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

/** Canal em pílula. Pago ganha destaque: é o que tem custo atrelado. */
export function CanalBadge({ canal }: { canal: string }) {
  const pago = /ads|paid/i.test(canal);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
        pago ? "bg-ocean/10 text-ocean" : "bg-gray-100 text-gray-600"
      }`}
      title={pago ? "Paid channel" : "Unpaid channel"}
    >
      <Route size={12} />
      {canal}
    </span>
  );
}

function LinhaToque({ t, rotulo }: { t?: Toque; rotulo: string }) {
  if (!t) return null;
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className="w-24 shrink-0 text-xs font-medium uppercase tracking-wide text-gray-400">
        {rotulo}
      </span>
      <span className="text-sm text-gray-800">{t.channel}</span>
      {t.source && <span className="text-xs text-gray-500">via {t.source}</span>}
      {t.campaign && (
        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{t.campaign}</span>
      )}
      {t.ts && <span className="text-xs text-gray-400">· {hora(t.ts)}</span>}
    </div>
  );
}

/** Um passo da linha do tempo: página vista, ou um dos momentos de conversão. */
type Passo =
  | { tipo: "pagina"; ts: string; path: string }
  | { tipo: "form"; ts: string }
  | { tipo: "thanks"; ts: string }
  | { tipo: "ligacao"; ts: string; page: string };

/** Desempate quando dois passos têm o mesmo horário: a página, o envio, a /thank-you/, a ligação. */
const ORDEM: Record<Passo["tipo"], number> = { pagina: 0, form: 1, thanks: 2, ligacao: 3 };

/**
 * Páginas e conversões numa sequência só, em ordem de horário. É o que mostra
 * QUANDO a pessoa virou contato: em que página estava, o que tinha visto antes
 * e o que fez depois. Em duas listas separadas, isso não se lia.
 */
function linhaDoTempo(
  paginas: { ts: string; path: string }[],
  enviadoEm: string | undefined,
  thankYou: boolean,
  ligacoes: Call[],
): Passo[] {
  const passos: Passo[] = paginas.map((p) => ({ tipo: "pagina", ts: p.ts, path: p.path }));
  if (enviadoEm) {
    passos.push({ tipo: "form", ts: enviadoEm });
    if (thankYou) passos.push({ tipo: "thanks", ts: enviadoEm });
  }
  for (const c of ligacoes) passos.push({ tipo: "ligacao", ts: c.ts, page: c.page });
  const t = (x: Passo) => Date.parse(x.ts) || 0;
  return passos.sort((x, y) => t(x) - t(y) || ORDEM[x.tipo] - ORDEM[y.tipo]);
}

/**
 * `enviadoEm`, `thankYou` e `ligacoes` são o que veio DEPOIS do envio. A
 * jornada gravada termina no clique de enviar; isto vem de fora dela — a
 * página de agradecimento pelo redirecionamento, as ligações pelo log de
 * cliques de telefone, cruzado pelo identificador do visitante.
 */
export function LeadJourney({
  a,
  enviadoEm,
  thankYou = false,
  ligacoes = [],
}: {
  a?: Atribuicao | null;
  enviadoEm?: string;
  thankYou?: boolean;
  ligacoes?: Call[];
}) {
  const [aberto, setAberto] = useState(false);
  const listaRef = useRef<HTMLOListElement>(null);
  const conversaoRef = useRef<HTMLLIElement>(null);

  // A lista tem rolagem e a conversão fica no fim dela: ao abrir, ela já
  // aparece na tela, com algumas páginas de antes para dar contexto.
  useEffect(() => {
    const lista = listaRef.current;
    const alvo = conversaoRef.current;
    if (!aberto || !lista || !alvo) return;
    lista.scrollTop = Math.max(0, alvo.offsetTop - lista.clientHeight / 2);
  }, [aberto]);

  if (!a) return null;

  const toques = a.touchpoints ?? [];
  const paginas = a.pages ?? [];
  const canal = canalDoLead(a);
  const temDepois = thankYou || ligacoes.length > 0;
  const passos = linhaDoTempo(paginas, enviadoEm, thankYou, ligacoes);

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <div className="flex flex-wrap items-center gap-2">
        <CanalBadge canal={canal} />
        {typeof a.sessions === "number" && a.sessions > 0 && (
          <span className="text-xs text-gray-500">
            {a.sessions} visit{a.sessions > 1 ? "s" : ""} before contact
          </span>
        )}
        {/* À vista, sem abrir a jornada: quem pegou o telefone logo depois de
            escrever é o lead mais quente da lista. */}
        {ligacoes.length > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <PhoneCall size={12} />
            Called after submitting{ligacoes.length > 1 ? ` (${ligacoes.length}×)` : ""}
          </span>
        )}
        {(toques.length > 0 || paginas.length > 0 || a.first || temDepois) && (
          <button
            onClick={() => setAberto((v) => !v)}
            className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-ocean hover:text-navy"
          >
            {aberto ? "Hide journey" : "View journey"}
            <ChevronDown size={13} className={aberto ? "rotate-180 transition" : "transition"} />
          </button>
        )}
      </div>

      {aberto && (
        <div className="mt-3 space-y-4 rounded-xl bg-gray-50 p-4">
          <div className="space-y-1.5">
            <LinhaToque t={a.first} rotulo="First touch" />
            <LinhaToque t={a.lastNonDirect} rotulo="Credited" />
            <LinhaToque t={a.last} rotulo="Last touch" />
          </div>

          {a.first?.click_id && (
            <p className="break-all text-xs text-gray-500">
              <span className="font-medium uppercase tracking-wide text-gray-400">Click ID </span>
              {a.first.click_id}
            </p>
          )}
          {a.first?.referrer && (
            <p className="flex items-start gap-1.5 break-all text-xs text-gray-500">
              <ExternalLink size={12} className="mt-0.5 shrink-0" />
              {a.first.referrer}
            </p>
          )}

          {toques.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                Visits ({toques.length})
              </p>
              <ol className="space-y-1.5">
                {toques.map((t, i) => {
                  // A jornada é gravada no envio: a última visita é aquela em que ele aconteceu.
                  const converteu = Boolean(enviadoEm) && i === toques.length - 1;
                  return (
                    <li key={`${t.ts}-${i}`} className="flex flex-wrap items-baseline gap-x-2 text-xs">
                      <span className="w-4 shrink-0 text-gray-400">{i + 1}.</span>
                      <span className="font-medium text-gray-700">{t.channel}</span>
                      {t.campaign && <span className="text-gray-500">{t.campaign}</span>}
                      {t.landing && <span className="text-gray-500">→ {t.landing}</span>}
                      {converteu && (
                        <span className="inline-flex items-center gap-1 self-center rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                          <ClipboardCheck size={11} />
                          Form sent on this visit
                        </span>
                      )}
                      <span className="ml-auto text-gray-400">{hora(t.ts)}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          {passos.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">
                <MousePointerClick size={12} />
                Timeline
                <span className="font-normal normal-case tracking-normal">
                  · {paginas.length} page{paginas.length === 1 ? "" : "s"} viewed
                  {enviadoEm || temDepois ? " · conversion in green" : ""}
                </span>
              </p>
              <ol ref={listaRef} className="relative max-h-56 space-y-1 overflow-y-auto pr-1">
                {passos.map((p, i) => {
                  if (p.tipo === "pagina") {
                    return (
                      <li key={`p-${p.ts}-${i}`} className="flex items-baseline gap-2 px-2 text-xs">
                        <span className="truncate text-gray-700">{p.path}</span>
                        <span className="ml-auto shrink-0 text-gray-400">{hora(p.ts)}</span>
                      </li>
                    );
                  }
                  if (p.tipo === "thanks") {
                    return (
                      <li key={`t-${i}`} className="flex items-baseline gap-2 px-2 text-xs">
                        <span className="truncate text-gray-700">/thank-you/</span>
                        <span className="text-gray-400">thank-you page</span>
                        <span className="ml-auto shrink-0 text-gray-400">{hora(p.ts)}</span>
                      </li>
                    );
                  }
                  const form = p.tipo === "form";
                  return (
                    <li
                      key={`${p.tipo}-${p.ts}-${i}`}
                      ref={form ? conversaoRef : undefined}
                      className="flex items-center gap-2 rounded-lg bg-emerald-50 px-2 py-1.5 text-xs ring-1 ring-inset ring-emerald-200"
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                        {form ? <ClipboardCheck size={11} /> : <PhoneCall size={11} />}
                      </span>
                      <span className="font-semibold text-emerald-800">
                        {form ? "Form submitted" : "Tapped to call"}
                      </span>
                      {!form && (
                        <span className="truncate text-emerald-700/80">from {p.page || "unknown page"}</span>
                      )}
                      <span className="ml-auto shrink-0 font-medium text-emerald-700">{hora(p.ts)}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
