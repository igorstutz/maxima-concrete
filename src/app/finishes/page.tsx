import type { Metadata } from "next";
import page from "@/content/pages/finishes_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  alternates: { canonical: "/finishes/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
