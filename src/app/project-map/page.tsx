import type { Metadata } from "next";
import { Suspense } from "react";
import { MapPin } from "lucide-react";
import page from "@/content/pages/projectmap_page.json";
import { PageSections } from "@/components/sections/PageSections";
import { Container } from "@/components/Container";
import ProjectMapExplorer from "./ProjectMapExplorer";

export const metadata: Metadata = {
  title: "Maxima Concrete - Project Map | Maxima Concrete",
  description:
    "Explore every Maxima Concrete project on an interactive map. Search by ZIP, browse completed driveways, patios and more across Ohio.",
  alternates: { canonical: "/project-map/" },
};

const explorerIndex = page.sections.findIndex((s) => s.type === "explorer");
const explorerContent = page.sections[explorerIndex]?.content ?? {};
const before = page.sections.slice(0, Math.max(explorerIndex, 0));
const after = explorerIndex >= 0 ? page.sections.slice(explorerIndex + 1) : [];

export default function Page() {
  const c = explorerContent as {
    badgeText?: string;
    title?: string;
    subtitle?: string;
  };

  return (
    <>
      <PageSections sections={before} />

      {/* Explorer do mapa de projetos (implementação própria, fora do registry) */}
      <section id="find-work" className="scroll-mt-20 bg-white py-6 lg:py-10">
        <Container>
          {(c.badgeText || c.title || c.subtitle) && (
            <div className="mb-6 max-w-3xl lg:mb-8">
              {c.badgeText && (
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-ocean/10 px-3 py-1">
                  <MapPin className="h-3.5 w-3.5 text-ocean" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-ocean">
                    {c.badgeText}
                  </span>
                </div>
              )}
              {c.title && (
                <h2 className="text-2xl font-bold leading-tight tracking-[-0.5px] text-navy md:text-3xl lg:text-4xl">
                  {c.title}
                </h2>
              )}
              {c.subtitle && (
                <p className="mt-2 text-sm text-gray-600 md:text-base">{c.subtitle}</p>
              )}
            </div>
          )}

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

      <PageSections sections={after} />
    </>
  );
}
