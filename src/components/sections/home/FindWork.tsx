"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";

interface FindWorkContent {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

/**
 * Versão leve do "Find Our Work Near You": sem Leaflet.
 * A busca por ZIP encaminha para /project-map/?zip=<valor>, onde o mapa
 * completo é carregado.
 */
export default function FindWork({ content }: { content: Record<string, any> }) {
  const c = content as FindWorkContent;
  const router = useRouter();
  const [zipCode, setZipCode] = useState("");

  const ctaText = c.ctaText || "View Project Map";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(zipCode ? `/project-map/?zip=${zipCode}` : "/project-map/");
  };

  return (
    <section id="find-work" className="scroll-mt-24 bg-white py-16 lg:py-24">
      <Container>
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:gap-16">
          {/* Esquerda — texto + busca por ZIP */}
          <div className="flex w-full flex-col gap-4 lg:w-[460px] lg:shrink-0 lg:gap-6">
            <div>
              <div className="mb-2 flex items-center gap-3 lg:mb-3">
                <h2 className="text-2xl font-bold leading-[110%] tracking-[-1px] text-navy md:text-[32px] lg:text-[36px]">
                  {c.title}
                </h2>
                <Image
                  src="/images/assets/maxima-logo-icon.png"
                  alt="Maxima Concrete"
                  width={40}
                  height={40}
                  className="h-8 w-auto shrink-0 opacity-90 lg:h-10"
                />
              </div>
              <p className="text-sm leading-[160%] text-gray-600 lg:text-[15px]">
                {c.subtitle}
              </p>
            </div>

            {/* Busca por ZIP */}
            <form onSubmit={handleSearch}>
              <label
                htmlFor="findwork-zip"
                className="mb-1.5 block text-xs font-medium text-navy lg:mb-2 lg:text-sm"
              >
                Your Location
              </label>
              <div className="flex gap-2">
                <input
                  id="findwork-zip"
                  type="text"
                  inputMode="numeric"
                  value={zipCode}
                  onChange={(e) =>
                    setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))
                  }
                  placeholder="ZIP Code"
                  className="max-w-[160px] flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/40 lg:max-w-[180px] lg:px-4"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-ocean px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy lg:gap-2 lg:px-5"
                >
                  Search <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Direita — prévia do mapa (imagem estática) linkando para o mapa completo */}
          <Link
            href="/project-map/"
            className="group relative block h-[280px] w-full overflow-hidden rounded-xl sm:h-[340px] lg:h-[420px] lg:min-w-0 lg:flex-1 lg:rounded-2xl"
          >
            <Image
              src="/images/assets/project-map-hero.jpg"
              alt="Map of Maxima Concrete projects across Central Ohio"
              fill
              sizes="(min-width: 1024px) 700px, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <span className="absolute inset-0 bg-navy/30 transition-colors group-hover:bg-navy/40" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="gradient-navy inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white shadow-md transition-opacity group-hover:opacity-90 lg:text-base">
                {ctaText}
                <ArrowRight className="h-4 w-4" />
              </span>
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
