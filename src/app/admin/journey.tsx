"use client";

/**
 * A jornada de um lead: por onde ele chegou e o que visitou antes de escrever.
 *
 * Fica recolhida por padrão. A lista de leads é para dar conta do dia — quem
 * abre o painel quer ver quem chegou e ligar de volta; a jornada só interessa
 * quando alguém pergunta "de onde veio este?", e aberta por padrão empurraria
 * os leads seguintes para fora da tela.
 */

import { useState } from "react";
import { ChevronDown, ExternalLink, MousePointerClick, Route } from "lucide-react";
import { canalDoLead, type Atribuicao, type Toque } from "./shared";

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

export function LeadJourney({ a }: { a?: Atribuicao | null }) {
  const [aberto, setAberto] = useState(false);
  if (!a) return null;

  const toques = a.touchpoints ?? [];
  const paginas = a.pages ?? [];
  const canal = canalDoLead(a);

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <div className="flex flex-wrap items-center gap-2">
        <CanalBadge canal={canal} />
        {typeof a.sessions === "number" && a.sessions > 0 && (
          <span className="text-xs text-gray-500">
            {a.sessions} visit{a.sessions > 1 ? "s" : ""} before contact
          </span>
        )}
        {(toques.length > 0 || paginas.length > 0 || a.first) && (
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
                {toques.map((t, i) => (
                  <li key={`${t.ts}-${i}`} className="flex flex-wrap items-baseline gap-x-2 text-xs">
                    <span className="w-4 shrink-0 text-gray-400">{i + 1}.</span>
                    <span className="font-medium text-gray-700">{t.channel}</span>
                    {t.campaign && <span className="text-gray-500">{t.campaign}</span>}
                    {t.landing && <span className="text-gray-500">→ {t.landing}</span>}
                    <span className="ml-auto text-gray-400">{hora(t.ts)}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {paginas.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">
                <MousePointerClick size={12} />
                Pages viewed ({paginas.length})
              </p>
              <ol className="max-h-44 space-y-1 overflow-y-auto pr-1">
                {paginas.map((p, i) => (
                  <li key={`${p.ts}-${i}`} className="flex items-baseline gap-2 text-xs">
                    <span className="truncate text-gray-700">{p.path}</span>
                    <span className="ml-auto shrink-0 text-gray-400">{hora(p.ts)}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
