import { asset } from "@/lib/base-path";

/**
 * Banner oficial animado do Lyon Financial ("Website-Banner-GIF-250K"),
 * servido como MP4 em loop (547 KB) no lugar do GIF original de 12,4 MB.
 * O clique abre a página de aplicação exclusiva da Maxima — o `lid` na URL é
 * o que identifica a indicação, então não pode ser alterado.
 */
export const LYON_APPLY_URL = "https://www.lyonfinancial.net/apply/?lid=11-19241";

export function LyonBanner({ className = "" }: { className?: string }) {
  const poster = asset("/images/partners/lyon-banner-poster.webp");

  return (
    <a
      href={LYON_APPLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Lyon Financial — loan options for outdoor living: pools, pergolas, decks and landscaping. Terms up to 30 years, amounts up to $250K. Apply today (opens in a new tab)"
      className={`group block overflow-hidden rounded-2xl border border-white/10 shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${className}`}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={poster}
        className="block h-auto w-full"
        width={970}
        height={250}
      >
        <source src={asset("/images/partners/lyon-banner.mp4")} type="video/mp4" />
        {/* Fallback para navegadores sem suporte a vídeo */}
        <img
          src={poster}
          alt="Lyon Financial — financing for outdoor living projects. Apply today."
          width={970}
          height={250}
        />
      </video>
    </a>
  );
}
