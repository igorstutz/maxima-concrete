"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Endereço novo do Elfsight (o antigo era static.elfsight.com/platform/).
 * Os dois ainda servem o mesmo arquivo, mas este é o que eles publicam hoje —
 * e o antigo, cedo ou tarde, sai do ar.
 */
const ELFSIGHT_SCRIPT_SRC = "https://elfsightcdn.com/platform.js";

/**
 * Esconde elementos indesejados injetados pelo widget Elfsight dentro de
 * `container` (percorrendo também shadow roots): o selo do plano gratuito
 * ("Free ... Widget") e cabeçalhos configurados (via `hideHeadings`).
 * Também injeta `css` em cada raiz: os widgets novos do Elfsight renderizam
 * num shadow DOM, onde o CSS global do site não chega.
 */
function scrubWidget(
  container: HTMLElement,
  hideBadge: boolean,
  hideHeadings: string[],
  css: string
) {
  const roots: (Element | ShadowRoot)[] = [container];
  container.querySelectorAll("*").forEach((el) => {
    const sr = (el as HTMLElement).shadowRoot;
    if (sr) roots.push(sr);
  });

  for (const root of roots) {
    if (css && !Array.from(root.children).some((c) => c.matches("style[data-mx-elfsight]"))) {
      const style = document.createElement("style");
      style.setAttribute("data-mx-elfsight", "");
      style.textContent = css;
      root.appendChild(style);
    }

    // Selo do plano gratuito do Elfsight ("Free ... Widget").
    if (hideBadge) {
      root
        .querySelectorAll<HTMLElement>('.eapps-widget-toolbar, [class*="WidgetToolbar"]')
        .forEach((el) => {
          el.style.display = "none";
        });
      root.querySelectorAll<HTMLAnchorElement>('a[href*="elfsight.com"]').forEach((a) => {
        const box =
          a.closest<HTMLElement>('[class*="toolbar" i], [class*="Toolbar"]') ?? a;
        box.style.display = "none";
      });
    }

    // Cabeçalhos configurados no painel do Elfsight (ex.: "What Our Customers Say").
    if (hideHeadings.length) {
      root.querySelectorAll<HTMLElement>("*").forEach((el) => {
        if (el.childElementCount !== 0) return;
        const text = el.textContent?.trim();
        if (text && hideHeadings.includes(text)) el.style.display = "none";
      });
    }
  }
}

/**
 * Embed Elfsight genérico (reviews Google, feed Instagram).
 * Só injeta o script externo quando a seção se aproxima da viewport
 * (IntersectionObserver) — mantém a home leve no carregamento inicial.
 * Força a remoção do selo gratuito do Elfsight e de cabeçalhos indesejados,
 * e aplica `css` dentro do widget (cores que o painel do Elfsight não ajusta
 * para o fundo da seção).
 */
export default function ElfsightWidget({
  widgetId,
  className = "",
  hideBadge = true,
  hideHeadings = [],
  css = "",
}: {
  widgetId: string;
  className?: string;
  hideBadge?: boolean;
  hideHeadings?: string[];
  css?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    if (!document.querySelector(`script[src="${ELFSIGHT_SCRIPT_SRC}"]`)) {
      const s = document.createElement("script");
      s.src = ELFSIGHT_SCRIPT_SRC;
      s.async = true;
      s.defer = true;
      document.body.appendChild(s);
    }
  }, [visible]);

  // Limpa o selo/cabeçalhos assim que o widget renderiza (e a cada re-render).
  useEffect(() => {
    if (!visible) return;
    const el = ref.current;
    if (!el || (!hideBadge && hideHeadings.length === 0 && !css)) return;

    const run = () => scrubWidget(el, hideBadge, hideHeadings, css);

    run();
    const observer = new MutationObserver(() => run());
    observer.observe(el, { childList: true, subtree: true });
    // Reforço para renderizações tardias do widget externo.
    const timers = [400, 1000, 2000, 4000].map((t) => window.setTimeout(run, t));

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [visible, hideBadge, hideHeadings, css]);

  return (
    <div ref={ref} className={className}>
      {visible && (
        <div className={`elfsight-app-${widgetId}`} data-elfsight-app-lazy />
      )}
    </div>
  );
}
