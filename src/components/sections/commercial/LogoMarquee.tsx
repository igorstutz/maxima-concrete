import Image from "@/components/Image";
import { legacyAsset } from "@/components/sections/home/legacy";

/**
 * Faixa de logos de clientes em loop contínuo. Os logos são duplicados para
 * que a volta seja imperceptível (a animação anda -50% e reinicia).
 *
 * `variant="light"` deixa os logos em branco monocromático, para usar sobre
 * fundo escuro.
 */
export default function LogoMarquee({
  logos,
  variant = "dark",
  className = "",
}: {
  logos?: string[];
  variant?: "dark" | "light";
  className?: string;
}) {
  const list = logos?.filter(Boolean) ?? [];
  if (list.length === 0) return null;
  const items = [...list, ...list];

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="logo-marquee flex w-max items-center gap-12 whitespace-nowrap md:gap-16">
        {items.map((logo, idx) => (
          <Image
            key={idx}
            src={legacyAsset(logo)}
            alt=""
            width={160}
            height={64}
            className={`h-12 w-auto shrink-0 object-contain md:h-16 ${
              variant === "light" ? "opacity-90 brightness-0 invert" : ""
            }`}
            loading="lazy"
          />
        ))}
      </div>

      <style>{`
        @keyframes logoMarqueeKf { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .logo-marquee { animation: logoMarqueeKf 30s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .logo-marquee { animation: none; } }
      `}</style>
    </div>
  );
}
