import type { Metadata } from "next";
import page from "@/content/pages/patios_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Concrete Patio",
  description: "Custom concrete patios designed for outdoor living in Ohio. Stamped, stained & decorative patio installation by Maxima Concrete. Get a free quote.",
  alternates: { canonical: "/services/patios/concrete-patio/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
