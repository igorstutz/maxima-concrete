import type { Metadata } from "next";
import page from "@/content/pages/galleryretainingcitywalls_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Retaining & City Walls Gallery",
  description: "Retaining wall and city wall gallery by Maxima Concrete. Browse block, boulder and seating wall projects across Central Ohio.",
  alternates: { canonical: "/gallery/retaining-city-walls/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
