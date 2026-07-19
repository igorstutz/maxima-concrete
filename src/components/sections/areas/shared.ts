// Só permite <b>/<strong>/<br> vindos do CMS (paridade com o site antigo).
export const sanitizeHtml = (html: string): string =>
  (html || "")
    .replace(/<(?!\/?(b|strong|br)\b)[^>]*>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "");

/** Converte \n em <br/> e sanitiza (títulos multilinha com negrito do CMS). */
export const htmlWithBreaks = (text: string): string =>
  sanitizeHtml((text || "").replace(/\n/g, "<br/>"));
