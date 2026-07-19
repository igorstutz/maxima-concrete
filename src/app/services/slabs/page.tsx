import type { Metadata } from "next";
import page from "@/content/pages/slabs_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Slabs",
  description: "Durable concrete slab installation for residential and commercial projects in Ohio. Expert craftsmanship by Maxima Concrete.",
  alternates: { canonical: "/services/slabs/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
