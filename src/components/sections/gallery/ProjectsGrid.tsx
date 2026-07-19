"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ZoomIn } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { legacyAsset } from "@/components/sections/home/legacy";
import { Lightbox } from "./Lightbox";

type ImageTag = "concrete" | "paver" | null;

/**
 * Featured projects mosaic on white background (1 large + 2 stacked + 3 equal)
 * with lightbox and optional concrete/paver tags on split gallery pages.
 */
export default function ProjectsGrid({
  content,
}: {
  content: Record<string, any>;
}) {
  const pathname = usePathname() || "";
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const concreteImages: string[] = (content?.images || []).map(legacyAsset);
  const paverImages: string[] = (content?.paverImages || []).map(legacyAsset);
  const imageTypes: string[] = content?.imageTypes || [];
  const isSplitPage = /\/gallery\/(patios|driveways)/.test(pathname);
  const showTags =
    isSplitPage ||
    paverImages.length > 0 ||
    imageTypes.some((t) => t === "paver");

  const imageItems: { url: string; type: ImageTag }[] = [
    ...concreteImages.map((url, i) => ({
      url,
      type: (showTags
        ? imageTypes[i] === "paver"
          ? "paver"
          : "concrete"
        : null) as ImageTag,
    })),
    ...paverImages.map((url) => ({ url, type: "paver" as const })),
  ];
  const images = imageItems.map((i) => i.url);
  const totalImages = images.length;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  const lightboxPrev = () =>
    setLightboxIndex((i) => (i > 0 ? i - 1 : totalImages - 1));
  const lightboxNext = () =>
    setLightboxIndex((i) => (i < totalImages - 1 ? i + 1 : 0));

  const renderImage = (
    img: string,
    index: number,
    heightClass: string,
    sizes: string
  ) => {
    const tag = imageItems[index]?.type;
    return (
      <div
        className="cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:ring-2 hover:ring-ocean"
        onClick={() => openLightbox(index)}
      >
        <div className={`group relative w-full ${heightClass}`}>
          <Image
            src={img}
            alt={`Project ${index + 1}`}
            fill
            sizes={sizes}
            className="object-cover"
          />
          {tag && (
            <span
              className={`absolute left-2 top-2 z-10 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm sm:text-xs ${
                tag === "paver" ? "bg-amber-700/80" : "bg-ocean/80"
              }`}
            >
              {tag}
            </span>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/20">
            <ZoomIn className="h-8 w-8 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-80" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="relative w-full bg-white py-12 md:py-16">
      <Container>
        {content?.title && (
          <h2 className="mb-8 text-center text-2xl font-medium leading-[1.2] tracking-[-1.28px] text-navy sm:text-[28px] md:mb-12 md:text-[32px]">
            {content.title}
          </h2>
        )}

        {images.length > 0 && (
          <div className="flex flex-col gap-4">
            {/* Top row — 1 large + 2 stacked */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {images[0] && (
                <div className="col-span-2 md:col-span-3">
                  {renderImage(
                    images[0],
                    0,
                    "h-[260px] sm:h-[340px] md:h-[420px]",
                    "(min-width: 1024px) 720px, 100vw"
                  )}
                </div>
              )}
              <div className="col-span-2 grid grid-cols-2 gap-4 md:grid-cols-1">
                {images[1] &&
                  renderImage(
                    images[1],
                    1,
                    "h-[160px] sm:h-[200px] md:h-[202px]",
                    "(min-width: 1024px) 480px, 50vw"
                  )}
                {images[2] &&
                  renderImage(
                    images[2],
                    2,
                    "h-[160px] sm:h-[200px] md:h-[202px]",
                    "(min-width: 1024px) 480px, 50vw"
                  )}
              </div>
            </div>

            {/* Bottom row — 3 equal */}
            {images.length > 3 && (
              <div className="grid grid-cols-3 gap-4">
                {images.slice(3, 6).map((img, i) => (
                  <div key={i + 3}>
                    {renderImage(
                      img,
                      i + 3,
                      "h-[160px] sm:h-[220px] md:h-[320px]",
                      "(min-width: 1024px) 400px, 33vw"
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Container>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          tag={imageItems[lightboxIndex]?.type}
          onClose={() => setLightboxOpen(false)}
          onPrev={lightboxPrev}
          onNext={lightboxNext}
        />
      )}
    </section>
  );
}
