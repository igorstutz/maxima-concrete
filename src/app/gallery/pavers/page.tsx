import type { Metadata } from "next";
import page from "@/content/pages/gallerypavers_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Pavers Gallery",
  description: "Paver installation gallery by Maxima Concrete. Browse our paver driveway, patio & walkway projects in Ohio.",
  alternates: { canonical: "/gallery/pavers/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
