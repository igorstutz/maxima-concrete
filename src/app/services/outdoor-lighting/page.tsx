import type { Metadata } from "next";
import page from "@/content/pages/outdoorlighting_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Outdoor Lighting",
  description: "Custom outdoor lighting solutions in Ohio. Enhance your landscape and hardscape with professional lighting by Maxima Concrete.",
  alternates: { canonical: "/services/outdoor-lighting/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
