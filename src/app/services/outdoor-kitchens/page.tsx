import type { Metadata } from "next";
import page from "@/content/pages/outdoorkitchens_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Outdoor Kitchens & Bars",
  description: "Custom outdoor kitchens and bars in Ohio. Entertain in style with concrete countertops and outdoor cooking spaces by Maxima Concrete.",
  alternates: { canonical: "/services/outdoor-kitchens/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
