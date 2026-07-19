import type { Metadata } from "next";
import page from "@/content/pages/finishescoloredbroom_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Maxima Concrete - Colored Broom Finish",
  description: "Colored broom finish concrete by Maxima Concrete. Combine color and texture for stunning results.",
  alternates: { canonical: "/finishes/colored-broom/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
