import commercial from "@/content/pages/gallerycommercial_page.json";
import driveways from "@/content/pages/gallerydriveways_page.json";
import garageBarn from "@/content/pages/gallerygaragebarn_page.json";
import patios from "@/content/pages/gallerypatios_page.json";
import pavers from "@/content/pages/gallerypavers_page.json";
import pools from "@/content/pages/gallerypools_page.json";
import porchesSteps from "@/content/pages/galleryporchessteps_page.json";
import sidewalks from "@/content/pages/gallerysidewalks_page.json";
import sportCourt from "@/content/pages/gallerysportcourt_page.json";

type Page = { sections: { content?: unknown }[] };

/** Conta as fotos de uma página de galeria (arrays de caminho de imagem). */
function countPhotos(page: Page): number {
  let total = 0;
  for (const section of page.sections) {
    const content = section.content as Record<string, unknown> | undefined;
    if (!content) continue;
    for (const value of Object.values(content)) {
      if (!Array.isArray(value)) continue;
      for (const entry of value) {
        if (typeof entry === "string" && entry.includes("/images")) total++;
        else if (
          entry &&
          typeof entry === "object" &&
          typeof (entry as { image?: unknown }).image === "string"
        )
          total++;
      }
    }
  }
  return total;
}

/**
 * Quantas fotos cada galeria tem hoje — calculado no build a partir do próprio
 * conteúdo, para os cards não exibirem números fixos que envelhecem.
 */
export const GALLERY_PHOTO_COUNTS: Record<string, number> = {
  "/gallery/commercial": countPhotos(commercial as Page),
  "/gallery/driveways": countPhotos(driveways as Page),
  "/gallery/garage-floor-barn": countPhotos(garageBarn as Page),
  "/gallery/patios": countPhotos(patios as Page),
  "/gallery/pavers": countPhotos(pavers as Page),
  "/gallery/pools": countPhotos(pools as Page),
  "/gallery/porches-steps": countPhotos(porchesSteps as Page),
  "/gallery/sidewalks": countPhotos(sidewalks as Page),
  "/gallery/sport-court": countPhotos(sportCourt as Page),
};

/** Total de fotos em todas as galerias. */
export const GALLERY_PHOTO_TOTAL = Object.values(GALLERY_PHOTO_COUNTS).reduce(
  (sum, n) => sum + n,
  0,
);

/** Aceita link com querystring ou barra final ("/gallery/patios?variant=paver"). */
export function photoCountFor(link?: string): number | undefined {
  if (!link) return undefined;
  const clean = link.split("?")[0].replace(/\/$/, "");
  return GALLERY_PHOTO_COUNTS[clean];
}
