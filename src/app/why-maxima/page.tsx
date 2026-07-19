import type { Metadata } from "next";
import page from "@/content/pages/whymaxima_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  alternates: { canonical: "/why-maxima/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
