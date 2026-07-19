import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SnapCarousel } from "@/components/SnapCarousel";
import { legacyAsset } from "@/components/sections/home/legacy";
import { CtaButton, sanitizeHtml } from "./shared";

/**
 * Standard service intro (port of ServiceIntroFromObject + ServiceIntroStandard
 * from the old site): text left, square image carousel right. Used by the
 * `outdoor-intro` and `ok-intro` section types.
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

  // Collect paragraphs from the legacy field names (same rules as the old site)
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

  // Collect images from any legacy field name, dedup preserving order
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
      ].filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    )
  ).map(legacyAsset);

  return (
    <section className="bg-white py-12 md:py-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left column — title, text, CTA */}
          <ScrollReveal className="order-2 flex flex-col justify-center lg:order-1">
            {title && (
              <h2 className="mb-5 text-2xl font-medium leading-[120%] tracking-tight text-[#494948] md:mb-6 md:text-[32px] lg:text-[36px]">
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
                    className="whitespace-pre-line text-sm font-medium leading-normal text-[#494948]"
                  >
                    {p}
                  </p>
                ))}
              </div>
            ) : descriptionHtml ? (
              <div
                className="mb-6 space-y-4 text-sm font-normal leading-[140%] text-[#494948] md:mb-8"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(descriptionHtml) }}
              />
            ) : null}

            <CtaButton text={c?.ctaText} link={c?.ctaLink} className="self-start px-5 py-2.5 md:px-6 md:py-3" />
          </ScrollReveal>

          {/* Right column — square image carousel */}
          {images.length > 0 && (
            <ScrollReveal
              direction="right"
              className="order-1 flex justify-center lg:order-2 lg:justify-end"
            >
              <div className="w-full max-w-[500px]">
                {images.length > 1 ? (
                  <SnapCarousel
                    controls="overlay-sides"
                    className="overflow-hidden rounded-2xl"
                  >
                    {images.map((src, i) => (
                      <div
                        key={i}
                        className="relative aspect-square w-full shrink-0 snap-start"
                      >
                        <Image
                          src={src}
                          alt={`${altPrefix} ${i + 1}`}
                          fill
                          sizes="(min-width: 1024px) 500px, 100vw"
                          className="object-cover"
                          loading={i === 0 ? "eager" : "lazy"}
                        />
                      </div>
                    ))}
                  </SnapCarousel>
                ) : (
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                    <Image
                      src={images[0]}
                      alt={`${altPrefix} 1`}
                      fill
                      sizes="(min-width: 1024px) 500px, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </ScrollReveal>
          )}
        </div>
      </Container>
    </section>
  );
}
