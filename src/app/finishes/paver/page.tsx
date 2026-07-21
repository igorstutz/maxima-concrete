import type { Metadata } from "next";
import page from "@/content/pages/finishespaver_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Paver, Brick & Natural Stone",
  description:
    "Paver, brick, and natural stone finishes by Maxima Concrete. Durable, flexible, and beautiful surfaces for driveways, patios, and walkways across Central Ohio.",
  alternates: { canonical: "/finishes/paver/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
