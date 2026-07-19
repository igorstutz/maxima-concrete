/**
 * Alguns caminhos do CMS antigo ainda apontam para assets com hash do Vite
 * ("/assets/hero-background-DbZPbLNr.jpg") ou para o domínio de preview do
 * Lovable. Estes helpers convertem para os equivalentes locais do novo site.
 */

/** "/assets/nome-HASH8.jpg" -> "/images/assets/nome.webp" (já baixado). */
export function legacyAsset(path?: string): string {
  if (!path) return "";
  const m = path.match(/^\/assets\/(.+?)-[\w-]{8}\.(?:jpg|jpeg|png|webp)$/);
  if (m) return `/images/assets/${m[1]}.webp`;
  return path;
}

/** Remove o domínio de preview do Lovable, mantendo o caminho interno. */
export function internalLink(link?: string): string {
  if (!link) return "#";
  return link.replace(/^https?:\/\/maximaconcrete\.lovable\.app/, "") || "/";
}
