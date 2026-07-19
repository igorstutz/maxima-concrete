import type { Metadata } from "next";
import page from "@/content/pages/gallery_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Gallery",
  description: "Browse our portfolio of concrete driveways, patios, pool decks, and outdoor living projects in Ohio. See Maxima Concrete's craftsmanship.",
  alternates: { canonical: "/gallery/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
