import type { Metadata } from "next";
import page from "@/content/pages/areascolumbus_page.json";
import serviceAreas from "@/content/data/service-areas.json";
import { PageSections } from "@/components/sections/PageSections";
import { cityMetadata } from "../city-metadata";
import type { ServiceArea } from "@/components/sections/areas/service-areas";

const columbus = (serviceAreas as ServiceArea[]).find(
  (a) => a.slug === "columbus",
)!;

export const metadata: Metadata = cityMetadata(columbus);

// Mesma regra das demais cidades (ver ../[citySlug]/page.tsx): a foto da seção
// vem de service-areas.json, não do JSON da página — assim as 55 páginas usam
// a mesma fonte e Columbus não fica de fora quando a imagem for trocada.
const sections = page.sections.map((s) =>
  s.type === "city-approach" && columbus.image
    ? { ...s, content: { ...s.content, mainImage: columbus.image } }
    : s,
);

export default function Page() {
  return <PageSections sections={sections} />;
}
