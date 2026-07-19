import type { Metadata } from "next";
import page from "@/content/pages/curbsgutters_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Curbs & Gutters",
  description: "Concrete curb and gutter installation in Ohio. Improve drainage and property aesthetics with Maxima Concrete.",
  alternates: { canonical: "/services/curbs-gutters/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
