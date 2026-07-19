"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { SmartLink } from "./SmartLink";

interface RecentProjectsContent {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  images?: string[];
}

export default function RecentProjects({ content }: { content: Record<string, any> }) {
  const c = content as RecentProjectsContent;
  const images = c.images ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const handlePrev = () =>
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () =>
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) (diff > 0 ? handleNext : handlePrev)();
    touchStartX.current = null;
  };

  const altFor = (index: number) =>
    `Recent concrete project by Maxima Concrete — image ${index + 1}`;

  const arrowBtn =
    "flex items-center justify-center rounded-full border border-white/50 text-white transition-all duration-300 hover:bg-white/10";

  const ctaButton = (extra: string) => (
    <SmartLink
      href={c.ctaLink}
      className={`flex w-fit items-center gap-2 rounded-[5px] bg-white px-5 py-2.5 text-sm font-medium text-navy transition-all duration-300 hover:scale-105 hover:bg-white/90 md:px-6 md:py-3 ${extra}`}
    >
      {c.ctaText}
      <ArrowUpRight className="h-4 w-4" />
    </SmartLink>
  );

  return (
    <section
      id="recent-projects"
      className="py-16 sm:py-24"
      style={{ background: "linear-gradient(90deg, #494948 0%, #252525 100%)" }}
    >
      <Container>
        <h2 className="mb-2 text-2xl font-medium text-white md:text-3xl lg:text-[36px]">
          {c.title}
        </h2>
        <p className="mb-4 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
          {c.description}
        </p>

        {/* Imagem principal (swipe no touch) */}
        <div
          className="relative mb-6 h-[250px] w-full select-none overflow-hidden rounded-xl md:mb-8 md:h-[350px] lg:h-[500px]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {images[activeIndex] && (
            <Image
              key={activeIndex}
              src={images[activeIndex]}
              alt={altFor(activeIndex)}
              fill
              sizes="(min-width: 1024px) 850px, 100vw"
              className="pointer-events-none object-cover transition-opacity duration-300"
              draggable={false}
            />
          )}
        </div>

        {/* Mobile: dots + setas */}
        <div className="mb-6 flex items-center justify-between md:hidden">
          <div className="flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to project ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex ? "w-4 bg-white" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={handlePrev} aria-label="View previous project" className={`h-9 w-9 ${arrowBtn}`}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={handleNext} aria-label="View next project" className={`h-9 w-9 ${arrowBtn}`}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Desktop/tablet: miniaturas + navegação */}
        <div className="mb-4 hidden w-full md:block">
          <div className="flex gap-3">
            {images.map((src, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show project ${index + 1}`}
                className={`relative h-24 flex-1 overflow-hidden rounded-lg transition-all duration-300 lg:h-40 ${
                  index === activeIndex
                    ? "scale-105 ring-2 ring-white"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt={altFor(index)}
                  fill
                  sizes="120px"
                  className="object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            {ctaButton("")}
            <div className="flex gap-3">
              <button onClick={handlePrev} aria-label="View previous project" className={`h-10 w-10 ${arrowBtn}`}>
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={handleNext} aria-label="View next project" className={`h-10 w-10 ${arrowBtn}`}>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile: CTA */}
        <div className="md:hidden">{ctaButton("")}</div>
      </Container>
    </section>
  );
}
