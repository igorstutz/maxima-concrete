import { ArrowUpRight } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SnapCarousel } from "@/components/SnapCarousel";
import { SmartLink } from "./SmartLink";

interface PatiosContent {
  label?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  images?: string[];
}

export default function Patios({ content }: { content: Record<string, any> }) {
  const c = content as PatiosContent;
  const images = c.images ?? [];

  return (
    <section id="patios" className="bg-white py-16 sm:py-24">
      <Container>
        {/* Label com ícone (o site antigo usa o driveways-icon aqui) */}
        <ScrollReveal>
          <div className="mb-4 flex items-center gap-3">
            <Image
              src="/images/assets/driveways-icon.png"
              alt=""
              width={32}
              height={32}
              className="h-6 w-6 object-contain md:h-8 md:w-8"
            />
            <span className="text-xl font-medium text-ocean md:text-2xl lg:text-[32px]">
              {c.label}
            </span>
          </div>

          <h2 className="mb-6 text-3xl font-normal leading-tight text-[#494948] md:mb-8 md:text-4xl lg:text-[36px]">
            {c.title}
          </h2>
        </ScrollReveal>

        {/* Mobile: carrossel */}
        <div className="md:hidden">
          <SnapCarousel controls="overlay-sides" trackClassName="gap-4">
            {images.map((src, index) => (
              <div
                key={index}
                className="relative h-[250px] w-full shrink-0 snap-start overflow-hidden rounded-xl"
              >
                <Image
                  src={src}
                  alt={`Patio project ${index + 1}`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </SnapCarousel>
        </div>

        {/* Desktop/tablet: imagem grande + imagem vertical */}
        <div className="hidden h-[300px] gap-6 md:flex lg:h-[400px]">
          {images[0] && (
            <div className="relative flex-1 overflow-hidden rounded-xl">
              <Image
                src={images[0]}
                alt="Patio project 1"
                fill
                sizes="(min-width: 1024px) 800px, 60vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          )}
          {images[1] && (
            <div className="relative w-[250px] shrink-0 overflow-hidden rounded-xl lg:w-[350px]">
              <Image
                src={images[1]}
                alt="Patio project 2"
                fill
                sizes="350px"
                className="object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* Descrição */}
        <p className="mt-6 max-w-[700px] text-sm font-normal text-[#494948] md:mt-8 md:text-base">
          {c.description}
        </p>

        {/* Divisor + CTA */}
        <div className="mt-6 flex items-center justify-between gap-4 md:mt-8">
          <div className="h-px flex-1 bg-[#494948]/30" />
          <SmartLink
            href={c.ctaLink}
            className="gradient-navy flex shrink-0 items-center justify-center gap-2.5 rounded-[5px] px-5 py-2.5 text-center text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:brightness-110"
          >
            {c.ctaText}
            <ArrowUpRight className="h-4 w-4" />
          </SmartLink>
        </div>
      </Container>
    </section>
  );
}
