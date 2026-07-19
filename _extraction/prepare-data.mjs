// Converte projects/service_areas/google_reviews em src/content/data/*.json,
// baixando imagens que ainda não estão em public/images.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const DATA_DIR = join(ROOT, "src", "content", "data");
const IMAGES_DIR = join(ROOT, "public", "images");
const STORAGE_PREFIX =
  "https://hehehpxwazvtvattiyxl.supabase.co/storage/v1/object/public/cms-images/";

const sanitize = (s) =>
  decodeURIComponent(s).replace(/[?#].*$/, "").replace(/[^a-zA-Z0-9._/-]+/g, "-");

async function localize(url) {
  if (!url) return null;
  let rel;
  if (url.startsWith(STORAGE_PREFIX)) rel = join("cms", sanitize(url.slice(STORAGE_PREFIX.length)));
  else {
    const hash = createHash("md5").update(url).digest("hex").slice(0, 8);
    rel = join("external", `${hash}-${sanitize(url.split("/").pop() || "file")}`);
  }
  const abs = join(IMAGES_DIR, rel);
  const publicPath = "/images/" + rel.replaceAll("\\", "/");
  if (!existsSync(abs)) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      mkdirSync(dirname(abs), { recursive: true });
      writeFileSync(abs, Buffer.from(await res.arrayBuffer()));
    } catch (e) {
      console.log(`falha ${url}: ${e.message}`);
      return url; // mantém remota em último caso
    }
  }
  return publicPath;
}

mkdirSync(DATA_DIR, { recursive: true });

// projects — só os campos usados pelo mapa
const projects = JSON.parse(readFileSync(join(HERE, "projects.json"), "utf8"))
  .filter((p) => p.lat && p.lng)
  .map((p) => ({
    name: p.name, address: p.address, city: p.city, state: p.state,
    zip: p.zip_code || "", lat: p.lat, lng: p.lng,
  }));
writeFileSync(join(DATA_DIR, "projects.json"), JSON.stringify(projects));

// service areas (ativas, ordenadas)
const areasRaw = JSON.parse(readFileSync(join(HERE, "service_areas.json"), "utf8"))
  .filter((a) => a.is_active)
  .sort((a, b) => a.position - b.position);
const areas = [];
for (const a of areasRaw) {
  areas.push({
    slug: a.slug, name: a.name, description: a.description ?? "",
    image: await localize(a.image_url),
  });
}
writeFileSync(join(DATA_DIR, "service-areas.json"), JSON.stringify(areas, null, 2));

// google reviews
const reviewsRaw = JSON.parse(readFileSync(join(HERE, "google_reviews.json"), "utf8"));
const reviews = [];
for (const r of reviewsRaw) {
  reviews.push({
    name: r.reviewer_name, rating: r.rating, comment: r.comment ?? "",
    date: r.review_time, featured: !!r.is_featured,
    photo: await localize(r.reviewer_photo_url),
  });
}
writeFileSync(join(DATA_DIR, "google-reviews.json"), JSON.stringify(reviews, null, 2));

console.log(`projects: ${projects.length}; areas: ${areas.length}; reviews: ${reviews.length}`);
