import type { Metadata } from "next";
import page from "@/content/pages/approaches_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Approaches",
  description: "Concrete approach and apron installation in Ohio. Smooth transitions from street to driveway by Maxima Concrete.",
  alternates: { canonical: "/services/approaches/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
