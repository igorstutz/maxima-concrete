/** Só permite <b>/<strong>/<br> vindos do CMS (paridade com o site antigo). */
export const sanitizeHtml = (html: string): string =>
  (html || "")
    .replace(/<(?!\/?(b|strong|br)\b)[^>]*>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "");
