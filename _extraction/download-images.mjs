// Baixa todas as imagens referenciadas no conteúdo do CMS para public/images
// e gera url-map.json (URL original -> caminho local /images/...).
import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const IMAGES_DIR = join(ROOT, "public", "images");
const STORAGE_PREFIX =
  "https://hehehpxwazvtvattiyxl.supabase.co/storage/v1/object/public/cms-images/";

const urls = readFileSync(join(HERE, "image-urls.txt"), "utf8")
  .split("\n").map((l) => l.trim()).filter(Boolean);

const sanitize = (s) =>
  decodeURIComponent(s).replace(/[?#].*$/, "").replace(/[^a-zA-Z0-9._/-]+/g, "-");

function localPathFor(url) {
  if (url.startsWith(STORAGE_PREFIX)) {
    return join("cms", sanitize(url.slice(STORAGE_PREFIX.length)));
  }
  const hash = createHash("md5").update(url).digest("hex").slice(0, 8);
  const base = sanitize(url.split("/").pop() || "file");
  return join("external", `${hash}-${base}`);
}

const map = {};
const failures = [];
let done = 0, skipped = 0;

async function download(url) {
  const rel = localPathFor(url);
  const abs = join(IMAGES_DIR, rel);
  const publicPath = "/images/" + rel.replaceAll("\\", "/");
  if (existsSync(abs)) { map[url] = publicPath; skipped++; return; }
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, buf);
    map[url] = publicPath;
    done++;
    if (done % 50 === 0) console.log(`baixadas: ${done}/${urls.length}`);
  } catch (e) {
    failures.push(`${url}\t${e.message}`);
  }
}

// concorrência 10
for (let i = 0; i < urls.length; i += 10) {
  await Promise.all(urls.slice(i, i + 10).map(download));
}

writeFileSync(join(HERE, "url-map.json"), JSON.stringify(map, null, 2));
writeFileSync(join(HERE, "download-failures.txt"), failures.join("\n"));

// copia os assets locais do site antigo (fallbacks importados via ESM)
const OLD_ASSETS = join(ROOT, "..", "maximaconcrete", "src", "assets");
if (existsSync(OLD_ASSETS)) {
  cpSync(OLD_ASSETS, join(IMAGES_DIR, "assets"), { recursive: true });
  console.log("assets locais copiados para public/images/assets");
}

console.log(`OK: ${done} baixadas, ${skipped} já existiam, ${failures.length} falhas`);
