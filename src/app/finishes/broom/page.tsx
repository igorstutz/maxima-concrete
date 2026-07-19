import type { Metadata } from "next";
import page from "@/content/pages/finishesbroom_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Broom Finish",
  description: "Broom finish concrete by Maxima Concrete. Durable, slip-resistant texture for driveways, sidewalks and patios.",
  alternates: { canonical: "/finishes/broom/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
