import type { Metadata } from "next";
import page from "@/content/pages/outdoorliving_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Outdoor Living",
  description: "Custom outdoor living spaces in Ohio. Patios, fire pits, outdoor kitchens and more by Maxima Concrete.",
  alternates: { canonical: "/services/outdoor-living/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
