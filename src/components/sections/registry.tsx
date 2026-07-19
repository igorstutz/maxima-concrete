import type { ComponentType } from "react";

// Home (tipos exatos — mesmos componentes da home reutilizados em todo o site)
import Hero from "./home/Hero";
import WhyMaxima from "./home/WhyMaxima";
import Services from "./home/Services";
import Gallery from "./home/Gallery";
import PoolDecks from "./home/PoolDecks";
import Driveways from "./home/Driveways";
import Patios from "./home/Patios";
import OutdoorLiving from "./home/OutdoorLiving";
import Reviews from "./home/Reviews";
import RecentProjects from "./home/RecentProjects";
import TrustGlobal from "./home/TrustGlobal";
import FindWork from "./home/FindWork";
import Contact from "./home/Contact";
import Instagram from "./home/Instagram";

// Serviços (core)
import Intro from "./service/Intro";
import PaverIntro from "./service/PaverIntro";
import WhyMaximaService from "./service/WhyMaximaService";
import WhyChoose from "./service/WhyChoose";
import StyleOptions from "./service/StyleOptions";
import Inspiration from "./service/Inspiration";
import FinalCTA from "./service/FinalCTA";
import Faq from "./service/Faq";
import RelatedServices from "./service/RelatedServices";
import MoreThanConcrete from "./service/MoreThanConcrete";
import HeroMinimal from "./service/HeroMinimal";
import HeroImageOnly from "./service/HeroImageOnly";
import Trust from "./service/Trust";
import MaximaAdvantage from "./service/MaximaAdvantage";

// Galerias e finishes
import InspirationGallery from "./gallery/InspirationGallery";
import ProjectsGrid from "./gallery/ProjectsGrid";
import FinishesIntro from "./gallery/FinishesIntro";
import WhatIs from "./gallery/WhatIs";
import WhereToUse from "./gallery/WhereToUse";
import WhyChooseFinish from "./gallery/WhyChooseFinish";
import DesignOptions from "./gallery/DesignOptions";
import BenefitsProcess from "./gallery/BenefitsProcess";
import FinishesGrid from "./gallery/FinishesGrid";
import AllServices from "./gallery/AllServices";

// Hubs e variações
import HubHero from "./hub/HubHero";
import HubIntro from "./hub/HubIntro";
import HubOptions from "./hub/HubOptions";
import HubFeature from "./hub/HubFeature";
import HubWhyChoose from "./hub/HubWhyChoose";
import HubWhyMaxima from "./hub/HubWhyMaxima";
import HubDurability from "./hub/HubDurability";
import HubFinalCTA from "./hub/HubFinalCTA";
import IntegratedFeatures from "./hub/IntegratedFeatures";
import IntegratedFeatures2 from "./hub/IntegratedFeatures2";
import CommonApplications from "./hub/CommonApplications";
import WhyMaximaSports from "./hub/WhyMaximaSports";
import WhyMaximaSimple from "./hub/WhyMaximaSimple";
import WhyMaximaDetailed from "./hub/WhyMaximaDetailed";

// Outdoor living
import OutdoorIntro from "./outdoor/OutdoorIntro";
import OKIntro from "./outdoor/OKIntro";
import CustomOutdoorLiving from "./outdoor/CustomOutdoorLiving";
import WhyChooseOutdoor from "./outdoor/WhyChooseOutdoor";
import OutdoorKitchen from "./outdoor/OutdoorKitchen";
import OutdoorLightning from "./outdoor/OutdoorLightning";
import OutdoorSpace from "./outdoor/OutdoorSpace";
import CarouselImages from "./outdoor/CarouselImages";
import ConcreteVsPavers from "./outdoor/ConcreteVsPavers";
import TrustMaxima from "./outdoor/TrustMaxima";
import DreamKitchen from "./outdoor/DreamKitchen";
import ProDesign from "./outdoor/ProDesign";
import Unleash from "./outdoor/Unleash";

// Comercial
import CommercialHero from "./commercial/Hero";
import CommercialIntro from "./commercial/Intro";
import CommercialAda from "./commercial/Ada";
import CommercialServices from "./commercial/Services";
import CommercialWhyBusiness from "./commercial/WhyBusiness";
import BuildingCentral from "./commercial/BuildingCentral";
import WhyChooseMC from "./commercial/WhyChooseMC";
import ReadyToBuild from "./commercial/ReadyToBuild";
import MaximaStandard from "./commercial/MaximaStandard";
import CommercialCategories from "./commercial/Categories";

// Áreas e institucional
import CityHero from "./areas/CityHero";
import CityApproach from "./areas/CityApproach";
import AreasGrid from "./areas/AreasGrid";
import HeroAreas from "./areas/HeroAreas";
import ContactInfoMap from "./areas/ContactInfoMap";
import JoinOurTeamIntro from "./areas/JoinOurTeamIntro";
import JoinOurTeamBenefits from "./areas/JoinOurTeamBenefits";
import JoinOurTeamPositions from "./areas/JoinOurTeamPositions";
import JoinOurTeamFinalCTA from "./areas/JoinOurTeamFinalCTA";
import WhyMaximaIntro from "./areas/WhyMaximaIntro";
import RealReviews from "./areas/RealReviews";
import Areas from "./areas/Areas";
import Financing from "./areas/Financing";
import Values from "./areas/Values";

export type SectionComponent = ComponentType<{ content: Record<string, any> }>;

/**
 * Registro central: type do JSON → componente.
 * Tipos tratados fora do registro: "footer" (renderizado no layout global)
 * e "explorer" (página /project-map tem implementação própria).
 */
export const SECTION_REGISTRY: Record<string, SectionComponent> = {
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

  intro: Intro,
  "paver-intro": PaverIntro,
  "why-maxima-service": WhyMaximaService,
  "why-choose": WhyChoose,
  "style-options": StyleOptions,
  inspiration: Inspiration,
  "final-cta": FinalCTA,
  faq: Faq,
  "related-services": RelatedServices,
  "more-than-concrete": MoreThanConcrete,
  "hero-minimal": HeroMinimal,
  "hero-image-only": HeroImageOnly,
  trust: Trust,
  "maxima-advantage": MaximaAdvantage,

  "inspiration-gallery": InspirationGallery,
  "projects-grid": ProjectsGrid,
  "finishes-intro": FinishesIntro,
  whatis: WhatIs,
  "where-to-use": WhereToUse,
  "why-choose-finish": WhyChooseFinish,
  "design-options": DesignOptions,
  "benefits-process": BenefitsProcess,
  "finishes-grid": FinishesGrid,
  "all-services": AllServices,

  "hub-hero": HubHero,
  "hub-intro": HubIntro,
  "hub-options": HubOptions,
  "hub-feature": HubFeature,
  "hub-why-choose": HubWhyChoose,
  "hub-why-maxima": HubWhyMaxima,
  "hub-durability": HubDurability,
  "hub-final-cta": HubFinalCTA,
  "integrated-features": IntegratedFeatures,
  "integrated-features-2": IntegratedFeatures2,
  "common-applications": CommonApplications,
  "why-maxima-sports": WhyMaximaSports,
  "why-maxima-simple": WhyMaximaSimple,
  "why-maxima-detailed": WhyMaximaDetailed,

  "outdoor-intro": OutdoorIntro,
  "ok-intro": OKIntro,
  "custom-outdoor-living": CustomOutdoorLiving,
  "why-choose-outdoor": WhyChooseOutdoor,
  "outdoor-kitchen": OutdoorKitchen,
  "outdoor-lightning": OutdoorLightning,
  "outdoor-space": OutdoorSpace,
  "carousel-images": CarouselImages,
  "concrete-vs-pavers": ConcreteVsPavers,
  "trust-maxima": TrustMaxima,
  "dream-kitchen": DreamKitchen,
  "pro-design": ProDesign,
  unleash: Unleash,

  "commercial-hero": CommercialHero,
  "commercial-intro": CommercialIntro,
  "commercial-ada": CommercialAda,
  "commercial-services": CommercialServices,
  "commercial-why-business": CommercialWhyBusiness,
  "building-central": BuildingCentral,
  "why-choose-mc": WhyChooseMC,
  "ready-to-build": ReadyToBuild,
  "maxima-standard": MaximaStandard,
  "commercial-categories": CommercialCategories,

  "city-hero": CityHero,
  "city-approach": CityApproach,
  "areas-grid": AreasGrid,
  "hero-areas": HeroAreas,
  "contact-info-map": ContactInfoMap,
  "joinourteam-sec-intro": JoinOurTeamIntro,
  "joinourteam-sec-benefits": JoinOurTeamBenefits,
  "joinourteam-sec-positions": JoinOurTeamPositions,
  "joinourteam-sec-final-cta": JoinOurTeamFinalCTA,
  "why-maxima-intro": WhyMaximaIntro,
  "real-reviews": RealReviews,
  areas: Areas,
  financing: Financing,
  values: Values,
};
