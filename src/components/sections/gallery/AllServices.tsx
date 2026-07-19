import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmartLink } from "@/components/sections/home/SmartLink";
import { legacyAsset, internalLink } from "@/components/sections/home/legacy";

interface ServiceItem {
  name: string;
  image: string;
  link?: string;
}

/** Patios/Driveways cards split into Concrete/Paver deep links on the gallery hub. */
const SPLIT_MAP: Record<string, { concrete: string; paver: string }> = {
  driveways: {
    concrete: "/gallery/driveways?variant=concrete",
    paver: "/gallery/driveways?variant=paver",
  },
  driveway: {
    concrete: "/gallery/driveways?variant=concrete",
    paver: "/gallery/driveways?variant=paver",
  },
  patios: {
    concrete: "/gallery/patios?variant=concrete",
    paver: "/gallery/patios?variant=paver",
  },
  patio: {
    concrete: "/gallery/patios?variant=concrete",
    paver: "/gallery/patios?variant=paver",
  },
};

const PILL_CLASS =
  "gradient-navy inline-flex h-7 items-center justify-center gap-1.5 rounded-[5px] px-3.5 text-[10px] font-medium text-white transition-all hover:brightness-110 md:text-xs";

/**
 * Gallery hub — "All our Services": title, description, card grid linking to
 * each gallery category, plus bottom text + gradient line + CTA.
 */
export default function AllServices({
  content,
}: {
  content: Record<string, any>;
}) {
  const items: ServiceItem[] = content?.items || [];

  const bottomBlock = (
    <>
      {content?.bottomText && (
        <p className="max-w-[560px] text-xl font-normal leading-[120%] tracking-[-1.44px] text-[#494948] md:text-2xl lg:text-3xl xl:text-4xl">
          {content.bottomText}
        </p>
      )}
      {/* Gradient line + CTA */}
      <div className="flex max-w-[600px] items-center gap-4 md:gap-6">
        <div className="h-[2px] flex-1 bg-[linear-gradient(270deg,#0D5D93_0%,#041C2D_100%)]" />
        {content?.ctaText && (
          <SmartLink
            href={content?.ctaLink || "#contact"}
            className="gradient-navy inline-flex items-center gap-2 whitespace-nowrap rounded-[10px] px-4 py-2.5 text-xs font-medium text-white transition-all duration-300 hover:scale-105 hover:brightness-110 md:px-6 md:py-3 md:text-sm"
          >
            {content.ctaText}
            <ArrowUpRight className="h-4 w-4" />
          </SmartLink>
        )}
      </div>
    </>
  );

  return (
    <section className="w-full bg-white py-10 md:py-16 lg:py-20">
      <Container className="flex flex-col gap-8 md:gap-10 lg:gap-14">
        {/* Title + description */}
        <ScrollReveal>
          <div className="flex flex-col gap-2 md:gap-3">
            {content?.title && (
              <h2 className="text-2xl font-medium leading-[1.3] tracking-[-1.52px] text-navy md:text-[32px] lg:text-[38px]">
                {content.title}
              </h2>
            )}
            {content?.description && (
              <p className="text-base font-normal leading-[1.4] tracking-[-0.48px] text-navy md:text-xl lg:text-2xl">
                {content.description}
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* Cards grid (bottom block inline on lg to fill the last row) */}
        {items.length > 0 && (
          <div className="grid grid-cols-2 justify-start gap-3 md:flex md:flex-wrap md:gap-4">
            {items.map((item, index) => {
              const split = SPLIT_MAP[(item.name || "").trim().toLowerCase()];
              return (
                <div
                  key={index}
                  className="group relative h-[clamp(180px,45vw,376px)] w-full shrink-0 overflow-hidden rounded-[14px] transition-transform duration-300 hover:scale-[1.03] md:w-[260px]"
                >
                  <Image
                    src={legacyAsset(item.image)}
                    alt={item.name}
                    fill
                    sizes="(min-width: 768px) 260px, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.70)_100%)]" />

                  {/* Stretched link covering the whole card */}
                  <SmartLink
                    href={internalLink(item.link)}
                    className="absolute inset-0 z-10"
                    ariaLabel={item.name}
                  >
                    <span className="sr-only">{item.name}</span>
                  </SmartLink>

                  {/* Centered name */}
                  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-2 md:px-4">
                    <span className="text-center text-sm font-normal uppercase tracking-[1.68px] text-white/80 md:text-lg lg:text-2xl">
                      {item.name}
                    </span>
                  </div>

                  {/* Bottom action(s) */}
                  {split ? (
                    <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2 md:bottom-6">
                      <SmartLink href={split.concrete} className={PILL_CLASS}>
                        Concrete
                        <ArrowUpRight className="h-3 w-3" />
                      </SmartLink>
                      <SmartLink href={split.paver} className={PILL_CLASS}>
                        Paver
                        <ArrowUpRight className="h-3 w-3" />
                      </SmartLink>
                    </div>
                  ) : (
                    <div className="pointer-events-none absolute bottom-4 left-0 right-0 z-10 flex justify-center md:bottom-6">
                      <span className={PILL_CLASS}>
                        View
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bottom text + CTA — inline with the cards on lg */}
            <div className="col-span-2 mt-4 flex flex-col justify-center gap-4 md:mt-6 md:w-full md:gap-6 lg:mt-0 lg:w-auto lg:min-w-[320px] lg:max-w-[600px] lg:flex-1 lg:px-4">
              {bottomBlock}
            </div>
          </div>
        )}

        {/* Fallback bottom block when there are no cards */}
        {items.length === 0 && (content?.bottomText || content?.ctaText) && (
          <div className="flex flex-col gap-4 md:gap-6">{bottomBlock}</div>
        )}
      </Container>
    </section>
  );
}
