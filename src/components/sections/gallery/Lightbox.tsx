"use client";

import { useEffect } from "react";
import { ArrowRight, X } from "lucide-react";
import Image from "@/components/Image";

interface LightboxProps {
  images: string[];
  index: number;
  /** Optional concrete/paver tag shown above the image */
  tag?: "concrete" | "paver" | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

/** Fullscreen lightbox shared by the gallery sections (Escape/arrow keys). */
export function Lightbox({
  images,
  index,
  tag,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const total = images.length;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, onPrev, onNext]);

  const src = images[index];
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        type="button"
        aria-label="Close lightbox"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Counter */}
      <div className="absolute left-1/2 top-5 -translate-x-1/2 text-sm text-white/70">
        {index + 1} / {total}
      </div>

      {/* Prev arrow */}
      {total > 1 && (
        <button
          type="button"
          aria-label="Previous image"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 md:left-6"
        >
          <ArrowRight className="h-6 w-6 rotate-180" />
        </button>
      )}

      {/* Image */}
      <div
        className="relative h-[85vh] w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={`Project ${index + 1}`}
          fill
          sizes="90vw"
          className="object-contain"
        />
      </div>

      {/* Concrete/paver tag */}
      {tag && (
        <span
          onClick={(e) => e.stopPropagation()}
          className={`absolute left-1/2 top-16 -translate-x-1/2 rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm sm:text-sm ${
            tag === "paver" ? "bg-amber-700/80" : "bg-ocean/80"
          }`}
        >
          {tag}
        </span>
      )}

      {/* Next arrow */}
      {total > 1 && (
        <button
          type="button"
          aria-label="Next image"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 md:right-6"
        >
          <ArrowRight className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
