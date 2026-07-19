"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, ZoomIn } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { SmartLink } from "@/components/sections/home/SmartLink";
import { legacyAsset } from "@/components/sections/home/legacy";
import { Lightbox } from "./Lightbox";

/**
 * "Inspiration for Your X" — dark full-bleed gallery with one large image,
 * numbered pagination, lightbox and an optional concrete/paver toggle
 * (split pages /gallery/patios and /gallery/driveways, `?variant=paver`).
 */
export default function InspirationGallery({
  content,
}: {
  content: Record<string, any>;
}) {
  const pathname = usePathname() || "";
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [variant, setVariant] = useState<"concrete" | "paver">("concrete");

  const title = content?.title || "Inspiration for Your Pools";
  const description =
    content?.description ||
    "Every project is unique. Browse our gallery and imagine the possibilities for your home.";
  const ctaText = content?.ctaText || "Inspired? Let's Build Your Vision";
  const ctaLink = content?.ctaLink || "#contact";
  const concreteImages: string[] = (content?.images || []).map(legacyAsset);
  const paverImages: string[] = (content?.paverImages || []).map(legacyAsset);
  const isSplitPage = /\/gallery\/(patios|driveways)/.test(pathname);
  const hasToggle = isSplitPage || paverImages.length > 0;
  const images = variant === "paver" ? paverImages : concreteImages;
  const totalImages = images.length;
  const currentImage = images[activeIndex] || "";

  // Initial variant from ?variant=paver (client-only to avoid hydration mismatch)
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("variant");
    if (v === "paver") setVariant("paver");
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [variant]);

  const lightboxPrev = () =>
    setLightboxIndex((i) => (i > 0 ? i - 1 : totalImages - 1));
  const lightboxNext = () =>
    setLightboxIndex((i) => (i < totalImages - 1 ? i + 1 : 0));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Pagination: 1, 2, 3, ..., N
  const buildPagination = () => {
    if (totalImages <= 5) {
      return Array.from({ length: totalImages }, (_, i) => i);
    }
    const pages: (number | "ellipsis")[] = [0, 1, 2];
    if (activeIndex > 2 && activeIndex < totalImages - 1) {
      pages.push("ellipsis", activeIndex);
    } else {
      pages.push("ellipsis");
    }
    pages.push(totalImages - 1);
    const unique: (number | "ellipsis")[] = [];
    for (const p of pages) {
      if (p === "ellipsis") {
        if (unique[unique.length - 1] !== "ellipsis") unique.push(p);
      } else if (!unique.includes(p)) {
        unique.push(p);
      }
    }
    return unique;
  };

  return (
    <section className="relative w-full py-16 sm:py-24">
      {/* Full-bleed dark radial background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, #2a2a2a 0%, #1a1a1a 50%, #0f0f0f 100%)",
        }}
      />

      <Container className="relative z-10 flex flex-col items-center">
        {/* Title */}
        <h2 className="mb-3 text-center text-2xl font-medium leading-[1.2] tracking-[-1.28px] text-[#EAEAEA] sm:text-[28px] md:text-[32px]">
          {title}
        </h2>

        {/* Description */}
        <p className="mx-auto mb-8 max-w-xl text-center text-sm leading-normal tracking-[-0.5px] text-white/70 sm:text-base md:text-lg">
          {description}
        </p>

        {/* Concrete / Paver toggle */}
        {hasToggle && (
          <div className="mb-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 p-1">
            {(["concrete", "paver"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVariant(v)}
                className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition-all ${
                  variant === v
                    ? "gradient-navy text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        )}

        {/* Main image with arrows */}
        {currentImage && (
          <div className="mb-6 flex w-full items-center gap-0 md:gap-4">
            {/* Prev — external on desktop */}
            {totalImages > 1 && (
              <button
                type="button"
                aria-label="Previous image"
                onClick={() =>
                  setActiveIndex(
                    activeIndex > 0 ? activeIndex - 1 : totalImages - 1
                  )
                }
                className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white/20 md:flex"
              >
                <ArrowRight className="h-5 w-5 rotate-180" />
              </button>
            )}

            {/* Image container */}
            <div className="relative min-w-0 flex-1">
              <div
                className="group relative aspect-video cursor-pointer overflow-hidden rounded-xl shadow-2xl"
                onClick={() => openLightbox(activeIndex)}
              >
                <Image
                  src={currentImage}
                  alt={`Project ${activeIndex + 1}`}
                  fill
                  sizes="(min-width: 1024px) 800px, 100vw"
                  className="object-cover transition-opacity duration-300"
                />
                {/* Zoom hint on hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/20">
                  <ZoomIn className="h-10 w-10 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-80" />
                </div>
              </div>

              {/* Internal arrows — mobile only */}
              {totalImages > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(
                        activeIndex > 0 ? activeIndex - 1 : totalImages - 1
                      );
                    }}
                    className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition-all duration-300 hover:bg-black/50 md:hidden"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(
                        activeIndex < totalImages - 1 ? activeIndex + 1 : 0
                      );
                    }}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition-all duration-300 hover:bg-black/50 md:hidden"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>

            {/* Next — external on desktop */}
            {totalImages > 1 && (
              <button
                type="button"
                aria-label="Next image"
                onClick={() =>
                  setActiveIndex(
                    activeIndex < totalImages - 1 ? activeIndex + 1 : 0
                  )
                }
                className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white/20 md:flex"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Numbered pagination */}
        {totalImages > 1 && (
          <div className="mb-8 flex items-center gap-2">
            {buildPagination().map((page, idx) => {
              if (page === "ellipsis") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="flex h-10 w-10 items-center justify-center text-sm text-white/50"
                  >
                    ...
                  </span>
                );
              }
              const isActive = page === activeIndex;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setActiveIndex(page)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "gradient-navy text-white shadow-lg"
                      : "border border-white/20 text-white/70 hover:border-white/50 hover:text-white"
                  }`}
                >
                  {page + 1}
                </button>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <SmartLink
          href={ctaLink}
          className="gradient-navy inline-flex items-center gap-2 rounded-[10px] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:brightness-110"
        >
          {ctaText}
          <ArrowUpRight className="h-4 w-4" />
        </SmartLink>
      </Container>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={lightboxPrev}
          onNext={lightboxNext}
        />
      )}
    </section>
  );
}
