import type { Metadata } from "next";
import page from "@/content/pages/garagefloors_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Garage Floors",
  description: "Professional garage floor coating and concrete installation in Ohio. Epoxy, polished & decorative finishes by Maxima Concrete.",
  alternates: { canonical: "/services/garage-floors/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
