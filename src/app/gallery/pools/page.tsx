import type { Metadata } from "next";
import page from "@/content/pages/gallerypools_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Pool Gallery",
  description: "Pool deck and pool area concrete gallery by Maxima Concrete. Browse our completed pool projects in Ohio.",
  alternates: { canonical: "/gallery/pools/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
