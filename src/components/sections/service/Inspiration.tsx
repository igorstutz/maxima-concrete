"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { SmartLink } from "@/components/sections/home/SmartLink";
import { legacyAsset } from "@/components/sections/home/legacy";

/**
 * inspiration — galeria escura com 1 imagem grande + 4 miniaturas clicáveis
 * (DrivewaysPageInspirationRenderer). Defaults idênticos ao renderer antigo.
 */
export default function Inspiration({ content }: { content: Record<string, any> }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const title = content?.title || "Inspiration for Your Driveways";
  const description =
    content?.description ||
    "Every project is unique. Browse our gallery and imagine the possibilities for your home.";
  const descriptionBold = content?.descriptionBold || "Every project is unique.";
  const ctaText = content?.ctaText || "Inspired? Let's Build Your Vision";
  const ctaLink = content?.ctaLink || "#contact";

  const images: string[] = (content?.images || []).map((s: string) => legacyAsset(s));
  const mainImage = images[activeIndex] || images[0] || "";
  // 4 miniaturas excluindo a imagem ativa
  const thumbnails = images.filter((_: string, i: number) => i !== activeIndex).slice(0, 4);

  const handleThumbnailClick = (thumbnailIndex: number) => {
    // Encontra o índice real dessa miniatura no array original
    let count = 0;
    for (let i = 0; i < images.length; i++) {
      if (i !== activeIndex) {
        if (count === thumbnailIndex) {
          setActiveIndex(i);
          break;
        }
        count++;
      }
    }
  };

  return (
    <section
      className="relative w-full py-16 md:py-24"
      style={{
        background: "radial-gradient(ellipse at center, #2a2a2a 0%, #1a1a1a 50%, #0f0f0f 100%)",
      }}
    >
      <Container>
        <h2 className="mb-6 text-2xl font-medium leading-[1.2] tracking-[-1.28px] text-[#EAEAEA] sm:text-[28px] md:mb-10 md:text-[32px]">
          {title}
        </h2>

        {/* Galeria — 1 imagem grande + 4 miniaturas */}
        <div className="mb-6 flex flex-col gap-3 lg:flex-row">
          {/* Imagem principal com borda azul à esquerda */}
          <div className="w-full lg:min-w-0 lg:flex-1">
            <div className="relative h-[280px] overflow-hidden rounded-lg border-l-4 border-ocean sm:h-[350px] lg:h-[420px]">
              {mainImage && (
                <Image
                  src={mainImage}
                  alt="Featured project"
                  fill
                  sizes="(min-width: 1024px) 800px, 100vw"
                  className="object-cover"
                />
              )}
            </div>
          </div>

          {/* Miniaturas — horizontais no mobile, verticais no desktop */}
          <div className="grid h-auto grid-cols-4 gap-2 lg:flex lg:h-[420px] lg:w-[140px] lg:flex-col">
            {thumbnails.map((thumb: string, index: number) => {
              const isLastThumbnail = index === thumbnails.length - 1;
              return (
                <button
                  key={`${thumb}-${index}`}
                  onClick={() => handleThumbnailClick(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg transition-opacity focus:outline-none lg:aspect-auto lg:flex-1 ${
                    isLastThumbnail ? "ring-2 ring-[#9b59b6]" : "opacity-90 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={thumb}
                    alt={`Project ${index + 1}`}
                    fill
                    sizes="140px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Descrição */}
        <div className="mb-6">
          <p className="text-base font-medium leading-[1.4] tracking-[-0.8px] text-white sm:text-lg md:text-xl">
            <span className="font-semibold">{descriptionBold}</span>{" "}
            <span className="font-normal opacity-80">
              {description.replace(descriptionBold, "").trim()}
            </span>
          </p>
        </div>

        {/* CTA */}
        <SmartLink
          href={ctaLink}
          className="gradient-navy inline-flex items-center gap-2 rounded-[10px] px-6 py-3 text-sm font-medium text-white transition-all hover:opacity-90"
        >
          {ctaText}
          <ArrowUpRight className="h-4 w-4" />
        </SmartLink>
      </Container>
    </section>
  );
}
