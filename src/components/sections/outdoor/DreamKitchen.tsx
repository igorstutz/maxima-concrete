import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { CtaButton, sanitizeHtml } from "./shared";

interface Card {
  image?: string;
  title?: string;
  items?: string[];
}

/**
 * Section type: `dream-kitchen` — dark gradient background, title + side text
 * with divider, two photo cards with feature lists, white outlined CTA.
 */
export default function DreamKitchen({
  content,
}: {
  content: Record<string, any>;
}) {
  const title = content?.title || "Build Your Dream Outdoor Kitchen";
  const sideText = content?.sideText || "";
  const cards: Card[] = content?.cards || [];
  const ctaText = content?.ctaText || "Design My Outdoor Kitchen";
  const ctaLink = content?.ctaLink || "#contact";
  const bgGradient =
    content?.bgGradient ||
    "linear-gradient(263deg, #06253A 46.16%, #000D16 68.33%)";

  return (
    <section className="w-full py-16 lg:py-20" style={{ background: bgGradient }}>
      <Container>
        {/* Header: title + side text */}
        <ScrollReveal>
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
            <h2 className="shrink-0 text-2xl font-medium leading-[120%] tracking-tight text-white md:text-[32px]">
              {title}
            </h2>
            {sideText && (
              <div className="flex items-start gap-4">
                <div className="min-h-[60px] w-px shrink-0 bg-white/40" />
                <p
                  className="text-sm leading-[150%] text-white/90"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(sideText) }}
                />
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Cards */}
        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {cards.map((card, i) => (
            <ScrollReveal key={i} delay={i + 1}>
              <div className="relative flex min-h-[402px] flex-col justify-end overflow-hidden rounded-[14px] px-[38px] py-[35px]">
                {card.image && (
                  <Image
                    src={legacyAsset(card.image)}
                    alt={card.title || ""}
                    fill
                    sizes="(min-width: 768px) 550px, 100vw"
                    className="object-cover"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="relative z-10">
                  {card.title && (
                    <h3 className="mb-3 text-[20px] font-medium leading-[120%] tracking-tight text-white">
                      {card.title}
                    </h3>
                  )}
                  {card.items && card.items.length > 0 && (
                    <ul className="space-y-2">
                      {card.items.map((item, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 text-[14px] leading-[140%] text-white"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                          <span
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(item) }}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA — white outlined, centered */}
        {ctaText && (
          <div className="flex justify-center">
            <CtaButton
              text={ctaText}
              link={ctaLink}
              variant="outline"
              className="px-8 py-3"
            />
          </div>
        )}
      </Container>
    </section>
  );
}
