import { ArrowUpRight } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmartLink } from "@/components/sections/home/SmartLink";
import { SnapCarousel } from "@/components/SnapCarousel";
import { legacyAsset } from "@/components/sections/home/legacy";
import { sanitizeHtml } from "./shared";

/**
 * Layout padrão de introdução das páginas de serviço (2 colunas: texto +
 * carrossel quadrado), portado do ServiceIntroFromObject/ServiceIntroStandard
 * do site antigo. Usado pelos tipos "intro" e "paver-intro".
 */
export default function ServiceIntro({
  content: c,
  altPrefix = "Project",
}: {
  content: Record<string, any>;
  altPrefix?: string;
}) {
  const title = c?.title || c?.titleLine1 || "";
  const titleLine2 = c?.titleLine2 || "";

  // Junta parágrafos dos vários nomes de campo legados (mesma ordem do antigo)
  const paragraphs = [
    c?.paragraph1,
    c?.paragraph2,
    c?.paragraph3,
    c?.complementaryText,
    !c?.paragraph1 &&
    !c?.paragraph2 &&
    typeof c?.description === "string" &&
    !/[<>]/.test(c.description)
      ? c.description
      : null,
    c?.subtitle && !c?.paragraph1 ? c.subtitle : null,
  ].filter((p): p is string => typeof p === "string" && p.trim().length > 0);

  const descriptionHtml =
    paragraphs.length === 0 && typeof c?.description === "string"
      ? c.description
      : undefined;

  // Junta imagens de qualquer campo legado, deduplicando na ordem
  const images = Array.from(
    new Set(
      [
        ...(Array.isArray(c?.images) ? c.images : []),
        c?.imageTopRight,
        c?.imageLarge,
        c?.mainImage,
        c?.image,
        c?.imageHorizontal,
        c?.imageVertical,
        c?.backgroundImage,
      ]
        .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
        .map((s) => legacyAsset(s)),
    ),
  );

  const ctaText = c?.ctaText || "";
  const ctaLink = c?.ctaLink || "#contact";

  return (
    <section className="w-full bg-white py-12 md:py-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Coluna esquerda — título, texto e CTA */}
          <ScrollReveal className="order-2 flex flex-col justify-center lg:order-1">
            {title && (
              <h2 className="mb-5 text-2xl font-medium leading-[120%] tracking-[-1.28px] text-[#494948] md:mb-6 md:text-[32px] lg:text-[36px]">
                {title}
                {titleLine2 && (
                  <>
                    <br />
                    {titleLine2}
                  </>
                )}
              </h2>
            )}

            {paragraphs.length > 0 ? (
              <div className="mb-6 flex flex-col gap-4 md:mb-8 md:gap-5">
                {paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="whitespace-pre-line text-sm font-medium leading-normal text-[#494948] md:text-[14px]"
                  >
                    {p}
                  </p>
                ))}
              </div>
            ) : descriptionHtml ? (
              <div
                className="mb-6 space-y-4 text-sm font-normal leading-[140%] tracking-[-0.56px] text-[#494948] md:mb-8 md:text-[14px]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(descriptionHtml) }}
              />
            ) : null}

            {ctaText && (
              <div className="flex justify-start">
                <SmartLink
                  href={ctaLink}
                  className="gradient-navy inline-flex items-center gap-2 rounded-[10px] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:opacity-90 md:px-6 md:py-3 md:text-base"
                >
                  {ctaText}
                  <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5" />
                </SmartLink>
              </div>
            )}
          </ScrollReveal>

          {/* Coluna direita — carrossel quadrado */}
          <ScrollReveal direction="right" className="order-1 flex justify-center lg:order-2 lg:justify-end">
            {images.length > 1 ? (
              <SnapCarousel
                className="w-full max-w-[500px] overflow-hidden rounded-2xl"
                controls="overlay-sides"
              >
                {images.map((src, i) => (
                  <div key={i} className="relative aspect-square w-full shrink-0 snap-start">
                    <Image
                      src={src}
                      alt={`${altPrefix} ${i + 1}`}
                      fill
                      sizes="(min-width: 1024px) 500px, 100vw"
                      className="object-cover"
                      priority={i === 0}
                    />
                  </div>
                ))}
              </SnapCarousel>
            ) : images.length === 1 ? (
              <div className="relative aspect-square w-full max-w-[500px] overflow-hidden rounded-2xl">
                <Image
                  src={images[0]}
                  alt={`${altPrefix} 1`}
                  fill
                  sizes="(min-width: 1024px) 500px, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
