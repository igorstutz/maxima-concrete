import type { Metadata } from "next";
import page from "@/content/pages/basementfloors_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Basement Floors",
  description: "Basement floor concrete work in Ohio. Leveling, polishing & finishing for a clean, durable basement by Maxima Concrete.",
  alternates: { canonical: "/services/basement-floors/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
