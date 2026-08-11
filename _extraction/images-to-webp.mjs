// Converte para WebP os JPG/PNG em uso e atualiza as referências.
// Fora do escopo, de propósito:
//  - public/*.png|jpg|ico  -> favicon, ícones PWA e apple-touch-icon (Safari e
//    manifests não aceitam WebP de forma confiável)
//  - public/images/og/**   -> imagens de compartilhamento; WhatsApp, Facebook e
//    LinkedIn têm suporte irregular a WebP no preview
//  - .svg                  -> vetor, já é menor e escala melhor
// Rode com --apply para gravar; sem isso é só simulação.
import sharp from "sharp";
import { readFileSync, writeFileSync, readdirSync, statSync, unlinkSync } from "node:fs";
import { join, extname, relative } from "node:path";

const APPLY = process.argv.includes("--apply");

// --- alvos: JPG/PNG dentro de public/images, exceto og/ ---
const candidates = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (p.replace(/\\/g, "/").includes("public/images/og")) continue;
      walk(p);
    } else if (/\.(jpe?g|png)$/i.test(extname(e.name))) candidates.push(p.replace(/\\/g, "/"));
  }
})("public/images");

// --- todo o texto onde uma referência pode aparecer ---
const textFiles = [];
(function walkSrc(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walkSrc(p);
    else if (/\.(tsx?|json|css|md)$/i.test(e.name)) textFiles.push(p);
  }
})("src");
const texts = new Map(textFiles.map((f) => [f, readFileSync(f, "utf8")]));
const haystack = [...texts.values()].join("\n");

const webpTwin = (p) => p.replace(/\.(jpe?g|png)$/i, ".webp");
const publicUrl = (p) => "/" + relative("public", p).replace(/\\/g, "/");

const convert = [];
const duplicates = [];
const unused = [];
for (const file of candidates) {
  const url = publicUrl(file);
  if (existsSyncSafe(webpTwin(file))) duplicates.push(file);
  else if (haystack.includes(url)) convert.push(file);
  else unused.push(file);
}
function existsSyncSafe(p) {
  try {
    statSync(p);
    return true;
  } catch {
    return false;
  }
}

const kb = (b) => (b / 1024).toFixed(0).padStart(5) + " KB";
console.log(`${APPLY ? "APLICANDO" : "SIMULAÇÃO"} — ${convert.length} em uso para converter`);
console.log(`(${duplicates.length} já têm par .webp, ${unused.length} sem referência — não mexo)\n`);

let before = 0;
let after = 0;
let skipped = 0;

for (const file of convert) {
  const origBytes = statSync(file).size;
  const input = sharp(file);
  const meta = await input.metadata();

  // Começa em q82 e só desce se o arquivo ficaria maior que o original —
  // alguns JPEGs já vêm bem comprimidos. Para o WebP, q75 ainda equivale a um
  // JPEG de qualidade mais alta, e esses casos são fundos com sobreposição.
  let best = null;
  let mode = "";
  for (const quality of [82, 78, 75]) {
    best = await sharp(file).webp({ quality, effort: 6 }).toBuffer();
    mode = `q${quality}`;
    if (best.length < origBytes) break;
  }

  // Para PNG com transparência o lossless às vezes vence; fico com o menor.
  if (meta.hasAlpha) {
    const lossless = await sharp(file).webp({ lossless: true, effort: 6 }).toBuffer();
    if (lossless.length < best.length) {
      best = lossless;
      mode = "lossless";
    }
  }

  const url = publicUrl(file);
  const newUrl = webpTwin(url);

  if (best.length >= origBytes) {
    console.log(`  mantém ${kb(origBytes)} -> ${kb(best.length)}  ${url}  (WebP ficaria maior)`);
    skipped++;
    continue;
  }

  before += origBytes;
  after += best.length;
  console.log(
    `  ${kb(origBytes)} -> ${kb(best.length)}  (-${Math.round((1 - best.length / origBytes) * 100)}%, ${mode})  ${url}`,
  );

  if (!APPLY) continue;

  writeFileSync(webpTwin(file), best);
  unlinkSync(file);
  for (const [path, content] of texts) {
    if (!content.includes(url)) continue;
    const updated = content.split(url).join(newUrl);
    texts.set(path, updated);
    writeFileSync(path, updated);
  }
}

console.log(
  `\nconvertidos: ${convert.length - skipped} | ${(before / 1048576).toFixed(2)} MB -> ${(after / 1048576).toFixed(2)} MB` +
    (before ? ` (-${Math.round((1 - after / before) * 100)}%)` : ""),
);
if (skipped) console.log(`mantidos no formato original: ${skipped}`);

const sum = (list) => list.reduce((s, f) => s + statSync(f).size, 0);
if (duplicates.length)
  console.log(
    `\nduplicatas (já existe o .webp equivalente): ${duplicates.length} arquivos, ${(sum(duplicates) / 1048576).toFixed(2)} MB`,
  );
if (unused.length)
  console.log(
    `sem nenhuma referência no projeto: ${unused.length} arquivos, ${(sum(unused) / 1048576).toFixed(2)} MB`,
  );
