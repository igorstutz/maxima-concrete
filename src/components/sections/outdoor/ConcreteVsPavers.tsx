import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { sanitizeHtml } from "./shared";

interface Card {
  image?: string;
  title?: string;
  description?: string;
}

/**
 * Section type: `concrete-vs-pavers` — two photo cards side by side with
 * overlay text over a solid dark background, plus a bottom paragraph.
 */
export default function ConcreteVsPavers({
  content,
}: {
  content: Record<string, any>;
}) {
  const title = content?.title || "";
  const cards: Card[] = content?.cards || [];
  const bottomText = content?.bottomText || "";
  const backgroundColor = content?.backgroundColor || "#494948";

  return (
    <section className="w-full" style={{ background: backgroundColor }}>
      <Container className="py-16 sm:py-20 lg:py-24">
        {title && (
          <ScrollReveal>
            <h2
              className="mb-10 text-center text-[clamp(24px,3vw,32px)] font-medium leading-[120%] tracking-tight text-white lg:text-left"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(title) }}
            />
          </ScrollReveal>
        )}

        {cards.length > 0 && (
          <div className="flex flex-col justify-center gap-6 sm:flex-row sm:gap-8 lg:justify-start">
            {cards.map((card, i) => (
              <ScrollReveal
                key={i}
                delay={i + 1}
                className="w-full max-w-[434px]"
              >
                <div className="relative flex h-[402px] flex-col justify-end overflow-hidden rounded-xl px-[38px] py-[35px]">
                  {card.image && (
                    <Image
                      src={legacyAsset(card.image)}
                      alt={card.title || "Option"}
                      fill
                      sizes="(min-width: 640px) 434px, 100vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="relative z-10 flex flex-col gap-[10px]">
                    {card.title && (
                      <h3 className="text-[20px] font-medium leading-[120%] tracking-tight text-white">
                        {card.title}
                      </h3>
                    )}
                    {card.description && (
                      <p
                        className="text-[14px] font-normal leading-[140%] text-white"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(card.description),
                        }}
                      />
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {bottomText && (
          <p
            className="mx-auto mt-12 max-w-3xl text-center text-[clamp(14px,2vw,16px)] font-normal leading-[150%] text-white/85 lg:mx-0 lg:text-left"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(bottomText) }}
          />
        )}
      </Container>
    </section>
  );
}
