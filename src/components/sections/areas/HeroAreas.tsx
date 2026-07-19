import { getImageProps } from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/Container";
import { asset } from "@/lib/base-path";
import { legacyAsset } from "@/components/sections/home/legacy";
import { SmartLink } from "@/components/sections/home/SmartLink";

/** Hero raso da página Areas We Serve — type "hero-areas". */
export default function HeroAreas({ content }: { content: Record<string, any> }) {
  const title: string = content?.title || "";
  const subtitle: string = content?.subtitle || "";
  const description: string = content?.description || "";
  const ctaText: string = content?.ctaText || "";
  const ctaLink: string = content?.ctaLink || "#contact";
  const backgroundImage: string = legacyAsset(content?.backgroundImage);
  const backgroundImageMobile: string =
    legacyAsset(content?.backgroundImageMobile) || backgroundImage;

  // <picture> com art direction (mobile menor) mantendo priority do next/image.
  const { props: imgProps } = backgroundImage
    ? getImageProps({
        alt: "",
        src: asset(backgroundImage),
        width: 1600,
        height: 600,
        priority: true,
        unoptimized: true,
        sizes: "100vw",
      })
    : { props: null };

  return (
    <section className="relative flex h-[420px] items-center overflow-hidden md:h-[480px]">
      {imgProps && (
        <picture>
          {backgroundImageMobile && (
            <source
              media="(max-width: 768px)"
              srcSet={asset(backgroundImageMobile)}
              type="image/webp"
              width={768}
              height={600}
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
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
      <Container className="relative z-10 w-full">
        <div className="max-w-2xl">
          {title && (
            <h1 className="mb-4 whitespace-pre-line text-3xl font-light leading-tight tracking-tight text-white md:text-5xl">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mb-3 whitespace-pre-line text-base font-medium text-white/90 md:text-lg">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="max-w-xl whitespace-pre-line text-sm leading-relaxed text-white/80 md:text-base">
              {description}
            </p>
          )}
          {ctaText && (
            <SmartLink
              href={ctaLink}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8]"
            >
              {ctaText}
              <ArrowUpRight className="h-4 w-4" />
            </SmartLink>
          )}
        </div>
      </Container>
    </section>
  );
}
