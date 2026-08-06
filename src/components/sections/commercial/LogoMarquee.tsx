import Image from "@/components/Image";
import { legacyAsset } from "@/components/sections/home/legacy";

/**
 * Faixa de logos de clientes em loop contínuo. Os logos são duplicados para
 * que a volta seja imperceptível (a animação anda -50% e reinicia).
 *
 * `variant="light"` (fundo escuro) apoia cada logo numa placa branca em vez de
 * silhuetá-lo: parte dos arquivos não tem transparência, e um filtro de cor
 * transformava esses logos em retângulos brancos sólidos.
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
      <div className="logo-marquee flex w-max items-center gap-8 whitespace-nowrap md:gap-10">
        {items.map((logo, idx) =>
          variant === "light" ? (
            <span
              key={idx}
              className="flex h-16 w-[168px] shrink-0 items-center justify-center rounded-xl bg-white px-4 py-3 md:h-20 md:w-[196px]"
            >
              <Image
                src={legacyAsset(logo)}
                alt=""
                width={160}
                height={64}
                className="max-h-full w-auto object-contain"
                loading="lazy"
              />
            </span>
          ) : (
            <Image
              key={idx}
              src={legacyAsset(logo)}
              alt=""
              width={160}
              height={64}
              className="h-12 w-auto shrink-0 object-contain md:h-16"
              loading="lazy"
            />
          ),
        )}
      </div>

      <style>{`
        @keyframes logoMarqueeKf { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .logo-marquee { animation: logoMarqueeKf 30s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .logo-marquee { animation: none; } }
      `}</style>
    </div>
  );
}
