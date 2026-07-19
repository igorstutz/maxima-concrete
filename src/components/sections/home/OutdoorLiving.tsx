import { ArrowUpRight } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SnapCarousel } from "@/components/SnapCarousel";
import { SmartLink } from "./SmartLink";

interface OutdoorLivingContent {
  label?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  images?: string[];
}

const ALTS = [
  "Modern outdoor living space with comfortable seating",
  "Rustic outdoor patio with stone wall and dining area",
  "Modern sunroom with garden view",
];

export default function OutdoorLiving({ content }: { content: Record<string, any> }) {
  const c = content as OutdoorLivingContent;
  const images = c.images ?? [];

  return (
    <section id="outdoor-living" className="bg-navy py-16 sm:py-24">
      <Container>
        {/* Label com ícone */}
        <ScrollReveal>
          <div className="mb-4 flex items-center gap-3">
            <Image
              src="/images/assets/outdoor-living-icon.png"
              alt=""
              width={32}
              height={32}
              className="h-6 w-6 object-contain md:h-8 md:w-8"
            />
            <span className="text-xl font-medium leading-[120%] tracking-[-0.04em] text-white md:text-2xl lg:text-[32px]">
              {c.label}
            </span>
          </div>

          <h2 className="mb-6 max-w-2xl text-2xl font-normal leading-[120%] tracking-[-0.05em] text-white md:mb-8 md:text-3xl lg:text-[36px]">
            {c.title}
          </h2>
        </ScrollReveal>

        {/* Mobile: carrossel + descrição */}
        <div className="mb-6 md:hidden">
          <SnapCarousel controls="overlay-sides" trackClassName="gap-4">
            {images.map((src, index) => (
              <div
                key={index}
                className="relative h-[250px] w-full shrink-0 snap-start overflow-hidden rounded-xl"
              >
                <Image
                  src={src}
                  alt={ALTS[index] || `Outdoor living space ${index + 1}`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </SnapCarousel>
          <p className="mt-6 text-sm leading-[140%] tracking-[-0.04em] text-white">
            {c.description}
          </p>
        </div>

        {/* Desktop/tablet: grade de 3 colunas com texto sob a imagem central */}
        <div className="mb-10 hidden grid-cols-3 gap-5 md:grid md:h-[440px] lg:h-[520px]">
          {images[0] && (
            <div className="relative min-h-0 overflow-hidden rounded-xl">
              <Image
                src={images[0]}
                alt={ALTS[0]}
                fill
                sizes="(min-width: 1024px) 380px, 33vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          )}

          <div className="flex min-h-0 flex-col">
            {images[1] && (
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl">
                <Image
                  src={images[1]}
                  alt={ALTS[1]}
                  fill
                  sizes="(min-width: 1024px) 380px, 33vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <p className="mt-5 shrink-0 text-justify text-base font-normal leading-[120%] tracking-[-0.04em] text-white lg:text-lg">
              {c.description}
            </p>
          </div>

          {images[2] && (
            <div className="relative min-h-0 overflow-hidden rounded-xl">
              <Image
                src={images[2]}
                alt={ALTS[2]}
                fill
                sizes="(min-width: 1024px) 380px, 33vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* Divisor + CTA */}
        <div className="flex items-center justify-between gap-4">
          <div className="h-px flex-1 bg-white/30" />
          <SmartLink
            href={c.ctaLink}
            className="gradient-navy flex shrink-0 items-center justify-center gap-2 rounded-[5px] px-4 py-2 text-center text-sm font-medium tracking-[-0.04em] text-white transition-all duration-300 hover:scale-105 hover:brightness-110"
          >
            {c.ctaText}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </SmartLink>
        </div>
      </Container>
    </section>
  );
}
