import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { CtaButton, sanitizeHtml } from "./shared";

/**
 * Section type: `carousel-images` — main image with 3 smaller overlapping
 * thumbnails on the left, title + rich text + CTA on the right.
 */
export default function CarouselImages({
  content,
}: {
  content: Record<string, any>;
}) {
  const title = content?.title || "";
  const description = content?.description || "";
  const mainImage = legacyAsset(content?.mainImage);
  const thumbnails: string[] = (content?.thumbnails || []).map(legacyAsset);
  const ctaText = content?.ctaText || "";
  const ctaLink = content?.ctaLink || "#contact";

  return (
    <section className="bg-white py-16 lg:py-20">
      <Container>
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:gap-16">
          {/* Left — main image + overlapping thumbnails */}
          <ScrollReveal direction="left" className="relative w-full lg:w-[55%]">
            <div className="relative aspect-[686/499] w-full overflow-hidden rounded-[16px]">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={title}
                  fill
                  sizes="(min-width: 1024px) 625px, 100vw"
                  className="object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full bg-gray-200" />
              )}
            </div>
            {thumbnails.length > 0 && (
              <div className="relative z-10 -mt-[60px] mx-4 flex gap-3">
                {thumbnails.slice(0, 3).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[39/34] flex-1 overflow-hidden rounded-[12px] border-2 border-white shadow-lg"
                  >
                    <Image
                      src={img}
                      alt={`${title} ${idx + 1}`}
                      fill
                      sizes="(min-width: 1024px) 200px, 33vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </ScrollReveal>

          {/* Right — text content */}
          <ScrollReveal className="flex w-full flex-col justify-center gap-6 lg:w-[45%] lg:pt-4">
            {title && (
              <h2 className="text-2xl font-medium leading-[120%] tracking-tight text-[#494948] lg:text-[32px]">
                {title}
              </h2>
            )}
            {description && (
              <div
                className="space-y-4 text-[14px] font-normal leading-[145%] text-[#494948]"
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
