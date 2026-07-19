import type { Metadata } from "next";
import page from "@/content/pages/gallerysportcourt_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Sport Court Gallery",
  description: "Sport court concrete gallery by Maxima Concrete. Browse our basketball, pickleball & multi-sport court projects in Ohio.",
  alternates: { canonical: "/gallery/sport-court/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
