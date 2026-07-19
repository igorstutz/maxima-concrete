import type { Metadata } from "next";
import page from "@/content/pages/patioshub_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Patios",
  description: "Concrete and paver patios by Maxima Concrete. Explore our patio options and find the perfect style for your Ohio backyard. Free estimates.",
  alternates: { canonical: "/services/patios/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
