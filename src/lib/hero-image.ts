import { getImageProps } from "next/image";
import { asset } from "@/lib/base-path";
import heroMobile from "@/lib/hero-mobile.json";
import { legacyAsset } from "@/components/sections/home/legacy";

/**
 * Fundo dos heros (a imagem que ocupa a tela inteira no topo das páginas).
 *
 * Dois problemas que este módulo resolve, iguais em todos os heros do site:
 *
 * 1. As imagens "-mobile" herdadas do CMS antigo têm 768 px de largura. Um
 *    celular atual pede ~1170 px físicos (390 CSS × DPR 3), então elas
 *    apareciam esticadas e borradas. `hero-mobile.json` — gerado por
 *    _extraction/generate-image-variants.mjs — aponta cada uma para uma fonte
 *    de resolução suficiente: a própria foto de desktop, quando o
 *    enquadramento é o mesmo, ou um recorte dela na proporção vertical.
 *
 * 2. Os heros usavam `unoptimized`, o que descarta o srcset e entrega sempre o
 *    arquivo original. Sem isso, o loader monta o srcset com as variantes.
 */
const MOBILE_SOURCES = heroMobile as Record<string, string>;

/** Melhor arquivo disponível para o <source> de celular. */
export function heroMobileSource(path?: string): string {
  const raw = legacyAsset(path);
  if (!raw) return "";
  return MOBILE_SOURCES[raw] || raw;
}

interface HeroPictureOptions {
  desktop?: string;
  mobile?: string;
  alt?: string;
  /** Proporção declarada ao next/image; a imagem é sempre object-cover. */
  width?: number;
  height?: number;
}

/**
 * Props do <img> de desktop e do <source> de celular, já com srcset.
 * Cada hero monta o próprio <picture> com suas classes.
 */
export function heroPicture({
  desktop,
  mobile,
  alt = "",
  width = 1920,
  height = 1080,
}: HeroPictureOptions) {
  const desktopSrc = legacyAsset(desktop);
  const imgProps = desktopSrc
    ? getImageProps({
        alt,
        src: asset(desktopSrc),
        width,
        height,
        priority: true,
        sizes: "100vw",
      }).props
    : null;

  const mobileSrc = heroMobileSource(mobile);
  const mobileProps = mobileSrc
    ? getImageProps({
        alt,
        src: asset(mobileSrc),
        width: 1200,
        height: 1600,
        priority: true,
        sizes: "100vw",
      }).props
    : null;

  return { imgProps, mobileProps };
}
