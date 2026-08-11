// Gera versões menores das fotos e o manifesto que o loader de imagens usa
// para montar o srcset. Sem isso o site (export estático, sem otimização do
// Next) entrega o arquivo original mesmo num card de 260px.
//
// Só entram imagens referenciadas no projeto e com largura >= MIN_WIDTH; para
// cada uma são geradas as larguras de VARIANTS menores que a original.
// Rode com --apply para gravar; sem isso é só simulação.
import sharp from "sharp";
import { readFileSync, readdirSync, writeFileSync, statSync, existsSync } from "node:fs";
import { join, relative, extname } from "node:path";

const APPLY = process.argv.includes("--apply");
const VARIANTS = [480, 828, 1280];
const MIN_WIDTH = 900;
const MANIFEST = "src/lib/image-variants.json";

const collect = (dir, re) => {
  const out = [];
  (function walk(d) {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name).replace(/\\/g, "/");
      if (e.isDirectory()) walk(p);
      else if (re.test(e.name)) out.push(p);
    }
  })(dir);
  return out;
};

const haystack = collect("src", /\.(tsx?|json|css|md)$/i)
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");

const isVariant = (name) => /-\d+w\.webp$/i.test(name);
const images = collect("public/images", /\.(webp|jpe?g|png)$/i).filter(
  (p) => !isVariant(p) && !p.includes("/images/og/"),
);

const manifest = {};
let eligible = 0;
let written = 0;
let extraBytes = 0;
let unreadable = 0;

for (const file of images) {
  const url = "/" + relative("public", file).replace(/\\/g, "/");
  const name = file.split("/").pop();
  if (!haystack.includes(url) && !haystack.includes(name)) continue;

  let meta;
  try {
    meta = await sharp(file).metadata();
  } catch {
    unreadable++;
    continue;
  }
  if (!meta.width || meta.width < MIN_WIDTH) continue;

  // Só vale gerar quando a variante é bem menor que a original: a 1200 de uma
  // foto de 1440 pesa quase o mesmo e só ocuparia espaço no deploy.
  const widths = VARIANTS.filter((w) => w <= meta.width * 0.7);
  if (!widths.length) continue;
  eligible++;
  manifest[url] = widths;

  for (const width of widths) {
    const out = file.replace(/\.(webp|jpe?g|png)$/i, `-${width}w.webp`);
    if (existsSync(out)) {
      extraBytes += statSync(out).size;
      continue;
    }
    const buf = await sharp(file)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();
    extraBytes += buf.length;
    written++;
    if (APPLY) writeFileSync(out, buf);
  }
}

console.log(`${APPLY ? "APLICANDO" : "SIMULAÇÃO"}`);
console.log(`  imagens com variantes: ${eligible}`);
console.log(`  arquivos gerados: ${written}`);
console.log(`  espaço extra: ${(extraBytes / 1048576).toFixed(1)} MB`);
if (unreadable) console.log(`  ilegíveis (ignoradas): ${unreadable}`);

if (APPLY) {
  writeFileSync(MANIFEST, JSON.stringify(manifest) + "\n");
  const size = statSync(MANIFEST).size;
  console.log(`  manifesto: ${MANIFEST} (${(size / 1024).toFixed(0)} KB, ${Object.keys(manifest).length} entradas)`);
} else {
  const size = Buffer.byteLength(JSON.stringify(manifest));
  console.log(`  manifesto teria ${(size / 1024).toFixed(0)} KB (${Object.keys(manifest).length} entradas)`);
}
