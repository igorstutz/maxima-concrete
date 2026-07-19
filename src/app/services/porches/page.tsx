import type { Metadata } from "next";
import page from "@/content/pages/porches_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Porches",
  description: "Beautiful concrete porch and front step construction in Ohio. Enhance your home's curb appeal with Maxima Concrete.",
  alternates: { canonical: "/services/porches/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
