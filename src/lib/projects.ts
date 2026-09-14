/**
 * Os projetos que viram pinos no mapa — gerados de `_extraction/project-map.xlsx`
 * por `_extraction/build-projects.mjs`.
 *
 * `street` é a coluna B da planilha: rua, cidade e estado, SEM o número da casa.
 * O número existe só na coluna A e nunca sai do script de build — este arquivo é
 * importado pelos componentes do mapa, ou seja, chega inteiro ao navegador, e não
 * tira o endereço completo de ~2.600 clientes de trás de um popup.
 */
export interface Project {
  /** Serviços feitos na obra, ex. "Driveway, Steps, Walkway" (coluna C). */
  work: string;
  /** Rua sem número, ex. "Larrimer Avenue, Worthington, OH" (coluna B). */
  street: string;
  /** ZIP quando conhecido — usado pela busca por raio, não é exibido. */
  zip: string;
  lat: number;
  lng: number;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Popup do pino: o que foi feito e onde. Mesmo conteúdo em todos os mapas do site. */
export function projectPopupHtml(p: Project): string {
  return (
    '<div style="font-family:Poppins,sans-serif;font-size:13px;line-height:1.45;">' +
    `<strong>${escapeHtml(p.work || "Concrete")}</strong>` +
    (p.street ? `<br/><span style="color:#4b5563;">${escapeHtml(p.street)}</span>` : "") +
    "</div>"
  );
}
