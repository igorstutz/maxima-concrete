"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "@/components/Image";

/**
 * Carrossel de imagens da seção "What sets Maxima Concrete apart?" (home).
 * Crossfade automático, dots clicáveis, swipe no mobile e pausa no hover.
 * As imagens vêm do CMS (campo `images`); com uma única imagem, os dots somem.
 */
export default function WhyMaximaCarousel({ images }: { images: string[] }) {
  const slides = images.length ? images : ["/images/assets/why-maxima.png"];
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const paused = useRef(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-avanço lento (pausa quando o mouse está sobre a imagem).
  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => {
      if (!paused.current) setIndex((p) => (p + 1) % count);
    }, 7000);
    return () => clearInterval(id);
  }, [count]);

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      setIndex((p) => (p + (dx < 0 ? 1 : count - 1)) % count);
    }
    touchStartX.current = null;
  };

  const go = (delta: number) => setIndex((p) => (p + delta + count) % count);

  return (
    <div className="flex w-full flex-col items-center gap-2.5">
      <div
        className="relative h-64 w-full overflow-hidden rounded-2xl md:h-96"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slides.map((src, i) => (
          <Image
            key={`${src}-${i}`}
            src={src}
            alt="Maxima Concrete"
            fill
            sizes="(min-width: 768px) 640px, 100vw"
            priority={i === 0}
            className={`object-cover transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-ocean/55 text-white ring-1 ring-inset ring-white/30 backdrop-blur-md transition-colors hover:bg-ocean/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:size-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-ocean/55 text-white ring-1 ring-inset ring-white/30 backdrop-blur-md transition-colors hover:bg-ocean/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:size-10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex gap-1.5" role="tablist" aria-label="Image carousel navigation">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show image ${i + 1} of ${count}`}
              onClick={() => setIndex(i)}
              className="p-1"
            >
              <span
                className={`block size-1.5 rounded-full transition-colors ${
                  i === index ? "bg-ocean" : "bg-ocean/50 hover:bg-ocean/70"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
