import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { WhyMaximaCtaButton, sanitizeHtml } from "./shared";

interface WhyMaximaSportsBenefit {
  icon?: string;
  title?: string;
  description?: string;
  items?: Array<{ label?: string; text?: string }>;
}

interface WhyMaximaSportsContent {
  eyebrow?: string;
  title?: string;
  description?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
  benefits?: WhyMaximaSportsBenefit[];
}

/** Why Maxima (sports) — grade de ícones em 5 colunas com subtítulo. */
export default function WhyMaximaSports({
  content,
}: {
  content: Record<string, any>;
}) {
  const c = content as WhyMaximaSportsContent;
  const overlayOpacity = c.overlayOpacity ?? 75;
  const benefits = c.benefits || [];
  const backgroundImage = legacyAsset(c.backgroundImage);

  return (
    <section className="relative overflow-hidden bg-[#1a1a1a]">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})` }}
      />

      <div className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-28">
        <Container>
          <ScrollReveal className="w-full">
            {c.eyebrow && (
              <p className="mb-2 text-sm font-light tracking-wide text-white/70 sm:mb-3">
                {c.eyebrow}
              </p>
            )}
            <h2 className="mb-4 max-w-3xl whitespace-pre-line text-[clamp(28px,4vw,44px)] font-normal leading-tight text-white sm:mb-6">
              {c.title}
            </h2>
            {c.description && (
              <p
                className="mb-6 max-w-3xl text-sm leading-relaxed tracking-[-0.56px] text-white/80 sm:mb-8"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.description) }}
              />
            )}
            {c.subtitle && (
              <h3 className="mb-6 text-base font-semibold text-white sm:mb-8">
                {c.subtitle}
              </h3>
            )}

            {/* Grade de ícones em 5 colunas */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8 lg:grid-cols-5">
              {benefits.map((benefit, i) => {
                const iconSrc =
                  benefit.icon && benefit.icon !== "/placeholder.svg"
                    ? legacyAsset(benefit.icon)
                    : null;
                return (
                  <div key={i} className="flex flex-col items-start">
                    {iconSrc && (
                      <div className="mb-3">
                        <Image
                          src={iconSrc}
                          alt={benefit.title || `Benefit ${i + 1}`}
                          width={40}
                          height={40}
                          className="h-8 w-8 object-contain brightness-0 invert sm:h-10 sm:w-10"
                        />
                      </div>
                    )}
                    <h4 className="mb-1.5 text-[13px] font-bold text-white">
                      {benefit.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-white/70">
                      {benefit.items?.[0]?.text || benefit.description || ""}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex items-center gap-4 sm:mt-14 sm:gap-6">
              <div className="h-px flex-1 bg-white/30" />
              <WhyMaximaCtaButton text={c.ctaText} link={c.ctaLink} />
            </div>
          </ScrollReveal>
        </Container>
      </div>
    </section>
  );
}
