import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { CtaButton, sanitizeHtml } from "./shared";

/**
 * O disco usa `currentColor`, então a cor vem do `text-*` de quem chama — é
 * assim que ele muda no hover. O check fica branco para manter o contraste.
 */
const CheckBadge = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="10" fill="currentColor" />
    <path
      d="M6 10.5L8.5 13L14 7.5"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** branco translúcido em repouso; azul da marca ao passar o mouse no item */
const BADGE_CLASS =
  "shrink-0 text-white/20 transition-colors duration-300 group-hover/benefit:text-primary";

/**
 * Section type: `why-choose-outdoor` — big image with dark overlay, benefits
 * checklist and white CTA; optional two-tone bottom title.
 */
export default function WhyChooseOutdoor({
  content,
}: {
  content: Record<string, any>;
}) {
  const title = content?.title || "";
  const benefits: { text?: string }[] = content?.benefits || [];
  const ctaText = content?.ctaText || "Contact Us";
  const ctaLink = content?.ctaLink || "#contact";
  const image = legacyAsset(content?.image);
  const overlayOpacity = content?.overlayOpacity ?? 60;
  const bottomTitle = content?.bottomTitle || "";
  const bottomTitleLight = content?.bottomTitleLight || "";

  return (
    <section className="bg-white">
      <Container>
        {/* Mobile: stacked vertical layout */}
        <div className="block sm:hidden">
          <div className="relative w-full overflow-hidden rounded-t-[14px]">
            {image && (
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={image}
                  alt={title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent from-30% to-black/70" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h2 className="text-[22px] font-medium leading-[120%] tracking-tight text-white">
                {title}
              </h2>
            </div>
          </div>
          <div className="rounded-b-[14px] bg-[#1A1A1A] px-5 py-5">
            <div className="mb-5 space-y-2.5">
              {benefits.map((benefit, index) => (
                <div key={index} className="group/benefit flex items-start gap-2">
                  <CheckBadge className={`mt-0.5 h-4 w-4 ${BADGE_CLASS}`} />
                  <p
                    className="text-[13px] font-medium leading-[140%] text-white/90"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(benefit.text || "") }}
                  />
                </div>
              ))}
            </div>
            <CtaButton
              text={ctaText}
              link={ctaLink}
              variant="white"
              className="px-[18px] py-[9px] text-[13px]"
            />
          </div>
        </div>

        {/* Tablet & desktop: horizontal overlay layout */}
        <ScrollReveal className="hidden sm:block">
          <div className="relative aspect-[189/122] w-full overflow-hidden rounded-[14px]">
            {image && (
              <Image
                src={image}
                alt={title}
                fill
                sizes="(min-width: 1024px) 1136px, 100vw"
                className="object-cover"
                loading="lazy"
              />
            )}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, rgba(0,0,0,0) 20%, rgba(0,0,0,${overlayOpacity / 100}) 50%, rgba(0,0,0,${overlayOpacity / 100}) 100%)`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-end">
              <div className="w-[55%] pr-6 sm:pr-10 lg:w-1/2 lg:pr-14">
                <h2 className="mb-6 text-[28px] font-medium leading-[120%] tracking-tight text-white sm:mb-8 lg:text-[32px]">
                  {title}
                </h2>
                <div className="mb-6 space-y-3 sm:mb-8 sm:space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="group/benefit flex items-start gap-2.5">
                      <CheckBadge className={`mt-0.5 h-5 w-5 ${BADGE_CLASS}`} />
                      <p
                        className="text-[14px] font-medium leading-[120%] text-white lg:text-[16px]"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(benefit.text || ""),
                        }}
                      />
                    </div>
                  ))}
                </div>
                <CtaButton
                  text={ctaText}
                  link={ctaLink}
                  variant="white"
                  className="px-5 py-2.5"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Bottom two-tone title */}
        {(bottomTitle || bottomTitleLight) && (
          <div className="py-10 sm:py-16 lg:py-20">
            <h3 className="text-[22px] font-medium leading-[120%] tracking-tight sm:text-[30px] lg:text-[36px]">
              <span className="text-[#494948]">{bottomTitle}</span>
              {bottomTitleLight && (
                <span className="text-[#494948]/80"> {bottomTitleLight}</span>
              )}
            </h3>
          </div>
        )}
      </Container>
    </section>
  );
}
