import { ArrowUpRight } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmartLink } from "@/components/sections/home/SmartLink";
import { legacyAsset, internalLink } from "@/components/sections/home/legacy";
import { sanitizeHtml } from "./shared";

interface WhereToUseCard {
  image?: string;
  title?: string;
  description?: string;
  link?: string;
}

/**
 * "Where to Use <finish>" — white section with 4 image cards (title/description
 * overlaid at the bottom), final HTML text and gradient CTA.
 */
export default function WhereToUse({
  content,
}: {
  content: Record<string, any>;
}) {
  const title = content?.title || "";
  const subtitle = content?.subtitle || "";
  const cards: WhereToUseCard[] = content?.cards || [];
  const finalText = content?.finalText || "";
  const ctaText = content?.ctaText || "";
  const ctaLink = content?.ctaLink || "#contact";

  const cardInner = (card: WhereToUseCard) => (
    <>
      {card.image ? (
        <Image
          src={legacyAsset(card.image)}
          alt={card.title || ""}
          fill
          sizes="(min-width: 1024px) 280px, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-[#2A2A2A]" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.00)_0%,rgba(0,0,0,0.90)_73.71%)]" />
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
        <h3 className="mb-0.5 text-sm font-semibold leading-[130%] text-white sm:mb-1 sm:text-lg">
          {card.title}
        </h3>
        {card.description && (
          <p className="text-[11px] leading-[150%] text-white/80 sm:text-sm">
            {card.description}
          </p>
        )}
      </div>
    </>
  );

  return (
    <section className="relative w-full bg-white py-16 sm:py-24">
      <Container>
        <ScrollReveal>
          {title && (
            <h2 className="mb-2 text-[28px] font-medium leading-[120%] tracking-[-1.44px] text-ocean sm:text-[32px] md:mb-3 md:text-[36px]">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mb-6 text-[20px] font-normal leading-[130%] tracking-[-1.04px] text-[#494948] md:mb-8 md:text-[26px]">
              {subtitle}
            </p>
          )}
        </ScrollReveal>

        {cards.length > 0 && (
          <ScrollReveal>
            <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 md:mb-10 lg:grid-cols-4">
              {cards.map((card, index) => {
                const cardClass =
                  "group relative block h-[clamp(220px,40vw,340px)] min-h-[220px] overflow-hidden rounded-xl";
                if (card.link) {
                  return (
                    <SmartLink
                      key={index}
                      href={internalLink(card.link)}
                      className={`${cardClass} cursor-pointer`}
                    >
                      {cardInner(card)}
                    </SmartLink>
                  );
                }
                return (
                  <div key={index} className={cardClass}>
                    {cardInner(card)}
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        )}

        {(finalText || ctaText) && (
          <div className="flex flex-col gap-4">
            {finalText && (
              <p
                className="max-w-[850px] whitespace-pre-line text-[18px] font-normal leading-[130%] tracking-[-0.88px] text-[#494948] md:text-[22px]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(finalText) }}
              />
            )}
            {ctaText && (
              <div className="flex items-center gap-4">
                <div className="hidden h-px flex-1 bg-[linear-gradient(270deg,#999_0%,#FFF_100%)] md:block" />
                <SmartLink
                  href={ctaLink}
                  className="gradient-navy inline-flex items-center gap-2 whitespace-nowrap rounded-[10px] px-5 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110"
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
