import { ArrowUpRight, Phone } from "lucide-react";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmartLink } from "@/components/sections/home/SmartLink";
import { sanitizeHtml } from "./sanitize";

interface ReadyToBuildContent {
  title?: string;
  subtitle?: string;
  contactTitle?: string;
  contactText?: string;
  ctaText?: string;
  ctaLink?: string;
}

/** type: "ready-to-build" — CTA escuro em duas colunas com contato por telefone. */
export default function ReadyToBuild({ content }: { content: Record<string, any> }) {
  const c = content as ReadyToBuildContent;
  const title = c.title || "Ready to Build\nYour Vision?";
  const ctaText = c.ctaText ?? "Contact us";
  const ctaLink = c.ctaLink || "#contact";

  return (
    <section className="bg-black py-16 sm:py-24">
      <Container>
        <ScrollReveal>
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:items-center md:gap-0">
            {/* Esquerda – Título + subtítulo */}
            <div className="md:pr-10 lg:pr-14">
              <h2 className="mb-5 whitespace-pre-line text-3xl font-semibold leading-[115%] tracking-[-1.6px] text-white md:mb-6 md:text-[40px]">
                {title}
              </h2>
              {c.subtitle && (
                <p
                  className="text-sm font-normal leading-[150%] tracking-[-0.45px] text-[#B5B5B5] md:text-[15px]"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.subtitle) }}
                />
              )}
            </div>

            {/* Direita – Contato + CTA, com divisória à esquerda no desktop */}
            <div className="md:border-l md:border-white/15 md:pl-10 lg:pl-14">
              {c.contactTitle && (
                <p className="mb-3 flex items-start gap-2 text-sm font-semibold leading-[150%] tracking-[-0.45px] text-white md:text-[15px]">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
                  <span
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.contactTitle) }}
                  />
                </p>
              )}
              {c.contactText && (
                <p
                  className="mb-6 text-sm font-normal leading-[150%] tracking-[-0.45px] text-[#B5B5B5] md:text-[15px]"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.contactText) }}
                />
              )}
              {ctaText && (
                <SmartLink
                  href={ctaLink}
                  className="gradient-navy inline-flex items-center gap-2 rounded-[10px] px-5 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110"
                >
                  {ctaText}
                  <ArrowUpRight className="h-4 w-4" />
                </SmartLink>
              )}
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
