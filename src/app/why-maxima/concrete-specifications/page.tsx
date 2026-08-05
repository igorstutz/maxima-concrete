import type { Metadata } from "next";
import page from "@/content/pages/concretespecs_page.json";
import { PageSections } from "@/components/sections/PageSections";

export const metadata: Metadata = {
  title: "Concrete Specifications | Maxima Concrete",
  description:
    "The concrete specifications Maxima Concrete uses as standard in Ohio: 6.5-bag (4500 PSI) fiber-reinforced mix, 10-gauge wire mesh and a compacted gravel base.",
  alternates: { canonical: "/why-maxima/concrete-specifications/" },
};

export default function Page() {
  return <PageSections sections={page.sections} />;
}
