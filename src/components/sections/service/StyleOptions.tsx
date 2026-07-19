"use client";

import { useRef, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { SmartLink } from "@/components/sections/home/SmartLink";
import { legacyAsset } from "@/components/sections/home/legacy";

/** Converte **negrito** em <strong> (mesma lógica do renderer antigo). */
function renderBoldText(text: string): ReactNode {
  if (!text) return null;
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

/**
 * style-options — cards verticais de acabamentos/estilos com scroll horizontal
 * no mobile e grade no desktop (DrivewaysPageStyleOptionsRenderer).
 * Variantes "dark" (padrão, gradiente azul) e "light" (fundo branco).
 */
export default function StyleOptions({ content }: { content: Record<string, any> }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const title = content?.title || "";
  const description = content?.description || "";
  const variant = content?.variant || "dark";
  const closingText = content?.closingText || "";
  const ctaText = content?.ctaText || "";
  const ctaLink = content?.ctaLink || "";
  const styles: any[] = content?.styles || [];

  const isLight = variant === "light";
  const bgStyle = isLight
    ? "#FFFFFF"
    : "linear-gradient(263deg, #06253A 46.16%, #000D16 68.33%)";

  const handleScrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <section className="relative w-full py-20 md:py-28" style={{ background: bgStyle }}>
      <Container>
        <div className="mb-8 md:mb-12">
          <h2
            className={`mb-4 text-2xl font-medium leading-[120%] tracking-[-1.28px] sm:text-[28px] md:mb-6 md:text-[32px] ${
              isLight ? "text-ocean" : "text-white"
            }`}
          >
            {title}
          </h2>
          <p
            className={
              isLight
                ? "max-w-full text-base font-normal leading-[130%] tracking-[-0.88px] text-[#494948] sm:text-[22px]"
                : "max-w-full text-sm font-normal leading-[140%] tracking-[-0.64px] text-white/90 sm:max-w-[555px] sm:text-base"
            }
          >
            {isLight ? renderBoldText(description) : description}
          </p>
        </div>

        <div className="relative">
          {/* Botão de scroll no mobile */}
          <button
            onClick={handleScrollRight}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 sm:hidden"
            aria-label="Scroll right"
          >
            <div
              className={`bg-gradient-to-l ${
                isLight ? "from-white via-white/80" : "from-[#06253A] via-[#06253A]/80"
              } to-transparent py-6 pl-6 pr-2`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  isLight
                    ? "bg-black/10 text-black/60 hover:bg-black/20"
                    : "bg-white/20 text-white/80 hover:bg-white/30"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </button>

          <div
            ref={scrollContainerRef}
            className="scrollbar-hide touch-scroll-x flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 pr-12 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:pb-0 sm:pr-0 lg:grid-cols-4"
          >
            {styles.map((style: any, index: number) => {
              const cardClass =
                "group relative h-[320px] w-[180px] flex-shrink-0 snap-start overflow-hidden rounded-xl sm:h-auto sm:w-full sm:aspect-[57/104]";
              const inner = (
                <>
                  {style.image && (
                    <Image
                      src={legacyAsset(style.image)}
                      alt={style.title || ""}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 180px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <h3 className="mb-1.5 text-sm font-medium leading-[120%] tracking-[-0.64px] text-white sm:mb-2 sm:text-base">
                      {style.title}
                    </h3>
                    <p className="text-[11px] font-medium leading-[130%] tracking-[-0.48px] text-white/80 sm:text-xs">
                      {style.description}
                    </p>
                  </div>
                </>
              );

              return style.link ? (
                <SmartLink key={index} href={style.link} className={`${cardClass} cursor-pointer`}>
                  {inner}
                </SmartLink>
              ) : (
                <div key={index} className={cardClass}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>

        {isLight && closingText && (
          <div className="mt-10 md:mt-14">
            <p className="max-w-[850px] text-base font-normal leading-[130%] tracking-[-0.88px] text-[#494948] sm:text-[22px]">
              {renderBoldText(closingText)}
            </p>
            {ctaText && (
              <div className="mt-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-300" />
                <SmartLink
                  href={ctaLink || "#"}
                  className="gradient-navy inline-flex flex-shrink-0 items-center gap-2 rounded-[10px] px-6 py-3 text-sm font-medium text-white transition-all hover:scale-105 hover:brightness-110"
                >
                  {ctaText}
                  <ArrowUpRight className="h-4 w-4" />
                </SmartLink>
              </div>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
