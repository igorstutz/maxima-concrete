import type { Metadata } from "next";
import page from "@/content/pages/sidewalks_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Sidewalks & Walkways",
  description: "Custom concrete sidewalks and walkways in Ohio. Durable, stylish paths designed and installed by Maxima Concrete.",
  alternates: { canonical: "/services/sidewalks/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
