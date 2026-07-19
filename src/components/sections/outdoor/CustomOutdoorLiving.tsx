import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { sanitizeHtml } from "./shared";

/**
 * Section type: `custom-outdoor-living` — full image with a white overlay box
 * for the text (L-shaped cutout on desktop, stacked on mobile).
 */
export default function CustomOutdoorLiving({
  content,
}: {
  content: Record<string, any>;
}) {
  const title = content?.title || "";
  const subtitle = content?.subtitle || "";
  const description = content?.description || "";
  const image = legacyAsset(content?.image);

  return (
    <section className="bg-white py-12 md:py-20">
      <Container>
        {/* Mobile: stacked layout */}
        <div className="space-y-6 lg:hidden">
          {image && (
            <Image
              src={image}
              alt={title || "Custom outdoor living"}
              width={1100}
              height={733}
              sizes="100vw"
              className="h-auto w-full rounded-2xl object-cover"
              loading="lazy"
            />
          )}
          <h2 className="text-2xl font-medium leading-[120%] tracking-tight text-[#494948]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm font-semibold leading-[120%] text-[#494948]">
              {subtitle}
            </p>
          )}
          {description && (
            <div
              className="space-y-3 text-sm font-normal leading-[150%] text-[#494948]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
            />
          )}
        </div>

        {/* Desktop: L-shaped layout — image background + white text box bottom-right */}
        <ScrollReveal className="hidden lg:block">
          <div className="relative overflow-hidden rounded-[20px]">
            {image ? (
              <Image
                src={image}
                alt={title || "Custom outdoor living"}
                fill
                sizes="(min-width: 1024px) 1136px, 100vw"
                className="object-cover"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-200" />
            )}
            <div className="relative flex flex-col">
              {/* Top row: full-width image visible (horizontal bar of the L) */}
              <div className="h-[200px]" />
              {/* Bottom row: image left + white text box right */}
              <div className="flex">
                <div className="min-h-[300px] w-[48%] shrink-0" />
                <div className="flex w-[52%] flex-col justify-center rounded-br-[20px] bg-white pb-8 pl-9 pr-8 pt-9">
                  <h2 className="mb-3 text-[32px] font-medium leading-[120%] tracking-tight text-[#494948]">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="mb-2 text-[16px] font-semibold leading-[120%] text-[#494948]">
                      {subtitle}
                    </p>
                  )}
                  {description && (
                    <div
                      className="space-y-0.5 text-[14px] font-normal leading-[140%] text-[#494948]"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
