import type { Metadata } from "next";
import page from "@/content/pages/sportscourts_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Sports Courts",
  description: "Custom concrete sports court installation in Ohio. Basketball, pickleball & multi-sport courts built by Maxima Concrete.",
  alternates: { canonical: "/services/sports-courts/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
