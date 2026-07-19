import type { Metadata } from "next";
import page from "@/content/pages/gallerypatios_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Patios Gallery",
  description: "Concrete patio project gallery by Maxima Concrete. See our stamped, stained & decorative patio work in Ohio.",
  alternates: { canonical: "/gallery/patios/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
