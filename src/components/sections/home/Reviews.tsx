import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Container } from "@/components/Container";
import ElfsightWidget from "@/components/ElfsightWidget";

// Widget de reviews do Google (Elfsight) — mesmo ID do site antigo.
const REVIEWS_WIDGET_ID = "ede2daec-6946-4a1d-ae2f-bcb41f160474";

interface ReviewsContent {
  titlePart1?: string;
  titlePart2?: string;
  subtitle?: string;
  viewAllText?: string;
  profileUrl?: string;
}

export default function Reviews({ content }: { content: Record<string, any> }) {
  const c = content as ReviewsContent;

  return (
    <section id="reviews" className="bg-surface-soft py-12 sm:py-20">
      <Container>
        {/* Cabeçalho */}
        <div className="mb-8 flex flex-col items-start text-left md:mb-12">
          <h2 className="mb-3 text-2xl font-semibold leading-[115%] tracking-[-1.2px] text-navy md:mb-4 md:text-3xl lg:text-[40px]">
            <span>{c.titlePart1}</span>
            <span className="text-ocean">{c.titlePart2}</span>
          </h2>
          <p className="max-w-xl text-sm text-[#5A6B7B] md:text-base">{c.subtitle}</p>
        </div>

        {/* Widget Elfsight de reviews do Google (carrega ao entrar na viewport) */}
        <ElfsightWidget widgetId={REVIEWS_WIDGET_ID} />

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-start gap-3 md:mt-10">
          <Link
            href="/reviews"
            className="gradient-navy inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:scale-105"
          >
            See all reviews
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          {c.profileUrl && (
            <a
              href={c.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-navy shadow-sm transition-colors hover:border-ocean hover:text-ocean"
            >
              {c.viewAllText}
              <ChevronRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </Container>
    </section>
  );
}
