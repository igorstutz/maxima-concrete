import {
  ArrowUpRight,
  Award,
  BadgeCheck,
  Brush,
  Building2,
  Check,
  Droplets,
  Hammer,
  Home,
  Layers,
  Ruler,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsUp,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmartLink } from "@/components/sections/home/SmartLink";
import { legacyAsset } from "@/components/sections/home/legacy";

interface ApproachFeature {
  icon?: string;
  text?: string;
}

interface ApproachStep {
  icon?: string;
  iconImage?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

const ICONS: Record<string, LucideIcon> = {
  hammer: Hammer,
  layers: Layers,
  "thumbs-up": ThumbsUp,
  droplets: Droplets,
  sparkles: Sparkles,
  truck: Truck,
  brush: Brush,
  settings: Settings,
  ruler: Ruler,
  home: Home,
  "building-2": Building2,
  "shield-check": ShieldCheck,
  "badge-check": BadgeCheck,
  award: Award,
  check: Check,
  star: Star,
  wrench: Wrench,
};

/** Abordagem em 5 passos das subpáginas de cidade — type "city-approach". */
export default function CityApproach({ content }: { content: Record<string, any> }) {
  const cityPill: string = content?.cityPill || "";
  const titleBlue: string = content?.titleBlue || "";
  const titleDark: string = content?.titleDark || "";
  const subtitle: string = content?.subtitle || "";
  const mainImage: string = content?.mainImage || "";
  const features: ApproachFeature[] = Array.isArray(content?.features)
    ? content.features
    : [];
  const badge1Image: string = content?.badge1Image || "";
  const badge2Image: string = content?.badge2Image || "";
  const ctaText: string = content?.ctaText || "";
  const ctaLink: string = content?.ctaLink || "#";
  const steps: ApproachStep[] = Array.isArray(content?.steps) ? content.steps : [];

  return (
    <section className="relative bg-white py-16 lg:py-24">
      <Container>
        <ScrollReveal className="mb-12 flex w-full max-w-[841px] flex-col items-start gap-[18px] text-left">
          {cityPill && (
            <span className="inline-flex items-center rounded-xl border-2 border-ocean px-5 py-2 text-base font-semibold text-ocean">
              {cityPill}
            </span>
          )}
          {(titleBlue || titleDark) && (
            <h2 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              {titleBlue && <span className="text-ocean">{titleBlue}</span>}
              {titleBlue && titleDark && " "}
              {titleDark && <span className="text-navy">{titleDark}</span>}
            </h2>
          )}
          {subtitle && (
            <p className="whitespace-pre-line text-base text-gray-700 md:text-lg">
              {subtitle}
            </p>
          )}
        </ScrollReveal>

        {mainImage && (
          <ScrollReveal className="mb-12 overflow-hidden rounded-2xl">
            <Image
              src={legacyAsset(mainImage)}
              alt={titleBlue ? `${titleBlue} ${titleDark}`.trim() : "Our approach"}
              width={1200}
              height={675}
              sizes="(min-width: 1024px) 1136px, 100vw"
              className="h-auto w-full object-cover"
            />
          </ScrollReveal>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {/* Primeira célula — bullets + selos + CTA */}
          <ScrollReveal className="flex flex-col gap-6">
            {features.length > 0 && (
              <ul className="flex flex-col gap-3">
                {features.map((f, i) => {
                  const Icon = ICONS[f.icon || "badge-check"] || BadgeCheck;
                  return (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-lg font-semibold text-ocean"
                    >
                      <Icon className="h-6 w-6 shrink-0" />
                      <span>{f.text}</span>
                    </li>
                  );
                })}
              </ul>
            )}

            {(badge1Image || badge2Image) && (
              <div className="mt-2 flex items-center gap-4">
                {badge1Image && (
                  <Image
                    src={legacyAsset(badge1Image)}
                    alt="Trust badge"
                    width={128}
                    height={64}
                    className="h-16 w-auto object-contain"
                  />
                )}
                {badge2Image && (
                  <Image
                    src={legacyAsset(badge2Image)}
                    alt="Trust badge"
                    width={128}
                    height={64}
                    className="h-16 w-auto object-contain"
                  />
                )}
              </div>
            )}

            {ctaText && (
              <SmartLink
                href={ctaLink}
                className="inline-flex w-fit items-center justify-between gap-3 rounded-full bg-ocean px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
              >
                <span>{ctaText}</span>
                <ArrowUpRight className="h-4 w-4" />
              </SmartLink>
            )}
          </ScrollReveal>

          {/* Cards de passo */}
          {steps.map((step, i) => {
            const Icon = ICONS[step.icon || "hammer"] || Hammer;
            return (
              <ScrollReveal
                key={i}
                delay={Math.min(i % 3, 2)}
                className="flex"
              >
                <div className="flex flex-col rounded-[15px] border-[3px] border-ocean bg-white p-6">
                  {step.iconImage ? (
                    <Image
                      src={legacyAsset(step.iconImage)}
                      alt={step.title || `Step ${i + 1}`}
                      width={48}
                      height={48}
                      className="mb-4 h-12 w-12 object-contain"
                    />
                  ) : (
                    <Icon className="mb-4 h-9 w-9 text-ocean" strokeWidth={1.75} />
                  )}
                  {step.title && (
                    <h3 className="mb-2 whitespace-pre-line text-xl font-semibold leading-6 text-navy">
                      {step.title}
                    </h3>
                  )}
                  {step.description && (
                    <p className="mb-5 text-sm leading-6 text-navy">
                      {step.description}
                    </p>
                  )}
                  {step.ctaText && (
                    <SmartLink
                      href={step.ctaLink || "#contact"}
                      className="gradient-navy mt-auto inline-flex w-fit items-center justify-between gap-3 rounded-[10px] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      <span>{step.ctaText}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </SmartLink>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
