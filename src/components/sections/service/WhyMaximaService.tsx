import { ArrowRight, Package } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmartLink } from "@/components/sections/home/SmartLink";
import { legacyAsset } from "@/components/sections/home/legacy";
import { sanitizeHtml } from "./shared";

/**
 * why-maxima-service — seção escura com imagem de fundo e overlay
 * (DrivewaysPageWhyMaximaRenderer). Dois layouts: grade de benefícios com
 * ícones ou lista numerada, conforme presença de ícones.
 */
export default function WhyMaximaService({ content }: { content: Record<string, any> }) {
  const eyebrow = content?.eyebrow || "";
  const title = content?.title || "";
  const description = content?.description || "";
  const ctaText = content?.ctaText || "";
  const ctaLink = content?.ctaLink || "#contact";
  const backgroundImage = legacyAsset(content?.backgroundImage);
  const overlayOpacity = content?.overlayOpacity ?? 75;

  const benefits: any[] = content?.benefits || [];
  const hasIcons = benefits.some(
    (b: any) =>
      (b.icon && b.icon !== "/placeholder.svg") ||
      (b.customIcon && b.customIcon !== "/placeholder.svg"),
  );

  return (
    <section className="relative w-full">
      {/* Imagem de fundo + overlay full-bleed */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})` }}
        />
      </div>

      <div className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-28">
        <Container>
          <ScrollReveal className={hasIcons ? "w-full" : "max-w-3xl"}>
            {eyebrow && (
              <p className="mb-2 text-xs tracking-wide text-white/70 sm:mb-4 sm:text-sm">
                {eyebrow}
              </p>
            )}
            <h2 className="mb-4 whitespace-pre-line text-2xl font-light leading-tight text-white sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl">
              {title}
            </h2>
            {description && (
              <p
                className="mb-6 max-w-2xl whitespace-pre-line text-sm font-medium tracking-[-0.56px] text-white sm:mb-8"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
              />
            )}

            {hasIcons ? (
              /* Grade com ícones */
              <div className="mt-8 grid grid-cols-2 gap-6 sm:mt-12 sm:gap-8 md:gap-10 lg:grid-cols-4">
                {benefits.map((benefit: any, index: number) => {
                  const iconSrc = legacyAsset(benefit.icon || benefit.customIcon);
                  return (
                    <div key={index} className="flex flex-col items-center text-center">
                      <div className="mb-3 sm:mb-4">
                        {iconSrc ? (
                          <Image
                            src={iconSrc}
                            alt={benefit.title || ""}
                            width={56}
                            height={56}
                            className="h-10 w-10 object-contain brightness-0 invert sm:h-12 sm:w-12 md:h-14 md:w-14"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center sm:h-12 sm:w-12 md:h-14 md:w-14">
                            <Package className="h-full w-full stroke-[1.5] text-white" />
                          </div>
                        )}
                      </div>
                      <h3 className="mb-1 text-[11px] font-semibold leading-tight text-white sm:mb-2 sm:text-xs md:text-sm">
                        {benefit.title}
                      </h3>
                      <p className="text-[10px] leading-relaxed text-white/70 sm:text-[11px] md:text-xs">
                        {benefit.items?.[0]?.text || benefit.description || ""}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Lista numerada */
              <div className="space-y-8 sm:space-y-10">
                {benefits.map((benefit: any, index: number) => (
                  <div key={index}>
                    <h3 className="mb-2 text-sm font-bold text-white sm:text-base">
                      {index + 1}. {benefit.title}
                    </h3>
                    {benefit.description && (
                      <p className="mb-3 text-xs leading-relaxed text-white/80 sm:text-sm">
                        {benefit.description}
                      </p>
                    )}
                    {benefit.bullets && benefit.bullets.length > 0 && (
                      <ul className="mb-3 space-y-1 pl-5">
                        {benefit.bullets.map((bullet: string, bulletIndex: number) => (
                          <li
                            key={bulletIndex}
                            className="list-disc text-xs leading-relaxed text-white/80 sm:text-sm"
                          >
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                    {benefit.closingText && (
                      <p className="text-xs leading-relaxed text-white/80 sm:text-sm">
                        {benefit.closingText}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {content?.bottomText && (
              <p
                className="mt-10 max-w-4xl text-sm leading-relaxed text-white/80 sm:mt-12 sm:text-base md:mt-14"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(content.bottomText) }}
              />
            )}

            <div className="mt-6 flex items-center gap-4 sm:mt-8 sm:gap-6 md:mt-10">
              <div className="h-px flex-1 bg-white/30" />
              {ctaText && (
                <SmartLink
                  href={ctaLink}
                  className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-medium text-navy transition-colors hover:bg-white/90 sm:px-6 sm:py-3 sm:text-sm"
                >
                  {ctaText}
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </SmartLink>
              )}
            </div>
          </ScrollReveal>
        </Container>
      </div>
    </section>
  );
}
