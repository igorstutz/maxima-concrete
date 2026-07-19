import type { Metadata } from "next";
import page from "@/content/pages/finishesstampedcolored_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Stamped & Colored Finish",
  description: "Stamped and colored concrete finishes by Maxima Concrete. Replicate stone, brick, and tile patterns.",
  alternates: { canonical: "/finishes/stamped-colored/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
