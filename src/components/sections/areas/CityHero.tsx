import {
  ArrowRight,
  Award,
  Check,
  Clock,
  Hammer,
  Handshake,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";

interface CityHeroCard {
  icon?: string;
  title?: string;
  subtitle?: string;
}

const CARD_ICONS: Record<string, LucideIcon> = {
  handshake: Handshake,
  "map-pin": MapPin,
  tag: Tag,
  award: Award,
  sparkles: Sparkles,
  "shield-check": ShieldCheck,
  hammer: Hammer,
  users: Users,
  wrench: Wrench,
  star: Star,
  check: Check,
  phone: Phone,
  clock: Clock,
};

/** Hero das subpáginas de cidade (Areas We Serve) — type "city-hero". */
export default function CityHero({ content }: { content: Record<string, any> }) {
  const title: string = content?.title || "";
  const cityName: string = content?.cityName || "";
  const subtitle: string = content?.subtitle || "";
  const description: string = content?.description || "";
  const cards: CityHeroCard[] = Array.isArray(content?.cards) ? content.cards : [];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#02101C] via-navy to-[#0A3A5E]">
      <Container className="pb-16 pt-28 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
          {/* Esquerda — bloco de texto */}
          <ScrollReveal className="flex flex-col gap-6">
            {title && (
              <h1 className="whitespace-pre-line text-3xl font-semibold leading-tight text-white md:text-4xl lg:text-5xl">
                {title}
              </h1>
            )}
            {cityName && (
              <div className="inline-flex">
                <span className="inline-flex items-center rounded-[15px] border-2 border-white px-6 py-3 text-lg font-semibold text-white md:text-xl">
                  {cityName}
                </span>
              </div>
            )}
            {subtitle && (
              <p className="whitespace-pre-line text-base font-semibold text-white md:text-lg">
                {subtitle}
              </p>
            )}
            {description && (
              <p className="max-w-xl whitespace-pre-line text-sm leading-relaxed text-white/85 md:text-base">
                {description}
              </p>
            )}
            <div>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-navy shadow-lg transition-all hover:bg-white/90 md:text-base"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </ScrollReveal>

          {/* Direita — cards de destaque */}
          {cards.length > 0 && (
            <ScrollReveal direction="right" className="flex w-full flex-col gap-4">
              {cards.map((card, i) => {
                const Icon = CARD_ICONS[card.icon || "award"] || Award;
                return (
                  <div
                    key={i}
                    className="rounded-[7px] border border-ocean p-5 shadow-[0_4px_20px_0_rgba(0,0,0,0.25)]"
                    style={{
                      background:
                        "linear-gradient(270deg, #124C73 0%, #0A324D 30.29%, #041C2D 63.94%)",
                    }}
                  >
                    <Icon className="mb-3 h-7 w-7 text-white/80" />
                    {card.title && (
                      <h3 className="text-lg font-semibold leading-tight text-white">
                        {card.title}
                      </h3>
                    )}
                    {card.subtitle && (
                      <p className="mt-1 text-sm text-white/70">{card.subtitle}</p>
                    )}
                  </div>
                );
              })}
            </ScrollReveal>
          )}
        </div>
      </Container>
    </section>
  );
}
