import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { CtaButton, sanitizeHtml } from "./shared";

/**
 * Section type: `outdoor-space` — full-bleed background image band on top,
 * content (framed photo + text + CTA) overlapping it from below.
 */
export default function OutdoorSpace({
  content,
}: {
  content: Record<string, any>;
}) {
  const backgroundImage = legacyAsset(content?.backgroundImage);
  const image = legacyAsset(content?.image);
  const title = content?.title || "";
  const description = content?.description || "";
  const ctaText = content?.ctaText || "";
  const ctaLink = content?.ctaLink || "#contact";

  return (
    <section className="relative w-full bg-white pb-8 lg:pb-12">
      {/* Background image — top band (full-bleed) */}
      {backgroundImage && (
        <div className="relative h-[180px] w-full sm:h-[240px] lg:h-[500px]">
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-bottom"
            loading="lazy"
          />
        </div>
      )}

      {/* Content area — overlaps into the background band */}
      <Container className={backgroundImage ? "relative -mt-[100px]" : ""}>
        {/* Mobile layout */}
        <div className="space-y-5 pb-8 lg:hidden">
          {image && (
            <div className="px-2">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px_0_28px_28px] border-[3px] border-white">
                <Image
                  src={image}
                  alt={title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          )}
          <div className="space-y-3 px-1">
            {title && (
              <h2 className="text-[22px] font-medium leading-[120%] tracking-tight text-[#494948]">
                {title}
              </h2>
            )}
            {description && (
              <p
                className="text-[13px] font-normal leading-[140%] text-[#494948]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
              />
            )}
            <CtaButton
              text={ctaText}
              link={ctaLink}
              className="w-full justify-center px-6 py-3.5 text-[13px]"
            />
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden items-start gap-12 lg:flex">
          {image && (
            <ScrollReveal direction="left" className="shrink-0">
              <div className="relative h-[491px] w-[535px] overflow-hidden rounded-[54px_0_54px_54px] border-4 border-white">
                <Image
                  src={image}
                  alt={title}
                  fill
                  sizes="535px"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
          )}

          <ScrollReveal className="flex flex-col space-y-5 pt-[220px]">
            {title && (
              <h2 className="text-[32px] font-medium leading-[120%] tracking-tight text-[#494948]">
                {title}
              </h2>
            )}
            {description && (
              <p
                className="max-w-[249px] text-[14px] font-normal leading-[120%] text-[#494948]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
              />
            )}
            <CtaButton text={ctaText} link={ctaLink} className="self-start px-6 py-3" />
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
