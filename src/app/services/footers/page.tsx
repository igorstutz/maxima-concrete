import type { Metadata } from "next";
import page from "@/content/pages/footers_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Footers & Structural Support",
  description: "Concrete footers and structural support for decks, porches, and additions in Ohio. Reliable foundation work by Maxima Concrete.",
  alternates: { canonical: "/services/footers/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
