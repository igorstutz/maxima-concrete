import { ArrowUpRight } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmartLink } from "@/components/sections/home/SmartLink";
import { legacyAsset } from "@/components/sections/home/legacy";
import { sanitizeHtml } from "./shared";

/**
 * "What Is <finish>?" — full-bleed background image with navy overlay,
 * HTML-rich description, glass cards, final text and white CTA button.
 */
export default function WhatIs({ content }: { content: Record<string, any> }) {
  const title = content?.title || "";
  const description = content?.description || "";
  const cards: { title?: string; subtitle?: string }[] = content?.cards || [];
  const finalText = content?.finalText || "";
  const backgroundImage = legacyAsset(content?.backgroundImage);
  const ctaText = content?.ctaText ?? "Contact Us";
  const ctaLink = content?.ctaLink || "#contact";

  // CMS stores this field sometimes as fraction (0.7), sometimes as percent (50/87)
  const rawOpacity = content?.overlayOpacity ?? 0.7;
  const overlayOpacity =
    typeof rawOpacity === "number" && rawOpacity > 1
      ? Math.min(rawOpacity / 100, 1)
      : rawOpacity;

  return (
    <section className="relative w-full overflow-hidden bg-navy py-16 sm:py-24">
      {/* Full-bleed background image + overlay */}
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(4, 28, 45, ${overlayOpacity})` }}
          />
        </>
      )}

      <Container className="relative z-10">
        <ScrollReveal>
          {/* Title */}
          {title && (
            <h2 className="text-2xl font-medium leading-[115%] tracking-[-1.6px] text-white sm:text-3xl md:text-[40px]">
              {title}
            </h2>
          )}

          {/* Description (allows <b>/<strong>/<br>) */}
          {description && (
            <div
              className="mt-3 max-w-[700px] whitespace-pre-line text-sm font-normal tracking-[-0.64px] text-white md:mt-4 md:text-base"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
            />
          )}
        </ScrollReveal>

        {/* Glass cards */}
        {cards.length > 0 && (
          <ScrollReveal>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:mt-10 lg:grid-cols-3">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="flex min-h-[150px] flex-col items-start justify-center gap-2.5 rounded-2xl border border-white px-6 py-7"
                  style={{
                    background:
                      "radial-gradient(186.66% 135.55% at 109.99% 9.06%, rgba(183, 209, 255, 0.00) 50.35%, rgba(183, 209, 255, 0.17) 100%), linear-gradient(222deg, rgba(183, 209, 255, 0.27) 0%, rgba(183, 209, 255, 0.00) 51.92%), rgba(29, 63, 94, 0.15)",
                    boxShadow: "0 0 20px 0 rgba(29, 63, 94, 0.30)",
                  }}
                >
                  <h3 className="text-lg font-semibold tracking-[-0.8px] text-white md:text-xl">
                    {card.title}
                  </h3>
                  {card.subtitle && (
                    <p className="text-xs font-medium leading-[150%] tracking-[-0.56px] text-white/80 md:text-sm">
                      {card.subtitle}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Final text */}
        {finalText && (
          <div
            className="mt-6 max-w-[800px] whitespace-pre-line text-sm font-medium tracking-[-0.64px] text-white md:mt-10 md:text-base"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(finalText) }}
          />
        )}

        {/* Divider + white CTA */}
        {ctaText && (
          <div className="mt-6 md:mt-10">
            <div className="flex max-w-[700px] items-center gap-4 sm:gap-6">
              <div className="h-px flex-1 bg-[linear-gradient(270deg,#999_0%,#FFF_100%)]" />
              <SmartLink
                href={ctaLink}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-[10px] border border-navy bg-white px-5 py-2.5 text-sm font-medium text-navy transition-all duration-300 hover:scale-105 hover:brightness-110 sm:px-6 sm:py-3 md:text-base"
              >
                {ctaText}
                <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5" />
              </SmartLink>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
