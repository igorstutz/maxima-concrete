import { Check } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { WhyMaximaCtaButton, sanitizeHtml } from "./shared";

interface WhyMaximaDetailedBenefit {
  icon?: string;
  title?: string;
  description?: string;
  checkItems?: string[];
}

interface WhyMaximaDetailedContent {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
  benefits?: WhyMaximaDetailedBenefit[];
}

/** Why Maxima (detailed) — títulos em destaque, descrições ricas, grades de checkmarks em 3 colunas. */
export default function WhyMaximaDetailed({
  content,
}: {
  content: Record<string, any>;
}) {
  const c = content as WhyMaximaDetailedContent;
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
          <ScrollReveal>
            {c.eyebrow && (
              <p className="mb-2 text-sm font-light tracking-wide text-white/70 sm:mb-3">
                {c.eyebrow}
              </p>
            )}
            <h2 className="mb-8 whitespace-pre-line text-[clamp(28px,4vw,44px)] font-normal leading-tight text-white sm:mb-10">
              {c.title}
            </h2>

            <div className="space-y-10 sm:space-y-12">
              {benefits.map((benefit, i) => {
                const checkItems = benefit.checkItems || [];
                return (
                  <div key={i}>
                    <h3 className="mb-3 text-[clamp(18px,2.5vw,24px)] font-bold text-white">
                      {benefit.title}
                    </h3>
                    {benefit.description && (
                      <p
                        className="mb-5 max-w-3xl text-sm leading-relaxed tracking-[-0.56px] text-white/80"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(benefit.description),
                        }}
                      />
                    )}
                    {checkItems.length > 0 && (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                        {checkItems.map((item, j) => (
                          <div key={j} className="flex items-start gap-3">
                            <div className="mt-0.5 shrink-0">
                              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 sm:h-9 sm:w-9">
                                {benefit.icon ? (
                                  <Image
                                    src={legacyAsset(benefit.icon)}
                                    alt=""
                                    width={24}
                                    height={24}
                                    className="h-5 w-5 object-contain sm:h-6 sm:w-6"
                                  />
                                ) : (
                                  <Check className="h-4 w-4 text-white/80 sm:h-5 sm:w-5" />
                                )}
                              </div>
                            </div>
                            <span className="text-[13px] font-semibold leading-snug text-white/90">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
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
