import type { Metadata } from "next";
import page from "@/content/pages/firepits_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Fire Pits",
  description: "Custom concrete fire pit installation in Ohio. Create the perfect outdoor gathering space with Maxima Concrete.",
  alternates: { canonical: "/services/fire-pits/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
