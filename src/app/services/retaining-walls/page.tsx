import type { Metadata } from "next";
import page from "@/content/pages/retainingwalls_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Retaining Walls",
  description: "Concrete retaining wall construction in Ohio. Prevent erosion and add beauty to your landscape with Maxima Concrete.",
  alternates: { canonical: "/services/retaining-walls/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
