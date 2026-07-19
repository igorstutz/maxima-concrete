import type { Metadata } from "next";
import page from "@/content/pages/areascolumbus_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  alternates: { canonical: "/areas-we-serve/columbus/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
