import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";

interface IntegratedFeature {
  icon?: string;
  title?: string;
}

interface IntegratedFeaturesContent {
  title?: string;
  subtitle?: string;
  features?: IntegratedFeature[];
  bottomText?: string;
}

/** Integrated Features — título+subtítulo à esquerda, divisor, grade de ícones + texto final. */
export default function IntegratedFeatures({
  content,
}: {
  content: Record<string, any>;
}) {
  const c = content as IntegratedFeaturesContent;
  const features = c.features || [];

  return (
    <section className="bg-[linear-gradient(270deg,#034673_-7.67%,#041826_98.82%)]">
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Coluna esquerda */}
          <ScrollReveal className="shrink-0 lg:w-[280px]">
            <h2 className="mb-4 text-[clamp(24px,3vw,32px)] font-medium leading-[120%] tracking-[-1.28px] text-white">
              {c.title}
            </h2>
            {c.subtitle && (
              <p className="text-sm font-medium tracking-[-0.56px] text-white">
                {c.subtitle}
              </p>
            )}
          </ScrollReveal>

          {/* Divisor */}
          <div className="hidden w-px shrink-0 self-stretch bg-[linear-gradient(180deg,#FFF_0%,rgba(153,153,153,0)_100%)] lg:block" />
          <div className="h-px w-full bg-[linear-gradient(90deg,#FFF_0%,rgba(153,153,153,0)_100%)] lg:hidden" />

          {/* Coluna direita */}
          <ScrollReveal direction="right" className="flex-1">
            {features.length > 0 && (
              <div className="mb-8 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
                {features.map((feat, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className="mb-3 flex min-h-[36px] items-end justify-center">
                      <p className="text-sm font-semibold leading-[120%] tracking-[-0.56px] text-white">
                        {feat.title}
                      </p>
                    </div>
                    {feat.icon && (
                      <Image
                        src={legacyAsset(feat.icon)}
                        alt={feat.title || "Feature icon"}
                        width={80}
                        height={80}
                        className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            {c.bottomText && (
              <p className="text-center text-[clamp(16px,2vw,20px)] tracking-[-0.8px] text-white">
                {c.bottomText}
              </p>
            )}
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
