import type { Metadata } from "next";
import page from "@/content/pages/gallerycommercial_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Commercial Gallery",
  description: "Commercial concrete project gallery by Maxima Concrete. Parking lots, sidewalks & commercial flatwork in Ohio.",
  alternates: { canonical: "/gallery/commercial/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
