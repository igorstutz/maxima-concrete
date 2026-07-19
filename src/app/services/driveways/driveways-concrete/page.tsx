import type { Metadata } from "next";
import page from "@/content/pages/driveways_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Driveways - Concrete",
  description: "Professional concrete driveway installation in Ohio. Custom stamped, exposed aggregate & decorative driveways by Maxima Concrete. Free estimates.",
  alternates: { canonical: "/services/driveways/driveways-concrete/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
