import type { Metadata } from "next";
import page from "@/content/pages/gallerydriveways_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Driveways Gallery",
  description: "Concrete driveway project gallery by Maxima Concrete. Stamped, exposed aggregate & decorative driveways in Ohio.",
  alternates: { canonical: "/gallery/driveways/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
