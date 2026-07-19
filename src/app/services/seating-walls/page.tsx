import type { Metadata } from "next";
import page from "@/content/pages/seatingwalls_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Seating Walls",
  description: "Decorative concrete seating walls for patios and outdoor areas in Ohio. Functional & beautiful designs by Maxima Concrete.",
  alternates: { canonical: "/services/seating-walls/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
