import type { Metadata } from "next";
import page from "@/content/pages/galleryoutdoorlivingkitchen_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Outdoor Living & Outdoor Kitchen Gallery",
  description: "Outdoor living and outdoor kitchen gallery by Maxima Concrete. Browse patios, bars, grill stations and full backyard builds in Ohio.",
  alternates: { canonical: "/gallery/outdoor-living-kitchen/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
