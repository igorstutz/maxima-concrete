import variants from "./image-variants.json";

/**
 * Loader de imagens do build estático. O Next chama esta função uma vez por
 * largura de `deviceSizes`/`imageSizes` para montar o srcset; aqui trocamos o
 * arquivo original pela variante mais próxima, quando ela existe.
 *
 * O manifesto (`image-variants.json`) é gerado por
 * `_extraction/generate-image-variants.mjs` e lista, por imagem, as larguras
 * disponíveis. Imagens fora dele (pequenas, remotas, OG) seguem servidas
 * como estão.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const TABLE = variants as Record<string, number[]>;

export default function imageLoader({ src, width }: { src: string; width: number }): string {
  // O componente Image já prefixa com o basePath; o manifesto usa o caminho cru.
  const path = BASE && src.startsWith(BASE) ? src.slice(BASE.length) : src;

  const widths = TABLE[path];
  if (!widths) return src;

  // menor variante que ainda cobre a largura pedida; nenhuma serve -> original
  const pick = widths.find((w) => w >= width);
  if (!pick) return src;

  return `${BASE}${path.replace(/\.(webp|jpe?g|png)$/i, `-${pick}w.webp`)}`;
}
