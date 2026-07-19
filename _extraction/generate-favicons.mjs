// Gera favicon.ico + PNGs de ícone a partir do logo da Maxima Concrete.
// O .ico é um contêiner com PNGs embutidos (16/32/48), aceito por todos
// os browsers modernos.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = dirname(fileURLToPath(import.meta.url));
const PUB = join(HERE, "..", "public");
const SRC = join(PUB, "images", "logo", "maxima-logo-icon.png");

const logo = readFileSync(SRC);

// logo 137×115 → quadrado com transparência (contain)
async function squarePng(size, background = { r: 0, g: 0, b: 0, alpha: 0 }) {
  return sharp(logo)
    .resize(size, size, { fit: "contain", background })
    .png()
    .toBuffer();
}

function buildIco(pngs) {
  // header (6 bytes) + N directory entries (16 bytes cada) + blobs PNG
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const entries = [];
  let offset = 6 + 16 * count;
  for (const { size, buf } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // largura
    e.writeUInt8(size >= 256 ? 0 : size, 1); // altura
    e.writeUInt8(0, 2); // paleta
    e.writeUInt8(0, 3); // reservado
    e.writeUInt16LE(1, 4); // planes
    e.writeUInt16LE(32, 6); // bpp
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += buf.length;
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.buf)]);
}

const sizes = [16, 32, 48];
const pngs = [];
for (const size of sizes) pngs.push({ size, buf: await squarePng(size) });
writeFileSync(join(PUB, "favicon.ico"), buildIco(pngs));

writeFileSync(join(PUB, "icon-32.png"), await squarePng(32));
writeFileSync(join(PUB, "icon-192.png"), await squarePng(192));
writeFileSync(join(PUB, "icon-512.png"), await squarePng(512));
// apple-touch-icon: fundo branco (iOS não lida bem com transparência)
writeFileSync(
  join(PUB, "apple-touch-icon.png"),
  await squarePng(180, { r: 255, g: 255, b: 255, alpha: 1 })
);

console.log("ícones gerados: favicon.ico, icon-32/192/512.png, apple-touch-icon.png");
