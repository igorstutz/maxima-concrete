import type { Metadata } from "next";
import page from "@/content/pages/galleryfirepitsfireplaces_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Fire Pits & Fireplaces Gallery",
  description: "Fire pit and outdoor fireplace gallery by Maxima Concrete. Browse custom stone, paver and concrete builds across Central Ohio.",
  alternates: { canonical: "/gallery/fire-pits-fireplaces/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
