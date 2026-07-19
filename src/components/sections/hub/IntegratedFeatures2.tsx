import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";

interface IntegratedFeatures2Card {
  image?: string;
  title?: string;
  description?: string;
}

interface IntegratedFeatures2Content {
  title?: string;
  subtitle?: string;
  cards?: IntegratedFeatures2Card[];
  backgroundColor?: string;
}

/** Integrated Features 2 — título, subtítulo, cards em 3 colunas com imagem + descrição. */
export default function IntegratedFeatures2({
  content,
}: {
  content: Record<string, any>;
}) {
  const c = content as IntegratedFeatures2Content;
  const cards = c.cards || [];

  return (
    <section style={{ background: c.backgroundColor || "#092F4A" }}>
      <Container className="py-16 sm:py-20 lg:py-24">
        <ScrollReveal>
          {c.title && (
            <h2 className="mb-3 text-[clamp(24px,3vw,32px)] font-medium leading-[120%] tracking-[-1.28px] text-white">
              {c.title}
            </h2>
          )}
          {c.subtitle && (
            <p className="mb-10 text-base leading-[120%] tracking-[-0.64px] text-white/90">
              {c.subtitle}
            </p>
          )}
        </ScrollReveal>
        {cards.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {cards.map((card, i) => (
              <ScrollReveal key={i} delay={i + 1} className="flex flex-col gap-3">
                <p className="text-[15px] font-medium leading-[120%] tracking-[-0.6px] text-white">
                  {card.title}
                </p>
                {card.image && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                    <Image
                      src={legacyAsset(card.image)}
                      alt={card.title || "Feature"}
                      fill
                      sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                {card.description && (
                  <p className="text-base leading-[120%] tracking-[-0.64px] text-white/90">
                    {card.description}
                  </p>
                )}
              </ScrollReveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
