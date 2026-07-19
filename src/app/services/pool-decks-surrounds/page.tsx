import type { Metadata } from "next";
import page from "@/content/pages/pool_decks_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Pool Decks & Surrounds",
  description: "Beautiful, slip-resistant pool decks and surrounds in decorative concrete and pavers. Custom designs by Maxima Concrete in Ohio. Free consultation.",
  alternates: { canonical: "/services/pool-decks-surrounds/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
