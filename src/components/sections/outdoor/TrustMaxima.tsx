import { Check, Flame, GlassWater, Film, TrendingUp, Users, Sparkles } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";

interface TrustItem {
  label?: string;
  description?: string;
  /** Nome do ícone (ver ICONS). Sem isso, cai no check padrão. */
  icon?: string;
}

const ICONS: Record<string, typeof Check> = {
  check: Check,
  flame: Flame,
  drink: GlassWater,
  film: Film,
  value: TrendingUp,
  people: Users,
  sparkles: Sparkles,
};

/**
 * Section type: `trust-maxima` — faixa escura com título em três linhas à
 * esquerda e uma lista à direita. Aceita `backgroundImage` (com overlay) e um
 * `icon` por item; sem esses campos, renderiza a faixa preta original.
 */
export default function TrustMaxima({
  content,
}: {
  content: Record<string, any>;
}) {
  const titleLine1 = content?.titleLine1 || "Why Homeowners";
  const titleLine2 = content?.titleLine2 || "Trust Maxima";
  const titleLine3 = content?.titleLine3 || "Concrete";
  const items: TrustItem[] = content?.items || [];
  const backgroundImage = legacyAsset(content?.backgroundImage);
  const hasCards = items.some((i) => i.icon);

  return (
    <section
      className={`relative overflow-hidden py-16 sm:py-20 lg:py-28 ${
        backgroundImage ? "" : "bg-black"
      }`}
    >
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          {/* Escurece a foto o bastante para o texto branco ficar legível */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/65" />
        </>
      )}

      <Container className="relative">
        <ScrollReveal>
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:gap-16">
            {/* Esquerda — título */}
            <div className="max-w-[280px] shrink-0">
              <h2 className="text-[32px] font-medium leading-[120%] tracking-tight text-white">
                {titleLine1}
                <br />
                {titleLine2}
                <br />
                {titleLine3}
              </h2>
            </div>

            {/* Divisor */}
            <div className="hidden min-h-[200px] w-px self-stretch bg-white/20 lg:block" />
            <div className="h-px w-full bg-white/20 lg:hidden" />

            {/* Direita — lista (cards quando os itens trazem ícone) */}
            {hasCards ? (
              <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                {items.map((item, i) => {
                  const Icon = ICONS[item.icon || "check"] || Check;
                  return (
                    <div
                      key={i}
                      className="group flex items-start gap-3 rounded-xl border border-white/15 bg-white/[0.07] p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/[0.12]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 transition-colors duration-300 group-hover:bg-white/25">
                        <Icon className="h-[18px] w-[18px] text-white" />
                      </span>
                      <p className="pt-[7px] text-[14px] leading-[150%] text-white">
                        <span className="font-semibold">{item.label}</span>{" "}
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-1 flex-col gap-5">
                {items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                        <Check className="h-3.5 w-3.5 text-white" />
                      </div>
                    </div>
                    <p className="text-[14px] leading-[150%] text-white">
                      <span className="font-semibold">{item.label}</span>{" "}
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
