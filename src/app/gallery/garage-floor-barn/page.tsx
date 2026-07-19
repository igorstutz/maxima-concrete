import type { Metadata } from "next";
import page from "@/content/pages/gallerygaragebarn_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Garage Floor & Barn Gallery",
  description: "Garage floor and barn concrete project gallery by Maxima Concrete. Epoxy, polished & coated floors in Ohio.",
  alternates: { canonical: "/gallery/garage-floor-barn/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
