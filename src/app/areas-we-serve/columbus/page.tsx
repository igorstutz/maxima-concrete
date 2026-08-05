import type { Metadata } from "next";
import page from "@/content/pages/areascolumbus_page.json";
import serviceAreas from "@/content/data/service-areas.json";
import { PageSections } from "@/components/sections/PageSections";
import { cityMetadata } from "../city-metadata";
import type { ServiceArea } from "@/components/sections/areas/service-areas";

const columbus = (serviceAreas as ServiceArea[]).find(
  (a) => a.slug === "columbus",
)!;

export const metadata: Metadata = cityMetadata(columbus);

export default function Page() {
  return <PageSections sections={page.sections} />;
}
