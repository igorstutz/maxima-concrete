import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/Container";
import { asset } from "@/lib/base-path";
import { legacyAsset } from "./legacy";
import { SmartLink } from "./SmartLink";

interface PoolDecksContent {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  cta2Text?: string;
  cta2Link?: string;
  videoUrl?: string;
  backgroundImage?: string;
  posterImage?: string;
}

export default function PoolDecks({ content }: { content: Record<string, any> }) {
  const c = content as PoolDecksContent;
  const backgroundImage =
    legacyAsset(c.backgroundImage) || "/images/assets/pool-decks.webp";
  const poster = legacyAsset(c.posterImage) || backgroundImage;

  // Vídeo em HTML bruto: garante o atributo `muted` no HTML estático
  // (necessário para autoplay) sem transformar a seção em client component.
  const videoHtml = c.videoUrl
    ? `<video autoplay loop muted playsinline preload="metadata" poster="${asset(poster)}" class="absolute inset-0 h-full w-full object-cover"><source src="${c.videoUrl}" type="video/mp4" /></video>`
    : "";

  return (
    <section
      id="pool-decks"
      className="relative mt-6 h-[70vh] overflow-hidden md:h-[80vh] lg:h-screen"
    >
      {/* Fundo: vídeo ou imagem */}
      {c.videoUrl ? (
        <div
          className="absolute inset-0"
          dangerouslySetInnerHTML={{ __html: videoHtml }}
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${asset(backgroundImage)})` }}
        />
      )}

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Conteúdo ancorado embaixo */}
      <div className="relative z-10 flex h-full flex-col justify-end pb-12 md:pb-16">
        <Container>
          <div className="flex flex-col gap-3 md:gap-4">
            <h2 className="text-3xl font-normal leading-tight text-white md:text-4xl lg:text-[36px]">
              {c.title}
            </h2>
            <p className="max-w-[365px] text-sm font-medium text-white md:text-base">
              {c.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <SmartLink
                href={c.ctaLink}
                className="gradient-navy flex w-fit items-center justify-center gap-2.5 rounded-[5px] px-5 py-2.5 text-center text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:brightness-110"
              >
                {c.ctaText}
                <ArrowUpRight className="h-4 w-4" />
              </SmartLink>

              {(c.cta2Text || c.cta2Link) && (
                <SmartLink
                  href={c.cta2Link}
                  className="flex w-fit items-center justify-center gap-2.5 rounded-[5px] bg-white px-5 py-2.5 text-center text-sm font-medium text-[#1D3F5E] transition-all duration-300 hover:brightness-95"
                >
                  {c.cta2Text || "Explore Pool Decks"}
                  <ArrowUpRight className="h-4 w-4" />
                </SmartLink>
              )}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
