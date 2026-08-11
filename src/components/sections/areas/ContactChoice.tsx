"use client";

import { useEffect, useRef, useState } from "react";
import { ClipboardList, Phone } from "lucide-react";
import { Container } from "@/components/Container";

type Choice = "phone" | "form";

/** Altura das barras fixas que o alvo do scroll precisa desviar. */
const SCROLL_OFFSET = { mobile: 124, desktop: 76 };

/**
 * contact-choice — abertura da página Contact Us: explica os dois caminhos de
 * contato e leva o visitante ao escolhido. Não é um filtro: as duas seções
 * seguem na página, o toggle só rola até a certa.
 *
 * Depois que o bloco sai da tela, as mesmas opções reaparecem numa barra fixa
 * no topo, para a escolha continuar à mão durante a rolagem.
 */
export default function ContactChoice({
  content,
}: {
  content: Record<string, any>;
}) {
  const [choice, setChoice] = useState<Choice | null>(null);
  const [stuck, setStuck] = useState(false);
  const inlineRef = useRef<HTMLDivElement>(null);

  const title: string = content?.title || "";
  const description: string = content?.description || "";
  const phoneLabel: string = content?.phoneLabel || "Call us";
  const formLabel: string = content?.formLabel || "Form";
  const formBadge: string = content?.formBadge || "";
  const stickyLabel: string = content?.stickyLabel || "How would you like to get in touch?";

  // A barra só entra quando o toggle original já passou para cima — parada no
  // hero, acima da seção, ela não deve aparecer.
  useEffect(() => {
    const anchor = inlineRef.current;
    if (!anchor) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );
    io.observe(anchor);
    return () => io.disconnect();
  }, []);

  const goTo = (next: Choice, targetId: string) => {
    setChoice(next);
    const target = document.getElementById(targetId);
    if (!target) return;
    const offset =
      window.innerWidth < 1024 ? SCROLL_OFFSET.mobile : SCROLL_OFFSET.desktop;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  // cursor-pointer explícito: o preflight do Tailwind v4 deixa <button> com
  // cursor default. Cada opção é um botão fechado em si (borda + fundo
  // próprio); a bandeja em volta só agrupa as duas.
  const optionClass = (active: boolean, compact: boolean) =>
    `flex flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl border font-semibold transition-all duration-200 ${
      compact ? "px-3 py-2 text-[13px]" : "px-5 py-3 text-sm md:text-base"
    } ${
      active
        ? "gradient-navy border-transparent text-white shadow-sm"
        : "border-navy/20 bg-white text-navy shadow-[0_1px_2px_rgba(4,28,45,0.05)] hover:border-ocean hover:text-ocean hover:shadow-md"
    }`;

  /** Selo "Best option": pílula branca com borda em degradê azul da marca. */
  const badgeStyle = {
    background:
      "linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(90deg, #1e90ff 0%, #003b8b 100%) border-box",
    border: "1px solid transparent",
  };

  const options = (compact: boolean) => (
    <>
      <button
        type="button"
        aria-pressed={choice === "phone"}
        onClick={() => goTo("phone", "contact-phone")}
        className={optionClass(choice === "phone", compact)}
      >
        <Phone className={compact ? "h-3.5 w-3.5 shrink-0" : "h-4 w-4 shrink-0"} />
        {phoneLabel}
      </button>

      <button
        type="button"
        aria-pressed={choice === "form"}
        onClick={() => goTo("form", "contact")}
        className={optionClass(choice === "form", compact)}
      >
        <ClipboardList
          className={compact ? "h-3.5 w-3.5 shrink-0" : "h-4 w-4 shrink-0"}
        />
        {formLabel}
        {formBadge && (
          <span
            // shrink-0 + nowrap: na barra compacta o espaço é curto e sem isso
            // o selo quebra em duas linhas.
            className={`shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 font-semibold uppercase tracking-wide text-ocean ${
              compact ? "text-[9px]" : "text-[10px]"
            }`}
            style={badgeStyle}
          >
            {formBadge}
          </span>
        )}
      </button>
    </>
  );

  return (
    <>
      {/* Barra fixa — z-40 fica abaixo do menu flutuante (z-50) para não passar
          por cima dele; no mobile desce 64px, a altura do header fixo. */}
      <div
        className={`fixed inset-x-0 top-16 z-40 border-b border-navy/10 bg-white/95 shadow-sm backdrop-blur-sm transition-all duration-300 lg:top-0 ${
          stuck
            ? "translate-y-0 opacity-100"
            : "invisible pointer-events-none -translate-y-full opacity-0"
        }`}
        aria-hidden={!stuck}
      >
        <Container>
          <div className="flex items-center justify-between gap-4 py-2.5">
            <span className="hidden text-sm font-medium text-navy/70 lg:block">
              {stickyLabel}
            </span>
            <div className="flex flex-1 gap-2 lg:flex-none lg:justify-end">
              {options(true)}
            </div>
          </div>
        </Container>
      </div>

      <section className="w-full bg-white pt-12 pb-4 md:pt-16 md:pb-6">
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            {title && (
              <h2 className="text-2xl font-semibold tracking-tight text-navy md:text-[32px]">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-navy/70 md:text-lg">
                {description}
              </p>
            )}

            <div
              ref={inlineRef}
              role="group"
              aria-label="Choose how to get in touch"
              className="mt-7 flex w-full max-w-md flex-col gap-2 rounded-2xl bg-surface p-2 sm:flex-row"
            >
              {options(false)}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
