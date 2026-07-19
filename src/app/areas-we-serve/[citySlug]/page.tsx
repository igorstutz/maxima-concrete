import type { Metadata } from "next";
import { notFound } from "next/navigation";
import base from "@/content/pages/areascolumbus_page.json";
import serviceAreas from "@/content/data/service-areas.json";
import { PageSections } from "@/components/sections/PageSections";

/**
 * Páginas de cidade (/areas-we-serve/<cidade>) — mesmo mecanismo do site
 * antigo: as seções da página de Columbus com "Columbus" trocado pelo nome
 * da cidade, agora resolvido em build (uma página estática por cidade).
 */
const replaceCity = (value: any, cityName: string): any => {
  if (typeof value === "string") {
    return value
      .replace(/Columbus/g, cityName)
      .replace(/columbus/g, cityName.toLowerCase());
  }
  if (Array.isArray(value)) return value.map((v) => replaceCity(v, cityName));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, replaceCity(v, cityName)])
    );
  }
  return value;
};

const cities = serviceAreas.filter((a) => a.slug !== "columbus");

export function generateStaticParams() {
  return cities.map((a) => ({ citySlug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ citySlug: string }>;
}): Promise<Metadata> {
  const { citySlug } = await params;
  const area = cities.find((a) => a.slug === citySlug);
  if (!area) return {};
  return {
    title: `Maxima Concrete - Concrete Contractor in ${area.name}, OH`,
    description: `Maxima Concrete delivers premium concrete driveways, patios, and outdoor living spaces across ${area.name}, Ohio.`,
    alternates: { canonical: `/areas-we-serve/${citySlug}/` },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ citySlug: string }>;
}) {
  const { citySlug } = await params;
  const area = cities.find((a) => a.slug === citySlug);
  if (!area) notFound();

  const sections = base.sections.map((s) => ({
    ...s,
    content: replaceCity(s.content, area.name),
  }));

  return <PageSections sections={sections} />;
}
