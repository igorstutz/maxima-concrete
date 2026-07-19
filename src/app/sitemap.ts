import type { MetadataRoute } from "next";
import { PAGE_ROUTES, STATIC_ROUTES } from "@/lib/routes";
import serviceAreas from "@/content/data/service-areas.json";

export const dynamic = "force-static";

const BASE = "https://maximaconcrete.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = [...Object.keys(PAGE_ROUTES), ...STATIC_ROUTES].map((route) => ({
    url: `${BASE}${route === "/" ? "" : route}/`.replace(/\/\/$/, "/"),
    lastModified: now,
    changeFrequency: (route === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: route === "/" ? 1 : route.split("/").length > 2 ? 0.7 : 0.8,
  }));

  const cities = serviceAreas
    .filter((a) => a.slug !== "columbus")
    .map((a) => ({
      url: `${BASE}/areas-we-serve/${a.slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...pages, ...cities];
}
