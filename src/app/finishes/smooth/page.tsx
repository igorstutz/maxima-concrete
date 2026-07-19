import type { Metadata } from "next";
import page from "@/content/pages/finishessmooth_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Smooth Finish",
  description: "Smooth finish concrete by Maxima Concrete. Clean, modern look for interior and exterior surfaces.",
  alternates: { canonical: "/finishes/smooth/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
