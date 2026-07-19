import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SnapCarousel } from "@/components/SnapCarousel";
import { legacyAsset } from "@/components/sections/home/legacy";
import { GradientCta, sanitizeHtml } from "./shared";

/**
 * Finishes detail page intro — standardized two-column layout (text left,
 * square image/carousel right), same field mapping as the old
 * ServiceIntroFromObject (paragraph1..3 / description / subtitle, image
 * fields collected into a single carousel).
 */
export default function FinishesIntro({
  content,
}: {
  content: Record<string, any>;
}) {
  const c = content || {};
  const title = c.title || c.titleLine1 || "";
  const titleLine2 = c.titleLine2 || "";

  // Collect plain paragraphs from legacy field names
  const paragraphs = [
    c.paragraph1,
    c.paragraph2,
    c.paragraph3,
    c.complementaryText,
    !c.paragraph1 &&
    !c.paragraph2 &&
    typeof c.description === "string" &&
    !/[<>]/.test(c.description)
      ? c.description
      : null,
    c.subtitle && !c.paragraph1 ? c.subtitle : null,
  ].filter((p): p is string => typeof p === "string" && p.trim().length > 0);

  const descriptionHtml =
    paragraphs.length === 0 && typeof c.description === "string"
      ? c.description
      : undefined;

  // Collect images from any legacy field name (deduplicated, order kept)
  const images = Array.from(
    new Set(
      [
        ...(Array.isArray(c.images) ? c.images : []),
        c.imageTopRight,
        c.imageLarge,
        c.mainImage,
        c.image,
        c.imageHorizontal,
        c.imageVertical,
        c.backgroundImage,
      ]
        .filter(
          (s): s is string => typeof s === "string" && s.trim().length > 0
        )
        .map(legacyAsset)
    )
  );

  const renderSlide = (src: string, i: number) => (
    <div
      key={i}
      className="relative aspect-square w-full shrink-0 snap-start overflow-hidden rounded-2xl"
    >
      <Image
        src={src}
        alt={`Finish ${i + 1}`}
        fill
        sizes="(min-width: 1024px) 500px, 100vw"
        className="object-cover"
        loading={i === 0 ? undefined : "lazy"}
      />
    </div>
  );

  return (
    <section className="relative w-full bg-white py-12 md:py-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left column — title, text, CTA */}
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
                className="mb-6 space-y-4 whitespace-pre-line text-sm font-normal leading-[140%] tracking-[-0.56px] text-[#494948] md:mb-8 md:text-[14px]"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(descriptionHtml),
                }}
              />
            ) : null}

            {c.ctaText && (
              <div className="flex justify-start">
                <GradientCta text={c.ctaText} link={c.ctaLink} />
              </div>
            )}
          </ScrollReveal>

          {/* Right column — square image / carousel */}
          <ScrollReveal
            direction="right"
            className="order-1 flex justify-center lg:order-2 lg:justify-end"
          >
            {images.length > 1 ? (
              <SnapCarousel
                controls="overlay-sides"
                className="w-full max-w-[500px]"
                trackClassName="gap-0 rounded-2xl"
              >
                {images.map(renderSlide)}
              </SnapCarousel>
            ) : images.length === 1 ? (
              <div className="w-full max-w-[500px]">
                {renderSlide(images[0], 0)}
              </div>
            ) : null}
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
