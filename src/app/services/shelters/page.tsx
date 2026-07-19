import type { Metadata } from "next";
import page from "@/content/pages/shelters_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Shelters, Pergolas & Shade Structures",
  description: "Custom shelters, pergolas and shade structures in Ohio. Beautiful and functional outdoor shade solutions by Maxima Concrete.",
  alternates: { canonical: "/services/shelters/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
