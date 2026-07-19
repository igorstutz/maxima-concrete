import { ArrowUpRight } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmartLink } from "@/components/sections/home/SmartLink";
import { legacyAsset } from "@/components/sections/home/legacy";
import { sanitizeHtml } from "./sanitize";

interface CommercialServicesContent {
  backgroundImage?: string;
  title?: string;
  subtitle?: string;
  leftItems?: string[];
  rightItems?: string[];
  closing?: string;
  ctaLabel?: string;
  ctaLink?: string;
}

/**
 * type: "commercial-services" — painel escuro full-bleed com imagem de fundo,
 * duas colunas de bullets e CTA branco com linha divisória.
 */
export default function Services({ content }: { content: Record<string, any> }) {
  const c = content as CommercialServicesContent;
  const backgroundImage = legacyAsset(c.backgroundImage);
  const title = c.title || "Commercial Concrete Services";
  const leftItems = c.leftItems ?? [];
  const rightItems = c.rightItems ?? [];
  const ctaLabel = c.ctaLabel || "Contact Us";
  const ctaLink = c.ctaLink || "#contact";

  const bulletClass =
    "text-[18px] font-semibold leading-[180%] tracking-[-0.72px] text-[#F3F3F3]";

  return (
    <section className="relative overflow-hidden">
      {/* Fundo: navy + imagem + véu escuro */}
      <div className="absolute inset-0 bg-navy">
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-60"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative py-16 md:py-24">
        <Container>
          <ScrollReveal>
            <h2 className="text-[clamp(28px,4vw,40px)] font-medium leading-[115%] tracking-[-1.6px] text-white">
              {title}
            </h2>

            {c.subtitle && (
              <p
                className="mt-4 w-full text-[14px] font-medium tracking-[-0.56px] text-white lg:max-w-[446px]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.subtitle) }}
              />
            )}

            {(leftItems.length > 0 || rightItems.length > 0) && (
              <div className="mt-8 grid max-w-full grid-cols-1 gap-x-12 gap-y-2 md:grid-cols-2 lg:max-w-[800px]">
                <ul className="list-disc space-y-1 pl-6 lg:max-w-[438px]">
                  {leftItems.map((item, idx) => (
                    <li key={idx} className={bulletClass}>
                      {item}
                    </li>
                  ))}
                </ul>
                <ul className="list-disc space-y-1 pl-6 lg:max-w-[325px]">
                  {rightItems.map((item, idx) => (
                    <li key={idx} className={bulletClass}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {c.closing && (
              <p
                className="mt-10 w-full text-[14px] font-medium leading-[150%] tracking-[-0.56px] text-white lg:max-w-[706px]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.closing) }}
              />
            )}

            {/* Linha divisória + CTA */}
            <div className="mt-10 flex w-full flex-row items-center justify-end gap-4 md:gap-[42px]">
              <div className="h-px flex-1 bg-white/80" />
              <SmartLink
                href={ctaLink}
                className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-white px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-white/90 md:px-6 md:py-3 md:text-base"
              >
                {ctaLabel}
                <ArrowUpRight className="h-4 w-4" />
              </SmartLink>
            </div>
          </ScrollReveal>
        </Container>
      </div>
    </section>
  );
}
