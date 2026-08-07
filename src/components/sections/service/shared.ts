/** Helpers compartilhados pelas seções de página de serviço. */

/**
 * Só permite ênfase, quebra de linha e lista simples vindos do CMS
 * (<b>/<strong>/<br> — herdados do site antigo — mais <ul>/<li>, para textos
 * que o cliente escreve em tópicos).
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<(?!\/?(b|strong|br|ul|li)\b)[^>]*>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "");
}
