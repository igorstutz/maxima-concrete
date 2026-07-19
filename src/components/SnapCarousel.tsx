"use client";

import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Carrossel leve com CSS scroll-snap + botões (substitui o embla do site
 * antigo sem dependência nova). Os slides devem trazer as classes
 * `shrink-0 snap-start` e a largura desejada.
 */
interface SnapCarouselProps {
  children: ReactNode;
  className?: string;
  /** classes extras do track (gap, altura, paddings) */
  trackClassName?: string;
  /** posição dos botões prev/next */
  controls?: "below" | "overlay-bottom" | "overlay-sides";
  /** classes extras no wrapper dos botões (modo "below"/"overlay-bottom") */
  controlsClassName?: string;
}

const LIGHT_BTN =
  "flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-navy shadow-sm transition-colors hover:bg-gray-100";
const DARK_BTN =
  "absolute top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/50";

export function SnapCarousel({
  children,
  className = "",
  trackClassName = "",
  controls = "below",
  controlsClassName = "",
}: SnapCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByStep = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
    const step = first ? first.offsetWidth + gap : track.clientWidth;
    const maxScroll = track.scrollWidth - track.clientWidth;
    let next = track.scrollLeft + dir * step;
    // loop: fim -> início e vice-versa (mesma sensação do loop do embla)
    if (dir === 1 && track.scrollLeft >= maxScroll - 4) next = 0;
    else if (dir === -1 && track.scrollLeft <= 4) next = maxScroll;
    track.scrollTo({ left: next, behavior: "smooth" });
  };

  const prev = (
    <button
      type="button"
      aria-label="Previous slide"
      onClick={() => scrollByStep(-1)}
      className={controls === "overlay-sides" ? `${DARK_BTN} left-2` : LIGHT_BTN}
    >
      <ChevronLeft className="h-4 w-4" />
    </button>
  );
  const next = (
    <button
      type="button"
      aria-label="Next slide"
      onClick={() => scrollByStep(1)}
      className={controls === "overlay-sides" ? `${DARK_BTN} right-2` : LIGHT_BTN}
    >
      <ChevronRight className="h-4 w-4" />
    </button>
  );

  return (
    <div className={`relative ${className}`}>
      <div
        ref={trackRef}
        className={`scrollbar-hide touch-scroll-x flex snap-x snap-mandatory overflow-x-auto ${trackClassName}`}
      >
        {children}
      </div>
      {controls === "below" && (
        <div
          className={`mt-6 flex justify-center gap-2 md:mt-8 md:justify-start ${controlsClassName}`}
        >
          {prev}
          {next}
        </div>
      )}
      {controls === "overlay-bottom" && (
        <div
          className={`absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 ${controlsClassName}`}
        >
          {prev}
          {next}
        </div>
      )}
      {controls === "overlay-sides" && (
        <>
          {prev}
          {next}
        </>
      )}
    </div>
  );
}
