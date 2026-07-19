import type { ComponentType } from "react";
import home from "@/content/pages/home.json";
import Hero from "@/components/sections/home/Hero";
import WhyMaxima from "@/components/sections/home/WhyMaxima";
import Services from "@/components/sections/home/Services";
import Gallery from "@/components/sections/home/Gallery";
import PoolDecks from "@/components/sections/home/PoolDecks";
import Driveways from "@/components/sections/home/Driveways";
import Patios from "@/components/sections/home/Patios";
import OutdoorLiving from "@/components/sections/home/OutdoorLiving";
import Reviews from "@/components/sections/home/Reviews";
import RecentProjects from "@/components/sections/home/RecentProjects";
import TrustGlobal from "@/components/sections/home/TrustGlobal";
import FindWork from "@/components/sections/home/FindWork";
import Contact from "@/components/sections/home/Contact";
import Instagram from "@/components/sections/home/Instagram";

// type do JSON -> componente. A seção "footer" é global (renderizada no layout).
const SECTION_COMPONENTS: Record<
  string,
  ComponentType<{ content: Record<string, any> }>
> = {
  hero: Hero,
  "why-maxima": WhyMaxima,
  services: Services,
  gallery: Gallery,
  "pool-decks": PoolDecks,
  driveways: Driveways,
  patios: Patios,
  "outdoor-living": OutdoorLiving,
  reviews: Reviews,
  "recent-projects": RecentProjects,
  "trust-global": TrustGlobal,
  "find-work": FindWork,
  contact: Contact,
  instagram: Instagram,
};

export default function Home() {
  return (
    <>
      {home.sections.map((section) => {
        if (section.type === "footer") return null;
        const Section = SECTION_COMPONENTS[section.type];
        if (!Section) return null;
        return <Section key={section.key} content={section.content} />;
      })}
    </>
  );
}
