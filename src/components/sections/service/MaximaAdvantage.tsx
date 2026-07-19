import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { sanitizeHtml } from "./shared";

/**
 * maxima-advantage — seção quase preta com título/descrição à esquerda e grade
 * de diferenciais + pílula de texto à direita (MaximaAdvantageRenderer).
 */
export default function MaximaAdvantage({ content }: { content: Record<string, any> }) {
  const title = content?.title || "";
  const description = content?.description || "";
  const rightTitle = content?.rightTitle || "";
  const benefits: { boldText?: string; text?: string }[] = content?.benefits || [];
  const pillText = content?.pillText || "";

  return (
    <section className="w-full bg-[#0A0A0A] py-12 md:py-20 lg:py-24">
      <Container>
        <ScrollReveal>
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-0">
            {/* Lado esquerdo */}
            <div className="lg:w-[42%] lg:border-r lg:border-white/20 lg:pr-10">
              {title && (
                <h2 className="mb-4 text-[28px] font-medium leading-[120%] tracking-[-1.28px] text-white md:mb-6 md:text-[32px]">
                  {title}
                </h2>
              )}
              {description && (
                <p
                  className="text-[13px] font-medium leading-normal tracking-[-0.56px] text-white md:text-[14px]"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
                />
              )}
            </div>

            {/* Lado direito */}
            <div className="lg:w-[58%] lg:pl-10">
              {rightTitle && (
                <h3 className="mb-6 text-[20px] font-medium leading-normal tracking-[0.48px] text-white md:mb-8 md:text-[24px]">
                  {rightTitle}
                </h3>
              )}

              {benefits.length > 0 && (
                <div className="mb-6 grid grid-cols-2 gap-4 md:mb-8 md:gap-6 lg:grid-cols-4">
                  {benefits.map((benefit, index) => (
                    <div key={index}>
                      <p className="text-[13px] leading-[150%] text-white md:text-[14px]">
                        <strong>{benefit.boldText}</strong>{" "}
                        <span className="text-white/70">{benefit.text}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {pillText && (
                <div className="rounded-full border border-white/25 px-6 py-3 text-center md:px-8 md:py-4">
                  <p
                    className="text-[13px] font-normal leading-[130%] tracking-[-0.56px] text-white/80 md:text-[14px]"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(pillText) }}
                  />
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
