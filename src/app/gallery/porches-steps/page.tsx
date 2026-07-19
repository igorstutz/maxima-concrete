import type { Metadata } from "next";
import page from "@/content/pages/galleryporchessteps_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Porches & Steps Gallery",
  description: "Concrete porch and step project gallery by Maxima Concrete. See our craftsmanship in Ohio.",
  alternates: { canonical: "/gallery/porches-steps/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
