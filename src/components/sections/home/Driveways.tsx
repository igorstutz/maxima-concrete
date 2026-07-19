import { ArrowUpRight } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SnapCarousel } from "@/components/SnapCarousel";
import { SmartLink } from "./SmartLink";

interface DrivewaysContent {
  label?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  images?: string[];
}

export default function Driveways({ content }: { content: Record<string, any> }) {
  const c = content as DrivewaysContent;
  const images = c.images ?? [];

  return (
    <section id="driveways" className="bg-navy py-16 sm:py-24">
      <Container>
        {/* Label com ícone (o site antigo usa o patios-icon aqui) */}
        <ScrollReveal>
          <div className="mb-4 flex items-center gap-3">
            <Image
              src="/images/assets/patios-icon.png"
              alt=""
              width={32}
              height={32}
              className="h-6 w-6 object-contain md:h-8 md:w-8"
            />
            <span className="text-xl font-medium text-white md:text-2xl">{c.label}</span>
          </div>

          <h2 className="mb-6 text-3xl font-normal leading-tight text-white md:mb-8 md:text-4xl lg:text-[36px]">
            {c.title}
          </h2>
        </ScrollReveal>

        {/* Mobile: descrição + carrossel */}
        <div className="md:hidden">
          <p className="mb-4 text-sm font-normal text-white">{c.description}</p>
          <SnapCarousel controls="overlay-sides" trackClassName="gap-4">
            {images.map((src, index) => (
              <div
                key={index}
                className="relative h-[250px] w-full shrink-0 snap-start overflow-hidden rounded-xl"
              >
                <Image
                  src={src}
                  alt={`Driveway project ${index + 1}`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </SnapCarousel>
        </div>

        {/* Desktop/tablet: 2 imagens empilhadas + descrição com imagem grande */}
        <div className="hidden gap-6 md:flex">
          <div className="flex w-[250px] shrink-0 flex-col gap-6 lg:w-[300px]">
            {images.slice(0, 2).map((src, index) => (
              <div
                key={index}
                className="relative min-h-[200px] flex-1 overflow-hidden rounded-xl"
              >
                <Image
                  src={src}
                  alt={`Driveway project ${index + 1}`}
                  fill
                  sizes="300px"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <p className="max-w-[600px] text-base font-normal text-white">
              {c.description}
            </p>
            {images[2] && (
              <div className="relative h-[320px] overflow-hidden rounded-xl lg:h-[420px]">
                <Image
                  src={images[2]}
                  alt="Driveway project 3"
                  fill
                  sizes="(min-width: 1024px) 850px, 60vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>

        {/* Divisor + CTA */}
        <div className="mt-6 flex items-center justify-between gap-4 md:mt-8">
          <div className="h-px flex-1 bg-white/30" />
          <SmartLink
            href={c.ctaLink}
            className="flex shrink-0 items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-navy transition-all duration-300 hover:scale-105 hover:bg-white/90 md:px-6 md:py-3"
          >
            {c.ctaText}
            <ArrowUpRight className="h-4 w-4" />
          </SmartLink>
        </div>
      </Container>
    </section>
  );
}
