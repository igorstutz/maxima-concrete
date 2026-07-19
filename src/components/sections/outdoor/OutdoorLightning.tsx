import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { CtaButton, sanitizeHtml } from "./shared";

interface Step {
  number?: string;
  title?: string;
  description?: string;
  highlighted?: boolean;
}

const StepRow = ({ step, mobile }: { step: Step; mobile?: boolean }) => (
  <div
    className={`flex items-start ${mobile ? "gap-3 px-4 py-4" : "gap-4 px-5 py-4"} ${
      step.highlighted
        ? mobile
          ? "rounded-[30px] bg-[#1D3F5E]"
          : "rounded-[40px] bg-[#1D3F5E]"
        : ""
    }`}
  >
    <span
      className={`shrink-0 font-bold ${
        mobile ? "text-[36px] leading-[48px]" : "w-[54px] text-[50px] leading-[60px]"
      } ${step.highlighted ? "text-white" : "text-[#1D3F5E]"}`}
    >
      {step.number}
    </span>
    <div className={`flex ${mobile ? "min-h-[48px]" : "min-h-[60px]"} flex-col justify-center`}>
      <span
        className={`font-semibold leading-[27px] ${mobile ? "text-[14px]" : "text-[16px]"} ${
          step.highlighted ? "text-white" : "text-[#494948]"
        }`}
      >
        {step.title}
      </span>
      <span
        className={`font-normal leading-[140%] ${mobile ? "text-[13px]" : "text-[14px]"} ${
          step.highlighted ? "text-white/80" : "text-[#767676]"
        }`}
      >
        {step.description}
      </span>
    </div>
  </div>
);

/**
 * Section type: `outdoor-lightning` — two columns: text + image on the left,
 * secondary text + numbered process steps + CTA on the right.
 */
export default function OutdoorLightning({
  content,
}: {
  content: Record<string, any>;
}) {
  const title = content?.title || "";
  const description = content?.description || "";
  const image = legacyAsset(content?.image);
  const rightTitle = content?.rightTitle || "";
  const rightDescription = content?.rightDescription || "";
  const steps: Step[] = content?.steps || [];
  const ctaText = content?.ctaText || "";
  const ctaLink = content?.ctaLink || "#contact";

  return (
    <section className="bg-white">
      {/* Mobile layout */}
      <div className="lg:hidden">
        <Container className="space-y-8 py-10">
          <div className="space-y-4">
            <h2 className="text-[24px] font-medium leading-[120%] tracking-tight text-[#494948]">
              {title}
            </h2>
            {description && (
              <p
                className="text-[13px] font-normal leading-[120%] text-[#494948]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
              />
            )}
          </div>
          {image && (
            <div className="relative aspect-[855/397] w-full overflow-hidden rounded-[16px]">
              <Image
                src={image}
                alt={title}
                fill
                sizes="100vw"
                className="object-cover object-bottom"
                loading="lazy"
              />
            </div>
          )}
          <div className="space-y-4">
            {rightTitle && (
              <h3 className="text-[24px] font-medium leading-[120%] tracking-tight text-[#494948]">
                {rightTitle}
              </h3>
            )}
            {rightDescription && (
              <p className="text-[13px] font-normal leading-[120%] text-[#494948]">
                {rightDescription}
              </p>
            )}
            <div className="space-y-3">
              {steps.map((step, i) => (
                <StepRow key={i} step={step} mobile />
              ))}
            </div>
            <CtaButton text={ctaText} link={ctaLink} className="self-start px-6 py-3" />
          </div>
        </Container>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:block">
        <Container className="py-16">
          <div className="flex gap-12">
            {/* Left column */}
            <ScrollReveal direction="left" className="flex w-1/2 flex-col space-y-6">
              <h2 className="max-w-[347px] text-[32px] font-medium leading-[120%] tracking-tight text-[#494948]">
                {title}
              </h2>
              {description && (
                <p
                  className="text-[14px] font-normal leading-[120%] text-[#494948]"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
                />
              )}
              {image && (
                <div className="relative aspect-[855/397] w-full overflow-hidden rounded-[24px]">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(min-width: 1024px) 550px, 100vw"
                    className="object-cover object-bottom"
                    loading="lazy"
                  />
                </div>
              )}
            </ScrollReveal>

            {/* Right column */}
            <ScrollReveal direction="right" className="flex w-1/2 flex-col space-y-5">
              {rightTitle && (
                <h3 className="max-w-[347px] text-[32px] font-medium leading-[120%] tracking-tight text-[#494948]">
                  {rightTitle}
                </h3>
              )}
              {rightDescription && (
                <p className="text-[14px] font-normal leading-[120%] text-[#494948]">
                  {rightDescription}
                </p>
              )}
              <div className="space-y-3 pt-2">
                {steps.map((step, i) => (
                  <StepRow key={i} step={step} />
                ))}
              </div>
              <CtaButton
                text={ctaText}
                link={ctaLink}
                className="mt-2 self-start px-6 py-3"
              />
            </ScrollReveal>
          </div>
        </Container>
      </div>
    </section>
  );
}
