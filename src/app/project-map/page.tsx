import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import page from "@/content/pages/projectmap_page.json";
import { PageSections } from "@/components/sections/PageSections";
import { Container } from "@/components/Container";
import Image from "@/components/Image";
import ProjectMapExplorer from "./ProjectMapExplorer";

export const metadata: Metadata = {
  title: "Maxima Concrete - Project Map | Maxima Concrete",
  description:
    "Explore every Maxima Concrete project on an interactive map. Search by ZIP, adjust the radius, and browse completed driveways, patios and more across Central Ohio.",
  alternates: { canonical: "/project-map/" },
};

const HERO_IMAGE = "/images/assets/project-map-hero.jpg";

const explorerContent =
  page.sections.find((s) => s.type === "explorer")?.content ?? {};
const faqSections = page.sections.filter((s) => s.type === "faq");

const STATS = [
  { value: "1,825+", label: "Projects Mapped" },
  { value: "9,000+", label: "Happy Clients" },
  { value: "A+", label: "BBB Rating" },
  { value: "2011", label: "Serving Since" },
];

export default function Page() {
  const c = explorerContent as {
    badgeText?: string;
    title?: string;
    subtitle?: string;
  };

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[440px] w-full overflow-hidden bg-navy lg:min-h-[520px]">
        <Image
          src={HERO_IMAGE}
          alt="Aerial view of Central Ohio neighborhoods with completed Maxima Concrete projects"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/75 to-navy/25" />
        <div className="relative z-10 flex min-h-[440px] items-end pb-12 pt-28 lg:min-h-[520px] lg:pb-16">
          <Container>
            <div className="max-w-2xl">
              {c.badgeText && (
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                  <MapPin className="h-3.5 w-3.5 text-white" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-white">
                    {c.badgeText}
                  </span>
                </div>
              )}
              <h1 className="text-shadow-hero text-3xl font-semibold leading-tight tracking-[-1px] text-white md:text-4xl lg:text-[52px] lg:leading-[1.05]">
                {c.title || "Every project, on the map."}
              </h1>
              {c.subtitle && (
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
                  {c.subtitle}
                </p>
              )}
            </div>
          </Container>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-gray-100 bg-white">
        <Container>
          <dl className="grid grid-cols-2 gap-6 py-8 md:grid-cols-4 lg:py-10">
            {STATS.map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <dt className="text-3xl font-bold tracking-tight text-ocean md:text-4xl">
                  {s.value}
                </dt>
                <dd className="mt-1 text-sm text-gray-600">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* MAP */}
      <section id="find-work" className="scroll-mt-20 bg-white py-10 lg:py-14">
        <Container>
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-ocean/60" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ocean">
              Find projects near you
            </h2>
          </div>
          {/* useSearchParams (?zip=) exige Suspense em export estático */}
          <Suspense
            fallback={
              <div className="h-[70vh] min-h-[500px] rounded-xl border border-gray-200 bg-surface" />
            }
          >
            <ProjectMapExplorer content={explorerContent} />
          </Suspense>
        </Container>
      </section>

      {/* CTA */}
      <section className="gradient-navy relative overflow-hidden py-16 lg:py-20">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-ocean/30 blur-3xl" />
        <Container className="relative">
          <div className="max-w-2xl text-left">
            <h2 className="text-2xl font-semibold leading-tight tracking-[-0.5px] text-white md:text-3xl lg:text-4xl">
              Don&apos;t see your neighborhood yet?
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
              We&apos;re adding new projects across Central Ohio every week. Get your free,
              no-obligation estimate and become the next pin on the map.
            </p>
            <div className="mt-8 flex flex-col items-start justify-start gap-3 sm:flex-row">
              <Link
                href="/contact-us/#contact"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-navy shadow-md transition-colors hover:bg-white/90 lg:text-base"
              >
                Get a Free Estimate
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/gallery/"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 lg:text-base"
              >
                Browse Our Gallery
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <PageSections sections={faqSections} />
    </>
  );
}
