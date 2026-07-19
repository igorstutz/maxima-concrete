import type { Metadata } from "next";
import page from "@/content/pages/gallerysidewalks_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Sidewalks Gallery",
  description: "Concrete sidewalk and walkway gallery by Maxima Concrete. Browse our completed projects in Ohio.",
  alternates: { canonical: "/gallery/sidewalks/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
