import { getImageProps } from "next/image";
import { Container } from "@/components/Container";
import { asset } from "@/lib/base-path";
import { legacyAsset } from "@/components/sections/home/legacy";
import { HubCtaButton } from "./shared";

interface HubHeroContent {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage?: string;
  backgroundImageMobile?: string;
}

/** Hub Hero — fundo full-bleed, título, contagem de instalações, dois CTAs. */
export default function HubHero({ content }: { content: Record<string, any> }) {
  const c = content as HubHeroContent;
  const backgroundImage = legacyAsset(c.backgroundImage);
  const backgroundImageMobile = legacyAsset(c.backgroundImageMobile);

  // <picture> com art direction (mobile menor) mantendo priority do next/image.
  const { props: imgProps } = backgroundImage
    ? getImageProps({
        alt: "",
        src: asset(backgroundImage),
        width: 1920,
        height: 1080,
        priority: true,
        unoptimized: true,
        sizes: "100vw",
      })
    : { props: null };

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-[#1a1a1a] md:min-h-screen">
      {imgProps && (
        <picture>
          {backgroundImageMobile && (
            <source
              media="(max-width: 768px)"
              srcSet={asset(backgroundImageMobile)}
            />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            {...imgProps}
            alt=""
            fetchPriority="high"
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/20" />

      <div className="relative z-10 w-full py-20 md:py-28">
        <Container>
          <div className="max-w-2xl">
            <h1 className="mb-2 text-4xl font-light tracking-tight text-white md:text-6xl">
              {c.title}
            </h1>
            {c.subtitle && (
              <p className="mb-5 whitespace-pre-line text-lg font-light text-white md:text-2xl">
                {c.subtitle}
              </p>
            )}
            {c.description && (
              <p className="mb-8 max-w-md whitespace-pre-line text-sm leading-relaxed text-white/90 md:text-base">
                {c.description}
              </p>
            )}
            <div className="flex flex-col items-start gap-4">
              <HubCtaButton text={c.ctaText} link={c.ctaLink} variant="dark" />
              <HubCtaButton
                text={c.secondaryCtaText}
                link={c.secondaryCtaLink}
                variant="light"
              />
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
