import type { Metadata } from "next";
import page from "@/content/pages/contactus_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  alternates: { canonical: "/contact-us/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
