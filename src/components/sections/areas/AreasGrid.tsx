"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Phone, Search, X } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SERVICE_AREAS } from "./service-areas";

/**
 * Grade de cidades/condados atendidos — type "areas-grid".
 * No site antigo a lista vinha do Supabase em runtime; aqui ela é um
 * snapshot estático (./service-areas). A busca continua client-side.
 */
export default function AreasGrid({ content }: { content: Record<string, any> }) {
  const heading: string = content?.heading || "Where We Build";
  const subheading: string = content?.subheading || "";
  const cardCtaText: string = content?.cardCtaText || "See more";

  const [query, setQuery] = useState("");

  const filteredAreas = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SERVICE_AREAS;
    return SERVICE_AREAS.filter((a) => a.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <section className="bg-white py-16 sm:py-24">
      <Container>
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          {(heading || subheading) && (
            <ScrollReveal className="max-w-2xl">
              {heading && (
                <h2 className="text-3xl font-light tracking-tight text-navy md:text-5xl">
                  {heading}
                </h2>
              )}
              {subheading && (
                <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
                  {subheading}
                </p>
              )}
            </ScrollReveal>
          )}
          <div className="relative w-full md:w-80 md:flex-shrink-0">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city..."
              className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-10 text-sm text-navy transition-all placeholder:text-gray-400 focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-navy"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {filteredAreas.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-lg text-navy">
              Didn&rsquo;t find your city? Give us a call.
            </p>
            <a
              href="tel:+16143845917"
              className="gradient-navy inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
            >
              <Phone className="h-4 w-4" /> Call (614) 384-5917
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:gap-x-8 md:gap-y-14 lg:grid-cols-3">
            {filteredAreas.map((area) => (
              <article key={area.slug} className="flex flex-col">
                <Link
                  href={`/areas-we-serve/${area.slug}/`}
                  className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100"
                  aria-label={`See concrete services in ${area.name}, OH`}
                >
                  {area.image ? (
                    <Image
                      src={area.image}
                      alt={`Concrete work in ${area.name}, OH`}
                      fill
                      sizes="(min-width: 1024px) 368px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-300">
                      No image
                    </div>
                  )}
                </Link>
                <h3 className="mt-5 text-xl font-semibold text-ocean md:text-2xl">
                  {area.name}
                </h3>
                {area.description && (
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 md:text-base">
                    {area.description}
                  </p>
                )}
                <Link
                  href={`/areas-we-serve/${area.slug}/`}
                  className="gradient-navy mt-4 inline-flex items-center gap-2 self-start rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-110"
                >
                  {cardCtaText}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
