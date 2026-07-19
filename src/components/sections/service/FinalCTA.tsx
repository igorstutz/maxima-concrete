import { ArrowUpRight, Phone } from "lucide-react";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmartLink } from "@/components/sections/home/SmartLink";
import { sanitizeHtml } from "./shared";

/**
 * final-cta — seção cinza clara com CTA final à esquerda e lista de serviços
 * relacionados à direita (DrivewaysPageFinalCTARenderer).
 */
export default function FinalCTA({ content }: { content: Record<string, any> }) {
  const titleLine1 = content?.titleLine1 || "";
  const titleLine2 = content?.titleLine2 || "";
  const description = content?.description || "";
  const contactText = content?.contactText ?? "";
  const ctaButtonText = content?.ctaButtonText || "";
  const ctaLink = content?.ctaLink || "#contact";
  const bottomText = content?.bottomText || "";
  const relatedTitle = content?.relatedTitle || "";
  const relatedServices: { label: string; link: string }[] = content?.relatedServices || [];

  return (
    <section className="w-full bg-[#D9D9D9] py-12 md:py-16 lg:py-24">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
          <ScrollReveal className="flex-1 lg:pr-12">
            <h2 className="mb-4 text-2xl font-medium leading-[1.2] tracking-[-0.5px] text-navy sm:text-[28px] md:mb-6 md:text-[32px]">
              {titleLine1}
              {titleLine2 && (
                <>
                  <br />
                  {titleLine2}
                </>
              )}
            </h2>
            <p className="mb-4 text-sm font-normal leading-[1.7] text-navy/80 md:mb-6 md:text-[14px]">
              {description}
            </p>
            {contactText && (
              <div className="mb-6 flex items-start gap-2 md:mb-8">
                <Phone className="mt-1 h-4 w-4 flex-shrink-0 text-navy" />
                <p
                  className="whitespace-pre-line text-sm font-normal leading-[1.7] text-navy/80"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(contactText) }}
                />
              </div>
            )}
            {ctaButtonText && (
              <SmartLink
                href={ctaLink}
                className="gradient-navy mb-3 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:opacity-90 sm:w-auto sm:px-6 md:mb-4"
              >
                {ctaButtonText}
                <ArrowUpRight className="h-4 w-4" />
              </SmartLink>
            )}
            {bottomText && (
              <p className="text-center text-[11px] font-normal text-navy/60 sm:text-left md:text-xs">
                {bottomText}
              </p>
            )}
          </ScrollReveal>

          {/* Divisores */}
          <div className="hidden w-px self-stretch bg-navy/20 lg:block" />
          <div className="my-2 h-px w-full bg-navy/20 lg:hidden" />

          <ScrollReveal direction="right" className="lg:w-[200px] lg:pl-8">
            {relatedTitle && (
              <h3 className="mb-3 text-sm font-medium text-navy md:mb-4">{relatedTitle}</h3>
            )}
            <ul className="flex flex-wrap gap-x-4 gap-y-2 lg:flex-col lg:gap-0 lg:space-y-2">
              {relatedServices.map((service, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="hidden text-navy/60 lg:inline">•</span>
                  <SmartLink
                    href={service.link}
                    className="text-sm font-normal text-navy/80 underline transition-colors hover:text-navy lg:no-underline"
                  >
                    {service.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
