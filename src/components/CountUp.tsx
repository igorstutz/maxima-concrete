"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Anima um número de 0 até o valor final quando o bloco entra na viewport.
 *
 * Recebe o valor já formatado ("1,825+", "9,000+", "A+"): o que não for
 * numérico é exibido direto, e prefixo/sufixo do texto original são
 * preservados. Respeita `prefers-reduced-motion`.
 */
export default function CountUp({
  value,
  durationMs = 1600,
  className,
}: {
  value: string;
  durationMs?: number;
  className?: string;
}) {
  const match = value.match(/^(\D*)([\d.,]+)(.*)$/);
  const digits = match ? match[2].replace(/[.,]/g, "") : "";
  const target = digits ? Number(digits) : NaN;
  const animatable = Boolean(match) && Number.isFinite(target) && target > 0;

  const [display, setDisplay] = useState<number>(animatable ? 0 : target);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!animatable) return;
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / durationMs, 1);
          // easeOutCubic: acelera no começo e desacelera ao chegar no número
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(target * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animatable, target, durationMs]);

  if (!animatable) return <span className={className}>{value}</span>;

  const [, prefix, raw, suffix] = match!;
  // mantém a formatação de milhar só se o valor original tinha separador
  const formatted = /[.,]/.test(raw)
    ? display.toLocaleString("en-US")
    : String(display);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
