import type { Metadata } from "next";
import page from "@/content/pages/steps_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Steps",
  description: "Concrete step and stair installation in Ohio. Safe, durable, and attractive steps for your home by Maxima Concrete.",
  alternates: { canonical: "/services/steps/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
