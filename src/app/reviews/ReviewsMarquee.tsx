"use client";

import { Star } from "lucide-react";

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
  photo: string | null;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatMonthYear(iso: string): string {
  const year = iso.slice(0, 4);
  const month = Number(iso.slice(5, 7));
  return `${MONTHS[month - 1] ?? ""} ${year}`.trim();
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="h-4 w-4"
          fill={i <= rating ? "#FBBF24" : "transparent"}
          stroke={i <= rating ? "#FBBF24" : "#D1D5DB"}
        />
      ))}
    </div>
  );
}

/**
 * Carrossel infinito (marquee) dos reviews — rola continuamente e pausa no
 * hover. Duplica a lista para um loop sem emenda (translateX -50%).
 */
export default function ReviewsMarquee({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;
  const items = [...reviews, ...reviews];
  // Velocidade proporcional à quantidade (mais reviews = mais tempo).
  const duration = Math.max(reviews.length * 5, 30);

  return (
    <div className="group relative overflow-hidden">
      {/* Fades nas bordas */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-surface-soft to-transparent md:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-surface-soft to-transparent md:w-20" />

      <div
        className="animate-marquee flex w-max gap-5 group-hover:[animation-play-state:paused]"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {items.map((review, i) => (
          <article
            key={i}
            className="flex w-[300px] shrink-0 flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:w-[360px]"
          >
            <div className="flex items-center gap-4">
              {review.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={review.photo}
                  alt={review.name}
                  width={48}
                  height={48}
                  loading="lazy"
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="gradient-navy flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                  {getInitials(review.name)}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold text-navy">{review.name}</p>
                <div className="mt-0.5 flex items-center gap-2">
                  <Stars rating={review.rating} />
                  <span className="text-xs text-gray-500">{formatMonthYear(review.date)}</span>
                </div>
              </div>
            </div>
            {review.comment && (
              <p className="mt-4 line-clamp-5 text-sm leading-relaxed text-[#5A6B7B]">
                {review.comment}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
