import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmartLink } from "@/components/sections/home/SmartLink";
import { HubCtaButton } from "./shared";

interface HubFinalCTAService {
  label?: string;
  link?: string;
}

interface HubFinalCTAContent {
  title?: string;
  paragraph1?: string;
  paragraph2?: string;
  ctaText?: string;
  ctaLink?: string;
  badgesText?: string;
  relatedTitle?: string;
  services?: HubFinalCTAService[];
}

/** Hub Final CTA — seção clara, copy de fechamento + CTA à esquerda, serviços relacionados à direita. */
export default function HubFinalCTA({ content }: { content: Record<string, any> }) {
  const c = content as HubFinalCTAContent;
  const relatedTitle = c.relatedTitle || "Related Services";
  const services = c.services || [];

  return (
    <section className="bg-[#E3E3E3]">
      <Container className="py-14 md:py-20">
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:gap-14">
          <ScrollReveal className="max-w-xl flex-1">
            <h2 className="mb-6 whitespace-pre-line text-3xl font-medium leading-tight tracking-[-1px] text-navy md:text-4xl">
              {c.title}
            </h2>
            {c.paragraph1 && (
              <p className="mb-5 whitespace-pre-line text-sm leading-relaxed text-[#3A4A56] md:text-base">
                {c.paragraph1}
              </p>
            )}
            {c.paragraph2 && (
              <p className="mb-8 whitespace-pre-line text-sm leading-relaxed text-[#3A4A56] md:text-base">
                {c.paragraph2}
              </p>
            )}
            <HubCtaButton text={c.ctaText} link={c.ctaLink} variant="dark" />
            {c.badgesText && (
              <p className="mt-6 text-xs tracking-wide text-[#6B7780] md:text-sm">
                {c.badgesText}
              </p>
            )}
          </ScrollReveal>

          <div className="hidden self-stretch border-l border-navy/60 lg:block" />

          {services.length > 0 && (
            <ScrollReveal direction="right" className="shrink-0 lg:w-64 lg:pt-16">
              <h3 className="mb-4 text-base font-semibold text-navy">
                {relatedTitle}
              </h3>
              <ul className="list-inside list-disc space-y-2">
                {services.map((service, i) => (
                  <li key={i} className="text-sm text-[#3A4A56] md:text-base">
                    {service.link ? (
                      <SmartLink
                        href={service.link}
                        className="hover:text-ocean hover:underline"
                      >
                        {service.label}
                      </SmartLink>
                    ) : (
                      service.label
                    )}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          )}
        </div>
      </Container>
    </section>
  );
}
