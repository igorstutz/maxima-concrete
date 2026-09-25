import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Info, Phone, Users, X } from "lucide-react";
import { Container } from "@/components/Container";
import CountUp from "@/components/CountUp";
import Image from "@/components/Image";
import { LyonBanner, LYON_APPLY_URL } from "@/components/LyonBanner";
import { ScrollReveal } from "@/components/ScrollReveal";
import Contact from "@/components/sections/home/Contact";
import { sanitizeHtml } from "@/components/sections/service/shared";
import home from "@/content/pages/home.json";
import page from "@/content/pages/lyonfinancing_page.json";
import FaqAccordion from "../FaqAccordion";

// Conteúdo da página (editável no CMS em Pages › Financing — Lyon Financial).
const sectionContent = (key: string): Record<string, any> =>
  page.sections.find((s) => s.key === key)?.content ?? {};

const seo = sectionContent("lyon_seo");
const hero = sectionContent("lyon_hero");
const answer = sectionContent("lyon_answer");
const timeline = sectionContent("lyon_timeline");
const benefits = sectionContent("lyon_benefits");
const compare = sectionContent("lyon_compare");
const about = sectionContent("lyon_about");
const faqSection = sectionContent("lyon_faq");
const cta = sectionContent("lyon_cta");
const disclaimer = sectionContent("lyon_disclaimer");

const SITE_URL = "https://maximaconcrete.com";
const PATH = "/financing/lyon/";

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: PATH },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: PATH,
    type: "website",
    ...(seo.ogImage ? { images: [{ url: seo.ogImage, alt: seo.ogImageAlt }] } : {}),
  },
};

type Fact = { label: string; value: string };
type Step = { title: string; text: string };

const contactContent =
  home.sections.find((s) => s.type === "contact")?.content ?? {};

const heroFacts: Fact[] = hero.facts ?? [];
const answerFacts: Fact[] = answer.facts ?? [];
const timelineItems: (Step & { day: string })[] = timeline.items ?? [];
const benefitItems: (Step & { image?: string })[] = benefits.items ?? [];
const aboutStats: Fact[] = (about.stats ?? []).map((s: { value: string; label: string }) => ({
  label: s.label,
  value: s.value,
}));
const faqItems: { question: string; answer: string }[] = faqSection.items ?? [];
const faqs = faqItems.map((item) => ({ q: item.question, a: item.answer }));

/**
 * Dados estruturados (SEO/AEO/GEO): a página, o caminho de navegação, a oferta
 * de crédito e o FAQ. Tudo sai do conteúdo do painel — mudou lá, muda aqui —
 * para o que o Google e os assistentes de IA leem ser o mesmo que o visitante vê.
 */
function structuredData() {
  const url = `${SITE_URL}${PATH}`;
  const org = { "@id": `${SITE_URL}/#organization` };
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: seo.title,
      description: seo.description,
      inLanguage: "en-US",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      publisher: org,
      about: { "@id": `${url}#offer` },
      ...(seo.ogImage ? { primaryImageOfPage: `${SITE_URL}${seo.ogImage}` } : {}),
      // Trechos que assistentes de voz/IA podem ler como resposta direta.
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [".lyon-quick-question", ".lyon-quick-answer"],
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Financing", item: `${SITE_URL}/financing/` },
        { "@type": "ListItem", position: 3, name: seo.breadcrumbLabel, item: url },
      ],
    },
    {
      "@type": "LoanOrCredit",
      "@id": `${url}#offer`,
      name: seo.offerName,
      description: seo.offerDescription,
      url,
      provider: {
        "@type": "Organization",
        name: seo.providerName,
        ...(seo.providerUrl ? { url: seo.providerUrl } : {}),
      },
      broker: org,
      ...(seo.areaServed ? { areaServed: seo.areaServed } : {}),
      ...(Number(seo.maxAmount)
        ? {
            amount: {
              "@type": "MonetaryAmount",
              currency: "USD",
              maxValue: Number(seo.maxAmount),
            },
          }
        : {}),
      ...(Number(seo.maxTermYears)
        ? {
            loanTerm: {
              "@type": "QuantitativeValue",
              maxValue: Number(seo.maxTermYears),
              unitCode: "ANN",
            },
          }
        : {}),
    },
  ];
  if (faqItems.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faqItems.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

/** Rótulo de seção no mesmo padrão da página /financing/. */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-10 bg-[hsl(210_100%_60%)]/60" />
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[hsl(210_100%_60%)]">
        {children}
      </p>
    </div>
  );
}

function SectionTitle({ part1, highlight }: { part1: string; highlight: string }) {
  return (
    <h2 className="mt-4 text-3xl font-bold leading-[1.1] text-white md:text-4xl lg:text-5xl">
      {part1} <span className="font-serif italic text-white/55">{highlight}</span>
    </h2>
  );
}

function ApplyButton({ label, className = "" }: { label: string; className?: string }) {
  return (
    <a
      href={LYON_APPLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`gradient-navy group inline-flex items-center justify-center gap-2 rounded-lg px-7 py-4 font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_18px_-8px_rgba(13,93,147,0.45)] ${className}`}
    >
      {label}
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
    </a>
  );
}

/** Um ano ("1979") não deve "contar" de zero; o resto anima. */
const isYear = (v: string) => /^\d{4}$/.test(v.trim());

export default function Page() {
  return (
    <div className="bg-[hsl(218_45%_8%)] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />

      {/* HERO — no desktop cabe numa tela (min-h-svh), conteúdo centralizado */}
      <section className="relative flex items-center overflow-hidden pb-16 pt-24 lg:min-h-svh lg:py-12">
        <div className="absolute inset-0 z-0">
          <Image
            src={hero.image}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="animate-hero-zoom object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, hsl(218 60% 5% / 0.94) 0%, hsl(216 55% 8% / 0.84) 45%, hsl(216 45% 12% / 0.55) 100%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[hsl(218_45%_8%)] to-transparent" />
          <div className="absolute right-[-5%] top-[-10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,hsl(200_100%_50%/0.3),transparent_65%)] blur-2xl" />
        </div>

        <Container className="relative z-10 w-full">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
            <div>
              <nav aria-label="Breadcrumb" className="text-sm font-medium">
                <Link href="/financing/" className="text-white/60 transition hover:text-white">
                  Financing
                </Link>
                <span className="mx-2 text-white/30">/</span>
                <span className="text-white/85">{seo.breadcrumbLabel}</span>
              </nav>

              <h1 className="mt-5 text-4xl font-bold leading-[1.02] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] md:text-5xl xl:text-[56px] 2xl:text-[64px]">
                {hero.titleLine1}
                <br />
                <span className="bg-gradient-to-r from-white to-[hsl(200_100%_55%)] bg-clip-text text-transparent">
                  {hero.titleHighlight}
                </span>
              </h1>
              <p className="mt-4 text-xl font-semibold text-[hsl(200_100%_62%)] md:text-2xl">
                {hero.subtitle}
              </p>
              {/* Aceita <strong> vindo do CMS; o resto de HTML é removido. */}
              <p
                className="mt-4 max-w-xl text-base leading-relaxed text-white/80 md:text-lg [&_strong]:font-semibold [&_strong]:text-white"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(hero.description ?? "") }}
              />
              <div className="mt-7 flex flex-wrap gap-3">
                <ApplyButton label={hero.ctaText} />
                <a
                  href={hero.phoneHref}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
                >
                  <Phone className="h-4 w-4" /> {hero.phone}
                </a>
              </div>
              <p className="mt-4 max-w-xl text-xs leading-relaxed text-white/50">
                {hero.footnote}
              </p>
            </div>

            {/* Cartão da oferta — ecoa a peça oficial do Lyon (fundo claro, logo escura) */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-[hsl(200_100%_50%)]/35 via-[hsl(210_100%_50%)]/15 to-transparent blur-3xl" />
              <div className="relative rotate-[1.5deg] rounded-3xl bg-white p-7 text-center text-[hsl(220_80%_30%)] shadow-2xl transition-transform duration-500 hover:rotate-0 md:p-9">
                <Image
                  src={about.logo}
                  alt="Lyon Financial"
                  width={814}
                  height={220}
                  className="mx-auto h-9 w-auto md:h-11"
                />
                <span className="mt-5 inline-block bg-[hsl(196_100%_47%)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                  {hero.cardBadge}
                </span>
                <p className="mt-4 text-xl font-bold uppercase leading-none tracking-tight md:text-2xl">
                  {hero.cardEyebrow}
                </p>
                <p className="mt-1 text-6xl font-black uppercase leading-none tracking-tight md:text-7xl">
                  {hero.cardAmount}
                </p>
                <p className="mt-3 font-semibold text-[hsl(196_100%_42%)]">{hero.cardTagline}</p>
                <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-[hsl(220_30%_90%)] pt-5">
                  {heroFacts.map((f) => (
                    <div key={f.label}>
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(220_15%_50%)]">
                        {f.label}
                      </dt>
                      <dd className="mt-1 text-sm font-bold md:text-base">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* RESPOSTA DIRETA (AEO) — pergunta + resposta curta que buscadores e IAs citam */}
      <section className="relative pb-20 md:pb-24">
        <Container>
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm md:p-10">
              <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[hsl(200_100%_50%)]/15 blur-3xl" />
              <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-[hsl(200_100%_62%)]">
                    {answer.eyebrow}
                  </p>
                  <h2 className="lyon-quick-question mt-3 text-2xl font-bold leading-snug text-white md:text-[28px]">
                    {answer.question}
                  </h2>
                  <p className="lyon-quick-answer mt-4 text-lg leading-relaxed text-white/75">
                    {answer.answer}
                  </p>
                </div>
                <dl className="grid grid-cols-2 gap-3 self-center">
                  {answerFacts.map((f) => (
                    <div
                      key={f.label}
                      className="rounded-2xl border border-white/10 bg-[hsl(218_50%_10%)]/60 p-4"
                    >
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                        {f.label}
                      </dt>
                      <dd className="mt-1 font-bold text-white">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* LINHA DO TEMPO — a janela de 90 dias desenhada */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(216_55%_14%)] via-[hsl(217_50%_11%)] to-[hsl(218_45%_8%)] py-20 md:py-28">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <Container className="relative">
          <div className="max-w-3xl">
            <Eyebrow>{timeline.eyebrow}</Eyebrow>
            <SectionTitle part1={timeline.titlePart1} highlight={timeline.titleHighlight} />
            <p className="mt-5 text-lg leading-relaxed text-white/65">{timeline.description}</p>
          </div>

          {/* Desktop: trilho horizontal, com a chave dos 90 dias entre os dois últimos marcos */}
          <div className="mt-16 hidden md:block">
            <div className="grid grid-cols-4">
              <div className="col-span-2" />
              <div className="col-span-2 mx-[25%] mb-4">
                <div className="flex items-center justify-center rounded-full border border-[hsl(200_100%_55%)]/40 bg-[hsl(200_100%_50%)]/10 px-4 py-1.5 text-center text-xs font-bold uppercase tracking-wider text-[hsl(200_100%_65%)]">
                  {timeline.windowLabel}
                </div>
                <div className="mx-0 mt-2 h-3 rounded-t-lg border-x-2 border-t-2 border-[hsl(200_100%_55%)]/50" />
              </div>
            </div>
            <div className="relative grid grid-cols-4">
              <div className="absolute left-[12.5%] right-[12.5%] top-[27px] h-0.5 bg-gradient-to-r from-[hsl(210_100%_55%)]/30 via-[hsl(210_100%_55%)]/60 to-[hsl(200_100%_55%)]" />
              {timelineItems.map((s, i) => {
                const isLast = i === timelineItems.length - 1;
                return (
                  <ScrollReveal key={s.title} delay={Math.min(i, 4)} className="relative px-4 text-center">
                    <div
                      className={`relative mx-auto flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold ${
                        isLast
                          ? "bg-gradient-to-br from-[hsl(200_100%_55%)] to-[hsl(210_100%_50%)] text-[hsl(218_60%_8%)] shadow-[0_0_30px_rgba(0,174,239,0.45)]"
                          : "border border-[hsl(210_100%_55%)]/50 bg-[hsl(217_50%_11%)] text-[hsl(210_100%_62%)] shadow-[0_0_20px_rgba(30,144,255,0.18)]"
                      }`}
                    >
                      0{i + 1}
                    </div>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[hsl(200_100%_62%)]">
                      {s.day}
                    </p>
                    <h3 className="mt-2 text-xl font-bold tracking-tight text-white">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{s.text}</p>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>

          {/* Celular: trilho vertical */}
          <ol className="relative mt-12 space-y-8 border-l border-[hsl(210_100%_55%)]/40 pl-8 md:hidden">
            {timelineItems.map((s, i) => {
              const isLast = i === timelineItems.length - 1;
              return (
                <li key={s.title} className="relative">
                  <span
                    className={`absolute -left-[49px] flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      isLast
                        ? "bg-[hsl(200_100%_55%)] text-[hsl(218_60%_8%)]"
                        : "border border-[hsl(210_100%_55%)]/50 bg-[hsl(217_50%_11%)] text-[hsl(210_100%_62%)]"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(200_100%_62%)]">
                    {s.day}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-white">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">{s.text}</p>
                  {isLast && (
                    <p className="mt-3 inline-block rounded-full border border-[hsl(200_100%_55%)]/40 bg-[hsl(200_100%_50%)]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[hsl(200_100%_65%)]">
                      {timeline.windowLabel}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      {/* BENEFÍCIOS — cartões com foto de obra */}
      <section className="relative overflow-hidden bg-[hsl(218_45%_8%)] py-20 md:py-24">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[hsl(210_100%_50%)]/10 blur-3xl" />
        <Container className="relative">
          <div className="max-w-3xl">
            <Eyebrow>{benefits.eyebrow}</Eyebrow>
            <SectionTitle part1={benefits.titlePart1} highlight={benefits.titleHighlight} />
            <p className="mt-5 text-lg leading-relaxed text-white/65">{benefits.description}</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {benefitItems.map((b, i) => (
              <ScrollReveal key={b.title} delay={Math.min(i, 4)} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(210_100%_60%)]/50">
                  <div className="relative h-52 overflow-hidden">
                    {b.image && (
                      <Image
                        src={b.image}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 30vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(218_50%_9%)] via-[hsl(218_50%_9%)]/30 to-transparent" />
                    <span className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(200_100%_50%)] shadow-lg">
                      <Check className="h-5 w-5 text-white" strokeWidth={3} />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-7 pt-2">
                    <h3 className="text-xl font-bold tracking-tight text-white">{b.title}</h3>
                    <p className="mt-3 leading-relaxed text-white/65">{b.text}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ESPERAR x CONSTRUIR AGORA */}
      <section className="relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-[hsl(218_45%_8%)] to-[hsl(217_50%_11%)] py-20 md:py-24">
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[hsl(210_100%_60%)]">
              {compare.eyebrow}
            </p>
            <SectionTitle part1={compare.titlePart1} highlight={compare.titleHighlight} />
          </div>

          <div className="relative mt-14 grid gap-6 md:grid-cols-2 md:gap-10">
            <span className="absolute left-1/2 top-1/2 z-10 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[hsl(218_50%_10%)] text-sm font-black text-white/70 md:flex">
              VS
            </span>
            <ScrollReveal direction="left">
              <div className="h-full rounded-3xl border border-white/10 bg-white/[0.02] p-7 md:p-9">
                <h3 className="text-xl font-bold text-white/60">{compare.leftTitle}</h3>
                <ul className="mt-6 space-y-4">
                  {(compare.leftItems ?? []).map((item: string) => (
                    <li key={item} className="flex items-start gap-3 text-white/50">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5">
                        <X className="h-3.5 w-3.5" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="relative h-full overflow-hidden rounded-3xl border border-[hsl(200_100%_55%)]/40 bg-gradient-to-br from-[hsl(209_100%_22%)] via-[hsl(213_60%_14%)] to-[hsl(218_50%_10%)] p-7 shadow-[0_0_60px_-20px_rgba(0,174,239,0.5)] md:p-9">
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[hsl(200_100%_50%)]/20 blur-3xl" />
                <h3 className="relative text-xl font-bold text-white">{compare.rightTitle}</h3>
                <ul className="relative mt-6 space-y-4">
                  {(compare.rightItems ?? []).map((item: string) => (
                    <li key={item} className="flex items-start gap-3 font-medium text-white">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[hsl(200_100%_50%)]">
                        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <ApplyButton label={hero.ctaText} className="relative mt-8" />
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* SOBRE O LYON */}
      <section className="relative overflow-hidden bg-[hsl(218_45%_8%)] py-20 md:py-24">
        <Container className="relative">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            <div>
              <Eyebrow>{about.eyebrow}</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold leading-[1.1] text-white md:text-4xl">
                {about.title}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/65">{about.text}</p>
              <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(209_100%_45%)] to-[hsl(210_100%_45%)]">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">{about.ownedTitle}</p>
                  <p className="text-sm text-white/60">{about.ownedText}</p>
                </div>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-4">
              {aboutStats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col-reverse rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 transition-colors hover:border-[hsl(210_100%_60%)]/50 md:p-7"
                >
                  <dt className="mt-2 text-xs font-semibold uppercase tracking-wider text-white/50">
                    {s.label}
                  </dt>
                  <dd className="text-3xl font-black tracking-tight text-white md:text-4xl">
                    {isYear(s.value) ? s.value : <CountUp value={s.value} />}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Banner oficial do Lyon (material do parceiro) */}
          <LyonBanner className="mt-12" />

          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:flex-row md:items-center">
            <p className="text-white/80">{about.compareText}</p>
            <Link
              href={about.compareLink}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
            >
              {about.compareCta} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(218_45%_8%)] to-[hsl(218_50%_6%)] py-20 md:py-24">
        <Container className="relative">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <div>
              <Eyebrow>{faqSection.eyebrow}</Eyebrow>
              <SectionTitle part1={faqSection.titlePart1} highlight={faqSection.titleHighlight} />
            </div>
            <FaqAccordion faqs={faqs} />
          </div>
        </Container>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0">
          {cta.image && (
            <Image src={cta.image} alt="" aria-hidden fill sizes="100vw" className="object-cover" />
          )}
          <div className="absolute inset-0 bg-[hsl(218_60%_6%)]/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(218_50%_6%)] via-transparent to-[hsl(218_50%_6%)]" />
        </div>
        <Container className="relative text-center">
          <ScrollReveal direction="scale">
            <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
              {cta.titleLine1}
              <br />
              <span className="bg-gradient-to-r from-white to-[hsl(200_100%_55%)] bg-clip-text text-transparent">
                {cta.titleLine2}
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">{cta.text}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <ApplyButton label={cta.ctaText} />
              <Link
                href={cta.secondaryLink}
                className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                {cta.secondaryText}
              </Link>
            </div>
          </ScrollReveal>
          <div className="mx-auto mt-14 flex max-w-3xl gap-3 text-left text-xs leading-relaxed text-white/50">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-white/35" />
            <p>{disclaimer.text}</p>
          </div>
        </Container>
      </section>

      <Contact content={contactContent} />
    </div>
  );
}
