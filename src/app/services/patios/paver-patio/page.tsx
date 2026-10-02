import type { Metadata } from "next";
import page from "@/content/pages/paverpatios_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Paver Patio",
  description: "Paver patio services by Maxima â€” elegant, durable outdoor living spaces built with premium pavers.",
  alternates: { canonical: "/services/patios/paver-patio/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
