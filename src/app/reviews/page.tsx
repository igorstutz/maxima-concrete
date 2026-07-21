import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, Star } from "lucide-react";
import { Container } from "@/components/Container";
import ElfsightWidget from "@/components/ElfsightWidget";
import Contact from "@/components/sections/home/Contact";
import FindWork from "@/components/sections/home/FindWork";
import home from "@/content/pages/home.json";
import googleReviews from "@/content/data/google-reviews.json";
import ReviewsMarquee from "./ReviewsMarquee";

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
const profileUrl =
  (home.sections.find((s) => s.type === "reviews")?.content as
    | { profileUrl?: string }
    | undefined)?.profileUrl ?? "";

interface GoogleReview {
  name: string;
  rating: number;
  comment: string;
  date: string;
  featured?: boolean;
  photo: string | null;
}

const reviews = googleReviews as GoogleReview[];
const totalReviews = reviews.length;
const positiveReviews = reviews.filter((r) => r.rating >= 5).length;
const averageRating =
  reviews.reduce((sum, r) => sum + r.rating, 0) / Math.max(totalReviews, 1);

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
              Real Reviews from
              <br />
              <span className="text-[#7DD3FC]">Real Customers</span>
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

      {/* CARROSSEL INFINITO DE REVIEWS + WIDGET ELFSIGHT (mesma faixa, sem gap) */}
      <section className="bg-surface-soft pb-16 pt-16 sm:pt-24 lg:pb-20">
        <Container>
          <div className="mb-8 md:mb-10">
            <h2 className="mb-3 text-2xl font-semibold leading-[115%] tracking-[-1.2px] text-navy md:text-3xl lg:text-[40px]">
              What Our Customers <span className="text-ocean">Are Saying</span>
            </h2>
            <p className="max-w-xl text-sm text-[#5A6B7B] md:text-base">
              Join the <strong className="text-navy">{positiveReviews}+</strong> homeowners who
              rated Maxima Concrete 5 stars on Google.
            </p>
          </div>
        </Container>

        {/* Carrossel infinito (client component) */}
        <Container>
          <ReviewsMarquee reviews={reviews} />
        </Container>

        {/* CTA */}
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

        {/* Reviews ao vivo do Google (Elfsight) */}
        <Container>
          <div className="mt-12">
            <ElfsightWidget widgetId={REVIEWS_WIDGET_ID} hideHeadings={HIDE_HEADINGS} />
          </div>
        </Container>
      </section>

      <FindWork content={findWorkContent} />
      <Contact content={contactContent} />
    </div>
  );
}
