"use client";

import { useEffect, useRef, useState } from "react";

const ELFSIGHT_SCRIPT_SRC = "https://static.elfsight.com/platform/platform.js";

/**
 * Embed Elfsight genérico (reviews Google, feed Instagram).
 * Só injeta o script externo quando a seção se aproxima da viewport
 * (IntersectionObserver) — mantém a home leve no carregamento inicial.
 */
export default function ElfsightWidget({
  widgetId,
  className = "",
}: {
  widgetId: string;
  className?: string;
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

  return (
    <div ref={ref} className={className}>
      {visible && (
        <div className={`elfsight-app-${widgetId}`} data-elfsight-app-lazy />
      )}
    </div>
  );
}
