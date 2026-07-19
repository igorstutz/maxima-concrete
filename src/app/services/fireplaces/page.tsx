import type { Metadata } from "next";
import page from "@/content/pages/fireplaces_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Fireplaces",
  description: "Outdoor concrete fireplace construction in Ohio. Custom-built fireplaces for your backyard by Maxima Concrete.",
  alternates: { canonical: "/services/fireplaces/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
