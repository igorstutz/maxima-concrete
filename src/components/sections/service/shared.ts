/** Helpers compartilhados pelas seções de página de serviço. */

/** Só permite <b>/<strong>/<br> vindos do CMS (paridade com o site antigo). */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<(?!\/?(b|strong|br)\b)[^>]*>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "");
}
