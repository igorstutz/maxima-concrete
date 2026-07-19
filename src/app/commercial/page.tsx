import type { Metadata } from "next";
import page from "@/content/pages/commercial_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Commercial Concrete",
  description: "Commercial concrete services by Maxima â€” durable, professional, and built for business.",
  alternates: { canonical: "/commercial/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
