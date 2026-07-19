import type { Metadata } from "next";
import page from "@/content/pages/drivewayshub_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Driveways",
  description: "Concrete and paver driveways by Maxima Concrete. Explore our driveway options and find the perfect style for your Ohio home. Free estimates.",
  alternates: { canonical: "/services/driveways/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
