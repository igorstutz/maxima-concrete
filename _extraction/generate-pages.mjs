// Gera src/app/<rota>/page.tsx para todas as páginas dirigidas por JSON de seções.
// SEO (title/description) vem de pages-seo.json (extraído do site antigo).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const APP = join(ROOT, "src", "app");

// rota → pageKey (espelho de src/lib/routes.ts, sem home e sem as especiais)
const ROUTES = {
  "/services/driveways": "drivewayshub_page",
  "/services/driveways/driveways-concrete": "driveways_page",
  "/services/driveways/driveways-paver": "paverdriveways_page",
  "/services/patios": "patioshub_page",
  "/services/patios/patios-concrete": "patios_page",
  "/services/patios/patios-paver": "paverpatios_page",
  "/services/slabs": "slabs_page",
  "/services/porches": "porches_page",
  "/services/sidewalks": "sidewalks_page",
  "/services/footers": "footers_page",
  "/services/sports-courts": "sportscourts_page",
  "/services/steps": "steps_page",
  "/services/garage-floors": "garagefloors_page",
  "/services/curbs-gutters": "curbsgutters_page",
  "/services/approaches": "approaches_page",
  "/services/basement-floors": "basementfloors_page",
  "/services/fire-pits": "firepits_page",
  "/services/seating-walls": "seatingwalls_page",
  "/services/retaining-walls": "retainingwalls_page",
  "/services/fireplaces": "fireplaces_page",
  "/services/outdoor-living": "outdoorliving_page",
  "/services/outdoor-lighting": "outdoorlighting_page",
  "/services/outdoor-kitchens": "outdoorkitchens_page",
  "/services/shelters": "shelters_page",
  "/services/pool-decks-surrounds": "pool_decks_page",
  "/gallery": "gallery_page",
  "/gallery/pools": "gallerypools_page",
  "/gallery/patios": "gallerypatios_page",
  "/gallery/sidewalks": "gallerysidewalks_page",
  "/gallery/porches-steps": "galleryporchessteps_page",
  "/gallery/driveways": "gallerydriveways_page",
  "/gallery/pavers": "gallerypavers_page",
  "/gallery/commercial": "gallerycommercial_page",
  "/gallery/garage-floor-barn": "gallerygaragebarn_page",
  "/gallery/sport-court": "gallerysportcourt_page",
  "/finishes": "finishes_page",
  "/finishes/broom": "finishesbroom_page",
  "/finishes/colored-broom": "finishescoloredbroom_page",
  "/finishes/stamped-colored": "finishesstampedcolored_page",
  "/finishes/smooth": "finishessmooth_page",
  "/finishes/buff-wash-exposed": "finishesbuffwash_page",
  "/commercial": "commercial_page",
  "/commercial-concrete": "commercialconcrete_page",
  "/commercial-pools": "commercialpools_page",
  "/why-maxima": "whymaxima_page",
  "/join-our-team": "joinourteam_page",
  "/contact-us": "contactus_page",
  "/areas-we-serve": "areaswe_serve_page",
  "/areas-we-serve/columbus": "areascolumbus_page",
};

// pages-seo.json é keyed por arquivo antigo; index por pageKey
const seoRaw = JSON.parse(
  readFileSync(join(HERE, "pages-seo.json"), "utf8").replace(/^﻿/, "")
);
const seoByPageKey = {};
for (const entry of Object.values(seoRaw)) {
  if (entry.pageKey) seoByPageKey[entry.pageKey] = entry;
}

const esc = (s) => (s || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');

let created = 0;
for (const [route, pageKey] of Object.entries(ROUTES)) {
  const seo = seoByPageKey[pageKey] || {};
  const title = seo.title ? `Maxima Concrete - ${seo.title}` : null;
  const canonical = seo.canonicalPath || route;

  const metaLines = [
    title ? `  title: "${esc(title)}",` : null,
    seo.description ? `  description: "${esc(seo.description)}",` : null,
    `  alternates: { canonical: "${esc(canonical)}/" },`,
  ].filter(Boolean).join("\n");

  const src = `import type { Metadata } from "next";
import page from "@/content/pages/${pageKey}.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
${metaLines}
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
`;

  const dir = join(APP, ...route.split("/").filter(Boolean));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "page.tsx"), src);
  created++;
}

console.log(`páginas geradas: ${created}`);
