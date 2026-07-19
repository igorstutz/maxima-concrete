"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

/** Accordion do FAQ da página de financiamento (números grandes à esquerda). */
export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {faqs.map((f, i) => {
        const isOpen = openFaq === i;
        return (
          <div key={f.q}>
            <button
              onClick={() => setOpenFaq(isOpen ? null : i)}
              className="group -mx-2 flex w-full items-start gap-6 rounded-lg px-2 py-7 text-left transition-colors hover:bg-white/[0.02]"
            >
              <span
                className={`shrink-0 font-mono text-2xl font-black tracking-tight transition-colors md:text-3xl ${
                  isOpen
                    ? "text-[hsl(180_85%_60%)]"
                    : "text-white/20 group-hover:text-white/40"
                }`}
              >
                0{i + 1}
              </span>
              <h3 className="flex-1 pt-1 text-lg font-bold leading-snug text-white md:text-xl">
                {f.q}
              </h3>
              <span
                className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all ${
                  isOpen
                    ? "rotate-180 border-[hsl(180_85%_60%)] bg-[hsl(180_85%_60%)] text-[hsl(218_50%_10%)]"
                    : "border-white/20 text-white/70 group-hover:border-white/40"
                }`}
              >
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] pb-7 opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="pl-12 pr-12 text-base leading-relaxed text-white/70 md:text-lg">
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
