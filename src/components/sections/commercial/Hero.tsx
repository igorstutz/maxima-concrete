import { getImageProps } from "next/image";
import { Container } from "@/components/Container";
import { asset } from "@/lib/base-path";
import { legacyAsset } from "@/components/sections/home/legacy";

interface CommercialHeroContent {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundImageMobile?: string;
}

/**
 * type: "commercial-hero" — hero escuro com texto ancorado embaixo
 * (usado em /commercial, /commercial-concrete e /commercial-pools).
 */
export default function Hero({ content }: { content: Record<string, any> }) {
  const c = content as CommercialHeroContent;
  const title = c.title || "We Take Your Business Seriously";
  const subtitle = c.subtitle || "Commercial Concrete by Maxima";
  const backgroundImage = legacyAsset(c.backgroundImage);

  return (
    <section className="relative flex min-h-[480px] items-end overflow-hidden bg-[#1a1a1a] md:min-h-[560px]">
      {backgroundImage && (
        <picture>
          {c.backgroundImageMobile && (
            <source
              media="(max-width: 768px)"
              srcSet={asset(c.backgroundImageMobile)}
              width={768}
              height={1024}
            />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            {...getImageProps({
              alt: "",
              src: asset(backgroundImage),
              width: 1920,
              height: 1080,
              priority: true,
              unoptimized: true,
              sizes: "100vw",
            }).props}
            alt=""
            fetchPriority="high"
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />

      <div className="relative z-10 w-full pb-12 md:pb-16 lg:pb-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="whitespace-pre-line text-[clamp(32px,5vw,48px)] font-medium leading-[120%] tracking-[-0.05em] text-white">
              {title}
            </h1>
            <p className="mt-3 whitespace-pre-line text-[clamp(18px,2.5vw,24px)] font-normal leading-[130%] tracking-[-0.04em] text-white">
              {subtitle}
            </p>
          </div>
        </Container>
      </div>
    </section>
  );
}
