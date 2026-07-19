import type { Metadata } from "next";
import page from "@/content/pages/areaswe_serve_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  alternates: { canonical: "/areas-we-serve/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
