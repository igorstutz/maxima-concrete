// Recomprime in-place (mesmo caminho/formato) as imagens pesadas de public/images.
// - redimensiona para no máx. 1920px de largura
// - webp q72 / jpeg q75 (mozjpeg) / png nível máximo
// - só sobrescreve se ficar pelo menos 10% menor
import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = dirname(fileURLToPath(import.meta.url));
const IMAGES = join(HERE, "..", "public", "images");
const THRESHOLD = 250 * 1024;

function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let done = 0, saved = 0, skipped = 0, failed = 0;
for (const file of walk(IMAGES)) {
  const ext = extname(file).toLowerCase();
  if (![".webp", ".jpg", ".jpeg", ".png"].includes(ext)) continue;
  const before = statSync(file).size;
  if (before < THRESHOLD) continue;

  try {
    const input = readFileSync(file);
    let img = sharp(input).rotate().resize({ width: 1920, withoutEnlargement: true });
    if (ext === ".webp") img = img.webp({ quality: 72 });
    else if (ext === ".png") img = img.png({ compressionLevel: 9, effort: 7 });
    else img = img.jpeg({ quality: 75, mozjpeg: true });

    const out = await img.toBuffer();
    if (out.length < before * 0.9) {
      writeFileSync(file, out);
      saved += before - out.length;
      done++;
    } else {
      skipped++;
    }
  } catch (e) {
    failed++;
    console.log(`falha: ${file} — ${e.message}`);
  }
}

console.log(
  `otimizadas: ${done}; sem ganho: ${skipped}; falhas: ${failed}; economia: ${(saved / 1024 / 1024).toFixed(1)} MB`
);
