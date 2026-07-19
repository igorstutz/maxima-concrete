import { ArrowUpRight } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmartLink } from "@/components/sections/home/SmartLink";
import { legacyAsset } from "@/components/sections/home/legacy";
import { sanitizeHtml } from "./sanitize";

interface BuildingCentralContent {
  title?: string;
  paragraph1?: string;
  paragraph2?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
}

/** type: "building-central" — texto + CTA à esquerda, imagem à direita, fundo branco. */
export default function BuildingCentral({ content }: { content: Record<string, any> }) {
  const c = content as BuildingCentralContent;
  const title = c.title || "Building Central Ohio,\nOne Project at a Time";
  const image = legacyAsset(c.image);
  const ctaText = c.ctaText ?? "Contact Us";
  const ctaLink = c.ctaLink || "#contact";

  return (
    <section className="bg-white py-16 sm:py-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Esquerda – Texto + CTA */}
          <ScrollReveal className="order-2 flex flex-col justify-center lg:order-1">
            <h2 className="mb-5 whitespace-pre-line text-2xl font-medium leading-[120%] tracking-[-1.28px] text-[#494948] md:mb-6 md:text-[32px]">
              {title}
            </h2>
            {c.paragraph1 && (
              <p
                className="mb-4 whitespace-pre-line text-sm font-normal leading-[150%] tracking-[-0.45px] text-[#494948] md:text-[15px]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.paragraph1) }}
              />
            )}
            {c.paragraph2 && (
              <p
                className="mb-6 whitespace-pre-line text-sm font-normal leading-[150%] tracking-[-0.45px] text-[#494948] md:text-[15px]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.paragraph2) }}
              />
            )}
            {ctaText && (
              <div>
                <SmartLink
                  href={ctaLink}
                  className="gradient-navy inline-flex items-center gap-2 rounded-[10px] px-5 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110"
                >
                  {ctaText}
                  <ArrowUpRight className="h-4 w-4" />
                </SmartLink>
              </div>
            )}
          </ScrollReveal>

          {/* Direita – Imagem */}
          <ScrollReveal
            className="order-1 flex justify-center lg:order-2 lg:justify-end"
            direction="left"
          >
            {image ? (
              <Image
                src={image}
                alt={title}
                width={550}
                height={420}
                sizes="(min-width: 1024px) 550px, 100vw"
                className="h-[260px] w-full rounded-xl object-cover md:h-[400px] md:rounded-2xl lg:h-[420px] lg:w-[550px]"
                loading="lazy"
              />
            ) : (
              <div className="h-[260px] w-full rounded-xl bg-gray-100 md:h-[400px] md:rounded-2xl lg:h-[420px] lg:w-[550px]" />
            )}
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
