import type { Metadata } from "next";
import page from "@/content/pages/paverdriveways_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Driveways - Paver",
  description: "Paver driveway services by Maxima â€” elegant, durable, and built to enhance your home's curb appeal.",
  alternates: { canonical: "/services/driveways/driveways-paver/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
