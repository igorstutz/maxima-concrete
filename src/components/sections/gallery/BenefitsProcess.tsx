import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { renderBoldText } from "./shared";

interface BenefitItem {
  title?: string;
  description?: string;
}

interface ProcessStep {
  label?: string;
  text?: string;
}

/**
 * Benefits cards grid (navy cards on white) + "The Maxima Process" numbered
 * steps overlapping a side image, with `**bold**` markers support.
 */
export default function BenefitsProcess({
  content,
}: {
  content: Record<string, any>;
}) {
  const benefitsTitle =
    content?.benefitsTitle || "Benefits of Stamped & Colored Concrete";
  const benefits: BenefitItem[] = content?.benefits || [];
  const processTitle = content?.processTitle || "The Maxima Process";
  const processIntro = content?.processIntro || "";
  const processSteps: ProcessStep[] = content?.processSteps || [];
  const processImage = legacyAsset(content?.processImage);
  const bottomQuote = content?.bottomQuote || "";

  return (
    <section className="w-full bg-white py-16 sm:py-24">
      <Container>
        {/* Benefits title */}
        <ScrollReveal>
          <h2 className="mb-6 text-left text-2xl font-semibold leading-[120%] tracking-[-1.6px] text-navy md:mb-10 md:text-[40px]">
            {benefitsTitle}
          </h2>
        </ScrollReveal>

        {/* Benefits grid */}
        {benefits.length > 0 && (
          <ScrollReveal>
            <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 md:mb-20">
              {benefits.map((benefit, index) => (
                <div key={index} className="rounded-xl bg-navy p-5 sm:p-6 md:p-8">
                  <h3 className="mb-2 text-base font-semibold leading-[120%] tracking-[-0.72px] text-white sm:mb-3 md:text-lg">
                    {benefit.title}
                  </h3>
                  <p className="text-[13px] font-normal leading-[160%] tracking-[-0.56px] text-white/85 md:text-sm">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Process */}
        <div className="relative mb-8 md:mb-12">
          {/* Desktop image — absolute right column */}
          {processImage && (
            <div className="hidden overflow-hidden rounded-xl lg:absolute lg:bottom-0 lg:right-0 lg:top-0 lg:block lg:w-[45%]">
              <Image
                src={processImage}
                alt="The Maxima Process"
                fill
                sizes="(min-width: 1024px) 520px, 100vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Title + intro */}
          <div className="relative z-10">
            <h2 className="mb-3 text-[22px] font-semibold leading-[120%] tracking-[-1.44px] text-navy md:mb-4 md:text-4xl">
              {processTitle}
            </h2>

            {processIntro && (
              <p className="mb-4 max-w-[550px] text-base font-normal leading-[120%] tracking-[-0.96px] text-navy md:mb-6 md:text-2xl">
                {renderBoldText(processIntro)}
              </p>
            )}
          </div>

          {/* Mobile image */}
          {processImage && (
            <div className="relative mb-4 block h-[220px] overflow-hidden rounded-xl sm:h-[250px] lg:hidden">
              <Image
                src={processImage}
                alt="The Maxima Process"
                fill
                sizes="100vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Steps box (overlaps the image on desktop) */}
          {processSteps.length > 0 && (
            <div className={`relative z-10 ${processImage ? "lg:w-[65%]" : "w-full"}`}>
              <div className="rounded-xl bg-navy px-4 py-4 sm:px-6 sm:py-5 md:px-8 lg:-mr-[10%]">
                <ol className="space-y-2 sm:space-y-3">
                  {processSteps.map((step, index) => (
                    <li
                      key={index}
                      className="flex gap-2 text-[13px] font-normal leading-[160%] tracking-[-0.56px] text-white/90 md:text-sm"
                    >
                      <span className="shrink-0 font-semibold text-white">
                        {index + 1}.
                      </span>
                      <span>
                        {step.label && (
                          <strong className="font-semibold text-white">
                            {step.label}:{" "}
                          </strong>
                        )}
                        {step.text}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* Bottom quote */}
          {bottomQuote && (
            <p className="mt-4 max-w-[550px] text-base font-normal leading-[120%] tracking-[-0.96px] text-navy md:mt-6 md:text-2xl">
              {renderBoldText(bottomQuote)}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
