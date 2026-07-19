import { ShieldCheck, CloudSnow, HardHat, TrendingUp } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { HubCtaButton } from "./shared";

interface HubDurabilityCard {
  icon?: string;
  title?: string;
  description?: string;
}

interface HubDurabilityContent {
  title?: string;
  cards?: HubDurabilityCard[];
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

// Ícones de fallback (na ordem dos cards) quando não há ícone customizado no CMS.
const FALLBACK_ICONS = [ShieldCheck, CloudSnow, HardHat, TrendingUp];

/** Hub Durability — imagem de fundo escura, título centralizado, cards 2x2, CTA. */
export default function HubDurability({ content }: { content: Record<string, any> }) {
  const c = content as HubDurabilityContent;
  const cards = c.cards || [];
  const backgroundImage = legacyAsset(c.backgroundImage);

  return (
    <section className="relative overflow-hidden bg-[#141414]">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 py-14 md:py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <ScrollReveal>
              <h2 className="mb-10 text-center text-3xl font-light tracking-[-1px] text-white/90 md:text-4xl">
                {c.title}
              </h2>
            </ScrollReveal>
            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {cards.map((card, i) => {
                const FallbackIcon = FALLBACK_ICONS[i % FALLBACK_ICONS.length];
                return (
                  <ScrollReveal
                    key={i}
                    delay={(i % 2) + 1}
                    className="rounded-xl border border-white/25 bg-white/[0.03] p-7"
                  >
                    {card.icon ? (
                      <Image
                        src={legacyAsset(card.icon)}
                        alt=""
                        width={40}
                        height={40}
                        className="mb-5 h-10 w-10 object-contain"
                      />
                    ) : (
                      <FallbackIcon
                        className="mb-5 h-9 w-9 text-white"
                        strokeWidth={1.2}
                      />
                    )}
                    <h3 className="mb-4 whitespace-pre-line text-xl font-medium leading-snug text-white md:text-2xl">
                      {card.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/75">
                      {card.description}
                    </p>
                  </ScrollReveal>
                );
              })}
            </div>
            <div className="flex justify-center">
              <HubCtaButton text={c.ctaText} link={c.ctaLink} variant="light" />
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
