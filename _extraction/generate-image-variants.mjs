// Gera versões menores das fotos e o manifesto que o loader de imagens usa
// para montar o srcset. Sem isso o site (export estático, sem otimização do
// Next) entrega o arquivo original mesmo num card de 260px.
//
// Só entram imagens referenciadas no projeto e com largura >= MIN_WIDTH; para
// cada uma são geradas as larguras de VARIANTS menores que a original.
// Rode com --apply para gravar; sem isso é só simulação. --force regrava as
// variantes que já existem (necessário ao mudar qualidade ou larguras; no CI
// não é preciso, lá o checkout vem sem variante nenhuma).
//
// Também resolve a imagem do hero no celular (ver "hero no mobile" abaixo).
import sharp from "sharp";
import { readFileSync, readdirSync, writeFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const APPLY = process.argv.includes("--apply");
const FORCE = process.argv.includes("--force");
const VARIANTS = [480, 828, 1280, 1600, 1920];
const MIN_WIDTH = 900;
const MANIFEST = "src/lib/image-variants.json";
const HERO_MANIFEST = "src/lib/hero-mobile.json";

// Fotos de hero ocupam a tela inteira e é nelas que a compressão aparece —
// por isso vão num nível de qualidade acima do resto do site.
const QUALITY = 85;
const HERO_QUALITY = 92;

// Abaixo disto a imagem de celular não cobre um aparelho moderno (~390 CSS px
// com DPR 3 = ~1170 px físicos) e precisa ser substituída por algo maior.
const MOBILE_MIN_WIDTH = 1200;

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

/** Mesma conversão de src/components/sections/home/legacy.ts. */
const legacyAsset = (path) => {
  if (!path) return "";
  const m = path.match(/^\/assets\/(.+?)-[\w-]{8}\.(?:jpg|jpeg|png|webp)$/);
  return m ? `/images/assets/${m[1]}.webp` : path;
};

const publicPath = (url) => "public" + url;
const metaOf = async (url) => {
  const file = publicPath(url);
  if (!existsSync(file)) return null;
  try {
    return await sharp(file).metadata();
  } catch {
    return null;
  }
};

// ---------- conteúdo: quais imagens são de hero e quais são de celular ----------
const PAGES_DIR = "src/content/pages";
const heroImages = new Set();
const mobilePairs = [];

for (const file of readdirSync(PAGES_DIR).filter((f) => f.endsWith(".json"))) {
  const page = JSON.parse(readFileSync(join(PAGES_DIR, file), "utf8"));
  for (const section of page.sections) {
    const c = section.content || {};
    const desktop = legacyAsset(c.backgroundImage);
    const mobile = legacyAsset(c.backgroundImageMobile);
    if (/hero/i.test(section.type)) {
      if (desktop) heroImages.add(desktop);
      if (mobile) heroImages.add(mobile);
    }
    if (mobile) mobilePairs.push({ pageKey: page.pageKey, mobile, desktop });
  }
}

// ---------- hero no mobile ----------
// As imagens "-mobile" vieram do CMS antigo com 768 px de largura, o que num
// celular atual é esticado e borra. Quando a de desktop é maior, ela passa a
// ser a fonte do <source> mobile:
//   • mesma proporção  -> usa a própria imagem de desktop (enquadramento igual);
//   • proporções diferentes (arte vertical) -> recorta a de desktop na
//     proporção da mobile, na maior resolução que a foto permitir.
// O resultado vai para hero-mobile.json, que o Hero lê para trocar o src.
const heroMobile = {};
const cropped = new Set();
const mobileReport = [];

for (const { pageKey, mobile, desktop } of mobilePairs) {
  const m = await metaOf(mobile);
  if (!m?.width) continue;
  if (m.width >= MOBILE_MIN_WIDTH) {
    mobileReport.push({ pageKey, from: m.width, to: m.width, how: "já grande" });
    continue;
  }
  if (!desktop) continue;
  const d = await metaOf(desktop);
  if (!d?.width || d.width <= m.width) continue;

  const mobileAspect = m.width / m.height;
  const desktopAspect = d.width / d.height;

  if (Math.abs(mobileAspect - desktopAspect) / desktopAspect < 0.1) {
    heroMobile[mobile] = desktop;
    mobileReport.push({ pageKey, from: m.width, to: d.width, how: "desktop" });
    continue;
  }

  // Recorte central na proporção da imagem de celular.
  const cropWidth = Math.min(d.width, Math.round(d.height * mobileAspect));
  const cropHeight = Math.min(d.height, Math.round(cropWidth / mobileAspect));
  // Arte vertical recortada de uma foto 16:9 fica limitada pela ALTURA da
  // original: 1920x1080 vira 810 de largura, quase o mesmo 768 de antes. Nesses
  // casos não vale criar arquivo — a página fica no relatório como "sem
  // material" e só melhora com uma foto vertical nova enviada pelo painel.
  if (cropWidth < m.width * 1.3) {
    mobileReport.push({ pageKey, from: m.width, to: cropWidth, how: "SEM MATERIAL" });
    continue;
  }

  const out = desktop.replace(/\.(webp|jpe?g|png)$/i, "-mobilecrop.webp");
  if (APPLY && (FORCE || !existsSync(publicPath(out)))) {
    const buf = await sharp(publicPath(desktop))
      .resize({ width: cropWidth, height: cropHeight, fit: "cover", position: "centre" })
      .webp({ quality: HERO_QUALITY, effort: 6 })
      .toBuffer();
    writeFileSync(publicPath(out), buf);
  }
  heroMobile[mobile] = out;
  cropped.add(out);
  mobileReport.push({ pageKey, from: m.width, to: cropWidth, how: "recorte" });
}

// ---------- variantes ----------
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
  // Os recortes de hero são referenciados só pelo hero-mobile.json (gerado
  // agora), então não estariam no haystack ainda.
  if (!cropped.has(url) && !haystack.includes(url) && !haystack.includes(name)) continue;

  let meta;
  try {
    meta = await sharp(file).metadata();
  } catch {
    unreadable++;
    continue;
  }
  if (!meta.width || meta.width < MIN_WIDTH) continue;

  // Só vale gerar quando a variante é bem menor que a original: a 1200 de uma
  // foto de 1440 pesa quase o mesmo e só ocuparia espaço no deploy. Exceção
  // para originais que não são webp (JPEG/PNG que o painel recebe): aí mesmo
  // uma variante da largura quase cheia economiza muito, e sem ela o navegador
  // baixaria os 3 MB do arquivo cru.
  const ratio = meta.format === "webp" ? 0.7 : 1;
  const widths = VARIANTS.filter((w) => w <= meta.width * ratio);
  if (!widths.length) continue;
  eligible++;
  manifest[url] = widths;

  const quality = heroImages.has(url) || cropped.has(url) ? HERO_QUALITY : QUALITY;

  for (const width of widths) {
    const out = file.replace(/\.(webp|jpe?g|png)$/i, `-${width}w.webp`);
    if (existsSync(out) && !FORCE) {
      extraBytes += statSync(out).size;
      continue;
    }
    const buf = await sharp(file)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toBuffer();
    extraBytes += buf.length;
    written++;
    if (APPLY) writeFileSync(out, buf);
  }
}

console.log(`${APPLY ? "APLICANDO" : "SIMULAÇÃO"}${FORCE ? " (--force)" : ""}`);
console.log(`  imagens com variantes: ${eligible}`);
console.log(`  arquivos gerados: ${written}`);
console.log(`  espaço extra: ${(extraBytes / 1048576).toFixed(1)} MB`);
if (unreadable) console.log(`  ilegíveis (ignoradas): ${unreadable}`);

const trocados = mobileReport.filter((r) => r.how !== "já grande");
console.log(`  hero no mobile: ${trocados.length} páginas com fonte melhor`);
for (const r of trocados) {
  console.log(`    ${r.pageKey}: ${r.from}px -> ${r.to}px (${r.how})`);
}

if (APPLY) {
  writeFileSync(MANIFEST, JSON.stringify(manifest) + "\n");
  writeFileSync(HERO_MANIFEST, JSON.stringify(heroMobile, null, 2) + "\n");
  const size = statSync(MANIFEST).size;
  console.log(`  manifesto: ${MANIFEST} (${(size / 1024).toFixed(0)} KB, ${Object.keys(manifest).length} entradas)`);
  console.log(`  hero mobile: ${HERO_MANIFEST} (${Object.keys(heroMobile).length} entradas)`);
} else {
  const size = Buffer.byteLength(JSON.stringify(manifest));
  console.log(`  manifesto teria ${(size / 1024).toFixed(0)} KB (${Object.keys(manifest).length} entradas)`);
}
