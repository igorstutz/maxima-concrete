import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";

interface PatternItem {
  title?: string;
  image?: string;
  description?: string;
}

interface ColorGroup {
  label?: string;
  colors?: string[];
}

/**
 * "Design Options That Inspire" — dark section with pattern cards
 * (title + thumbnail + description) and color palette swatch rows.
 */
export default function DesignOptions({
  content,
}: {
  content: Record<string, any>;
}) {
  const title = content?.title || "Design Options That Inspire";
  const subtitle = content?.subtitle || "";
  const patterns: PatternItem[] = content?.patterns || [];
  const colorPaletteTitle = content?.colorPaletteTitle || "Color Palette:";
  const colorGroups: ColorGroup[] = content?.colorGroups || [];
  const bottomNote = content?.bottomNote || "";

  return (
    <section className="w-full bg-[#1E1E1E] py-16 sm:py-24">
      <Container>
        <ScrollReveal>
          {/* Title */}
          <h2 className="mb-3 text-2xl font-medium leading-[120%] tracking-[-1.28px] text-white md:mb-4 md:text-[32px]">
            {title}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p className="mb-6 max-w-[600px] text-sm font-normal tracking-[-0.64px] text-white md:mb-10 md:text-base">
              {subtitle}
            </p>
          )}
        </ScrollReveal>

        {/* Pattern cards */}
        {patterns.length > 0 && (
          <ScrollReveal>
            <div className="mb-8 grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-8 md:mb-12">
              {patterns.map((pattern, index) => (
                <div key={index}>
                  {pattern.title && (
                    <h3 className="mb-2 text-[15px] font-medium leading-[120%] tracking-[-0.72px] text-white md:text-lg">
                      {pattern.title}
                    </h3>
                  )}
                  {pattern.image && (
                    <div className="relative mb-2 h-[82px] w-full overflow-hidden rounded-md">
                      <Image
                        src={legacyAsset(pattern.image)}
                        alt={pattern.title || `Pattern ${index + 1}`}
                        fill
                        sizes="(min-width: 640px) 540px, 100vw"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  {pattern.description && (
                    <p className="text-[13px] font-normal tracking-[-0.56px] text-white md:text-sm">
                      {pattern.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Divider */}
        {colorGroups.length > 0 && (
          <div className="mb-6 h-px w-full bg-white/15 md:mb-10" />
        )}

        {/* Color palette */}
        {colorGroups.length > 0 && (
          <ScrollReveal>
            <div className="mb-6 md:mb-10">
              <h3 className="mb-4 text-xl font-medium leading-[115%] tracking-[-1.12px] text-white md:mb-6 md:text-[28px]">
                {colorPaletteTitle}
              </h3>
              <div className="flex flex-col gap-3 sm:gap-4">
                {colorGroups.map((group, gIdx) => (
                  <div
                    key={gIdx}
                    className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6"
                  >
                    <span className="text-sm font-medium tracking-[-0.56px] text-white sm:min-w-[160px]">
                      {group.label}
                    </span>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {(group.colors || []).map((color, cIdx) => (
                        <div
                          key={cIdx}
                          className="h-[24px] w-[60px] rounded sm:h-[28px] sm:w-[80px] md:h-[32px] md:w-[100px]"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Bottom note */}
        {bottomNote && (
          <p className="max-w-[700px] text-[13px] font-normal tracking-[-0.64px] text-white md:text-base">
            {bottomNote}
          </p>
        )}
      </Container>
    </section>
  );
}
