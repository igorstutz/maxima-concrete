import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, Star } from "lucide-react";
import { Container } from "@/components/Container";
import ElfsightWidget from "@/components/ElfsightWidget";
import Contact from "@/components/sections/home/Contact";
import FindWork from "@/components/sections/home/FindWork";
import Instagram from "@/components/sections/home/Instagram";
import home from "@/content/pages/home.json";
import reviewsSettings from "@/content/settings/reviews.json";

export const metadata: Metadata = {
  title: "Maxima Concrete - Customer Reviews | Maxima Concrete",
  description:
    "Read genuine Google reviews from Maxima Concrete customers across Ohio. See why homeowners trust our team for driveways, patios, and outdoor living.",
  alternates: { canonical: "/reviews/" },
};

// Mesmo widget Elfsight de reviews do Google usado na home (Reviews.tsx).
const REVIEWS_WIDGET_ID = "ede2daec-6946-4a1d-ae2f-bcb41f160474";
const HIDE_HEADINGS = ["What Our Customers Say"];

const contactContent =
  home.sections.find((s) => s.type === "contact")?.content ?? {};
const findWorkContent =
  home.sections.find((s) => s.type === "find-work")?.content ?? {};
// Bloco "Follow Us — On Instagram" reaproveitado do home.json (fallback se ausente).
const instagramContent =
  home.sections.find((s) => s.type === "instagram")?.content ?? {
    handle: "@maximaconcrete",
    titlePart1: "Follow Us",
    titlePart2: "— On Instagram",
  };
const profileUrl =
  (home.sections.find((s) => s.type === "reviews")?.content as
    | { profileUrl?: string }
    | undefined)?.profileUrl ?? "";

// Total e média do perfil do Google (src/content/settings/reviews.json). Os
// depoimentos em si vêm do widget Elfsight, que não expõe esses números para a
// página — antes eles eram calculados de uma lista de reviews de exemplo
// herdada da migração, e a página anunciava "8 Verified Reviews".
const totalReviews = reviewsSettings.totalReviews;
const averageRating = reviewsSettings.averageRating;

function StarRating({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={size}
          fill={i <= rating ? "#FBBF24" : "transparent"}
          stroke={i <= rating ? "#FBBF24" : "#D1D5DB"}
        />
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section
        className="py-16 md:py-24 lg:py-28"
        style={{ background: "linear-gradient(135deg, #041C2D 0%, #0D5D93 100%)" }}
      >
        <Container>
          <div className="max-w-[1100px]">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-white/70">
              <Link href="/" className="transition-colors hover:text-white">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-white">Reviews</span>
            </nav>

            <h1
              className="mb-4 text-3xl text-white md:mb-6 md:text-5xl lg:text-[56px]"
              style={{ fontWeight: 600, lineHeight: "108%", letterSpacing: "-1.6px" }}
            >
              {/* O hero já é azul da marca: destacar em azul daria 2,2:1. A
                  hierarquia vem da opacidade, não de outra cor. */}
              <span className="text-white/70">Real Reviews from</span>
              <br />
              Real Customers
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              Every project we deliver is backed by honest feedback from homeowners and
              businesses across Ohio. Here is what our clients say about working with Maxima
              Concrete.
            </p>

            {/* Cartão de estatísticas */}
            <div className="mt-8 inline-flex flex-col items-start gap-4 rounded-2xl border border-white/20 bg-white/10 px-6 py-5 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-6 md:mt-10">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-semibold text-white md:text-5xl">
                  {averageRating.toFixed(1)}
                </span>
                <div className="flex flex-col">
                  <StarRating rating={Math.round(averageRating)} size="h-5 w-5" />
                  <span className="mt-1 text-xs text-white/70">Google Rating</span>
                </div>
              </div>
              <div className="hidden h-12 w-px bg-white/20 sm:block" />
              <div className="flex flex-col">
                <span className="text-2xl font-semibold text-white md:text-3xl">
                  {totalReviews}
                </span>
                <span className="text-xs text-white/70">Verified Reviews</span>
              </div>
              {profileUrl && (
                <>
                  <div className="hidden h-12 w-px bg-white/20 sm:block" />
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-white/90"
                  >
                    Leave a Review
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* DEPOIMENTOS — só os reviews reais do Google, via widget */}
      <section className="bg-surface-soft pb-16 pt-16 sm:pt-24 lg:pb-20">
        <Container>
          <div className="mb-8 md:mb-10">
            <h2 className="mb-3 text-2xl font-semibold leading-[115%] tracking-[-1.2px] text-navy md:text-3xl lg:text-[40px]">
              What Our Customers <span className="text-ocean">Are Saying</span>
            </h2>
            <p className="max-w-xl text-sm text-[#5A6B7B] md:text-base">
              <strong className="text-navy">{totalReviews}</strong> homeowners and businesses have
              reviewed Maxima Concrete on Google, averaging{" "}
              <strong className="text-navy">{averageRating.toFixed(1)} stars</strong>.
            </p>
          </div>
        </Container>

        {/* Reviews ao vivo do Google (Elfsight) */}
        <Container>
          <ElfsightWidget widgetId={REVIEWS_WIDGET_ID} hideHeadings={HIDE_HEADINGS} />
        </Container>

        {/* CTA — fecha a seção, depois de o visitante ver os depoimentos */}
        <Container>
          <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl bg-navy px-6 py-6 sm:flex-row sm:items-center sm:justify-between md:mt-12 md:px-8">
            <p className="text-base font-medium text-white md:text-lg">
              Impressed by all these happy customers? Become one of them.
            </p>
            <Link
              href="/contact-us/#contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-navy transition-colors hover:bg-white/90"
            >
              Get Your Free Estimate
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      <FindWork content={findWorkContent} />
      <Instagram content={instagramContent} />
      <Contact content={contactContent} />
    </div>
  );
}
