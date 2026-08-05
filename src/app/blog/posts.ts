/** Um bloco do corpo do post — mantém o JSON simples de editar no painel. */
export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO (YYYY-MM-DD). */
  date: string;
  author?: string;
  readingMinutes?: number;
  image?: string;
  body: BlogBlock[];
}

/** "2026-08-05" -> "August 5, 2026" (sem depender do fuso do build). */
export function formatPostDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}
