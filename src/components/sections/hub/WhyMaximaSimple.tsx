import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { WhyMaximaCtaButton } from "./shared";

interface WhyMaximaSimpleBenefit {
  icon?: string;
  title?: string;
  description?: string;
  items?: Array<{ label?: string; text?: string }>;
}

interface WhyMaximaSimpleContent {
  eyebrow?: string;
  title?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
  ctaText?: string;
  ctaLink?: string;
  benefits?: WhyMaximaSimpleBenefit[];
}

/** Why Maxima (simple) — fundo escuro, lista simples de benefícios com título + texto. */
export default function WhyMaximaSimple({
  content,
}: {
  content: Record<string, any>;
}) {
  const c = content as WhyMaximaSimpleContent;
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
          <ScrollReveal className="max-w-3xl">
            {c.eyebrow && (
              <p className="mb-2 text-sm font-light tracking-wide text-white/70 sm:mb-3">
                {c.eyebrow}
              </p>
            )}
            <h2 className="mb-8 whitespace-pre-line text-[clamp(28px,4vw,44px)] font-normal leading-tight text-white sm:mb-10">
              {c.title}
            </h2>

            <div className="space-y-6 sm:space-y-8">
              {benefits.map((benefit, i) => {
                const desc =
                  benefit.items?.[0]?.label ||
                  benefit.items?.[0]?.text ||
                  benefit.description ||
                  "";
                const extraText = benefit.items?.[0]?.label
                  ? benefit.items?.[0]?.text || ""
                  : "";
                return (
                  <div key={i}>
                    <h3 className="mb-2 text-[15px] font-bold text-white">
                      {benefit.title}
                    </h3>
                    {desc && (
                      <p className="whitespace-pre-line text-[13px] leading-relaxed tracking-[-0.52px] text-white/80">
                        {desc}
                      </p>
                    )}
                    {extraText && (
                      <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed tracking-[-0.52px] text-white/80">
                        {extraText}
                      </p>
                    )}
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
