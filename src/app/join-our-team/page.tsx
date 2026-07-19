import type { Metadata } from "next";
import page from "@/content/pages/joinourteam_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  alternates: { canonical: "/join-our-team/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
