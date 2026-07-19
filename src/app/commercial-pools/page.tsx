import type { Metadata } from "next";
import page from "@/content/pages/commercialpools_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Commercial Pools",
  description: "Commercial Pools services by Maxima â€” durable, professional, and built for business.",
  alternates: { canonical: "/commercial-pools/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
