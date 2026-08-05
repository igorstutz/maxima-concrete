/**
 * Cidades/condados atendidos.
 *
 * Fonte única: `src/content/data/service-areas.json` — o mesmo arquivo que gera
 * as páginas /areas-we-serve/<cidade> e o sitemap. Antes havia uma segunda cópia
 * da lista aqui, com as imagens ainda apontando para o storage do Supabase; o
 * grid mostrava fotos diferentes das páginas e o site dependia de um host externo.
 */
import areas from "@/content/data/service-areas.json";

export interface ServiceArea {
  slug: string;
  name: string;
  description: string;
  image: string;
  /** Título próprio da cidade no hero, quando o cliente enviou copy. */
  headline?: string;
  /** Parágrafo de abertura próprio da cidade. */
  intro?: string;
}

export const SERVICE_AREAS: ServiceArea[] = areas as ServiceArea[];
