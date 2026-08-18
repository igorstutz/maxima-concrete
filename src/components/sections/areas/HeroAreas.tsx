import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/Container";
import { heroPicture } from "@/lib/hero-image";
import { SmartLink } from "@/components/sections/home/SmartLink";

/** Hero raso da página Areas We Serve — type "hero-areas". */
export default function HeroAreas({ content }: { content: Record<string, any> }) {
  const title: string = content?.title || "";
  const subtitle: string = content?.subtitle || "";
  const description: string = content?.description || "";
  const ctaText: string = content?.ctaText || "";
  const ctaLink: string = content?.ctaLink || "#contact";
  const { imgProps, mobileProps } = heroPicture({
    desktop: content?.backgroundImage,
    // Sem imagem de celular própria, o <source> repete a de desktop.
    mobile: content?.backgroundImageMobile || content?.backgroundImage,
    width: 1600,
    height: 600,
  });

  return (
    <section className="relative flex h-[420px] items-center overflow-hidden md:h-[480px]">
      {imgProps && (
        <picture>
          {mobileProps && (
            <source
              media="(max-width: 768px)"
              srcSet={mobileProps.srcSet}
              sizes="100vw"
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
              className="gradient-navy mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110"
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
