import type { Metadata } from "next";
import page from "@/content/pages/finishesbuffwash_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Buff Wash & Exposed Aggregate",
  description: "Buff wash and exposed aggregate concrete finishes by Maxima Concrete. Reveal natural stone beauty.",
  alternates: { canonical: "/finishes/buff-wash-exposed/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
