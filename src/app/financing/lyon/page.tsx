import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Info, Phone, Users } from "lucide-react";
import { Container } from "@/components/Container";
import Image from "@/components/Image";
import { LyonBanner, LYON_APPLY_URL } from "@/components/LyonBanner";
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
const benefits = sectionContent("lyon_benefits");
const stepsSection = sectionContent("lyon_steps");
const about = sectionContent("lyon_about");
const faqSection = sectionContent("lyon_faq");
const disclaimer = sectionContent("lyon_disclaimer");

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: "/financing/lyon/" },
};

const contactContent =
  home.sections.find((s) => s.type === "contact")?.content ?? {};

const facts: { label: string; value: string }[] = hero.facts ?? [];
const benefitItems: { title: string; text: string }[] = benefits.items ?? [];
const steps: { title: string; text: string }[] = stepsSection.items ?? [];
const faqs: { q: string; a: string }[] = (faqSection.items ?? []).map(
  (item: { question: string; answer: string }) => ({ q: item.question, a: item.answer }),
);

/** Azul-ciano da peça original do Lyon — usado só nos detalhes da oferta. */
const LYON_CYAN = "hsl(196 100% 47%)";

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

export default function Page() {
  return (
    <div className="bg-[hsl(218_45%_8%)] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden pb-24 pt-28 lg:pb-32 lg:pt-32">
        <div className="absolute inset-0 z-0">
          <Image
            src={hero.image}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, hsl(218 60% 5% / 0.94) 0%, hsl(216 55% 8% / 0.84) 45%, hsl(216 45% 12% / 0.62) 100%)",
            }}
          />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[hsl(218_60%_6%)] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[hsl(218_45%_8%)] via-[hsl(218_45%_8%)]/70 to-transparent" />
          <div className="absolute right-[-5%] top-[-10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,hsl(200_100%_50%/0.3),transparent_65%)] blur-2xl" />
        </div>

        <Container className="relative z-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div>
              <Link
                href="/financing/"
                className="text-sm font-medium text-white/60 transition hover:text-white"
              >
                Financing
              </Link>
              <span className="mx-2 text-white/30">/</span>
              <span className="text-sm font-medium text-white/85">Lyon Financial</span>

              <h1 className="mt-6 text-4xl font-bold leading-[1.02] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] md:text-5xl lg:text-[68px]">
                {hero.titleLine1}
                <br />
                <span className="bg-gradient-to-r from-white to-[hsl(200_100%_55%)] bg-clip-text text-transparent">
                  {hero.titleHighlight}
                </span>
              </h1>
              <p className="mt-5 text-xl font-semibold text-[hsl(200_100%_62%)] md:text-2xl">
                {hero.subtitle}
              </p>
              {/* Aceita <strong> vindo do CMS; o resto de HTML é removido. */}
              <p
                className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85 [&_strong]:font-semibold [&_strong]:text-white"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(hero.description ?? "") }}
              />
              <div className="mt-9 flex flex-wrap gap-3">
                <ApplyButton label={hero.ctaText} />
                <a
                  href={hero.phoneHref}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
                >
                  <Phone className="h-4 w-4" /> {hero.phone}
                </a>
              </div>
              <p className="mt-5 max-w-xl text-xs leading-relaxed text-white/55">
                {hero.footnote}
              </p>
            </div>

            {/* Cartão da oferta — ecoa a peça oficial do Lyon (fundo claro, logo escura) */}
            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-[hsl(200_100%_50%)]/35 via-[hsl(210_100%_50%)]/15 to-transparent blur-3xl" />
              <div className="relative rounded-3xl bg-white p-8 text-center text-[hsl(220_80%_30%)] shadow-2xl md:p-10">
                <Image
                  src={about.logo}
                  alt="Lyon Financial"
                  width={814}
                  height={220}
                  className="mx-auto h-10 w-auto md:h-12"
                />
                <span
                  className="mt-6 inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
                  style={{ backgroundColor: LYON_CYAN }}
                >
                  {hero.cardBadge}
                </span>
                <p className="mt-5 text-2xl font-bold uppercase leading-none tracking-tight md:text-3xl">
                  {hero.cardEyebrow}
                </p>
                <p className="mt-1 text-6xl font-black uppercase leading-none tracking-tight md:text-7xl">
                  {hero.cardAmount}
                </p>
                <p className="mt-4 font-semibold" style={{ color: LYON_CYAN }}>
                  {hero.cardTagline}
                </p>
                <dl className="mt-7 grid grid-cols-3 gap-3 border-t border-[hsl(220_30%_90%)] pt-6">
                  {facts.map((f) => (
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

      {/* BENEFÍCIOS */}
      <section className="relative overflow-hidden border-t border-white/5 bg-[hsl(218_45%_8%)] py-20 md:py-24">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[hsl(210_100%_50%)]/10 blur-3xl" />
        <Container className="relative">
          <div className="max-w-3xl">
            <Eyebrow>{benefits.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold leading-[1.1] text-white md:text-4xl lg:text-5xl">
              {benefits.titlePart1}{" "}
              <span className="font-serif italic text-white/55">{benefits.titleHighlight}</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/65">{benefits.description}</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {benefitItems.map((b) => (
              <div
                key={b.title}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[hsl(210_100%_60%)]/50"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-[hsl(200_100%_50%)]/30 to-[hsl(210_100%_50%)]/20">
                  <Check className="h-5 w-5 text-[hsl(200_100%_62%)]" strokeWidth={3} />
                </div>
                <h3 className="mt-5 text-xl font-bold tracking-tight text-white">{b.title}</h3>
                <p className="mt-3 leading-relaxed text-white/65">{b.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl border border-[hsl(210_100%_60%)]/25 bg-gradient-to-br from-[hsl(209_100%_22%)] via-[hsl(213_60%_14%)] to-[hsl(218_50%_10%)] p-8 md:flex-row md:items-center md:p-10">
            <p className="text-2xl font-bold leading-snug text-white md:text-3xl">
              {benefits.closingLine1}
              <br />
              <span className="text-[hsl(200_100%_62%)]">{benefits.closingLine2}</span>
            </p>
            <ApplyButton label={hero.ctaText} className="shrink-0" />
          </div>
        </Container>
      </section>

      {/* COMO FUNCIONA */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(216_55%_14%)] via-[hsl(217_50%_11%)] to-[hsl(218_45%_8%)] py-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <Container className="relative">
          <div className="max-w-3xl">
            <Eyebrow>{stepsSection.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold leading-[1.1] text-white md:text-4xl lg:text-5xl">
              {stepsSection.titlePart1}{" "}
              <span className="font-serif italic text-white/55">
                {stepsSection.titleHighlight}
              </span>
            </h2>
          </div>

          <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((s, i) => {
              const isLast = i === steps.length - 1;
              return (
                <li key={s.title} className="relative">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-bold ${
                      isLast
                        ? "bg-gradient-to-br from-[hsl(210_100%_55%)] to-[hsl(210_100%_50%)] text-[hsl(218_60%_8%)] shadow-[0_0_30px_rgba(30,144,255,0.35)]"
                        : "border border-[hsl(210_100%_55%)]/50 bg-[hsl(217_50%_11%)] text-[hsl(210_100%_56%)] shadow-[0_0_20px_rgba(30,144,255,0.18)]"
                    }`}
                  >
                    0{i + 1}
                  </div>
                  <h3 className="mt-6 text-2xl font-bold tracking-tight text-white">{s.title}</h3>
                  <p className="mt-3 leading-relaxed text-white/65">{s.text}</p>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      {/* SOBRE O LYON */}
      <section className="relative overflow-hidden border-t border-white/5 bg-[hsl(218_45%_8%)] py-20 md:py-24">
        <Container className="relative">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
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

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 md:p-8">
              <ul className="space-y-4">
                {facts.map((f) => (
                  <li key={f.label} className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <span className="text-sm uppercase tracking-wider text-white/55">{f.label}</span>
                    <span className="text-lg font-bold text-white">{f.value}</span>
                  </li>
                ))}
              </ul>
              <ApplyButton label={hero.ctaText} className="mt-7 w-full" />
            </div>
          </div>

          {/* Banner oficial do Lyon (material do parceiro) */}
          <LyonBanner className="mt-12" />

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-white/80">{about.compareText}</p>
            <Link
              href={about.compareLink}
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
            >
              {about.compareCta} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* FAQ + TERMOS */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(218_45%_8%)] to-[hsl(218_50%_5%)] pb-24 pt-8">
        <Container className="relative">
          <div className="max-w-[1000px]">
            <Eyebrow>{faqSection.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold leading-[1.1] text-white md:text-4xl lg:text-5xl">
              {faqSection.titlePart1}{" "}
              <span className="font-serif italic text-white/55">{faqSection.titleHighlight}</span>
            </h2>
            <div className="mt-12">
              <FaqAccordion faqs={faqs} />
            </div>

            <div className="mt-12 flex gap-3 text-xs leading-relaxed text-white/50">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-white/35" />
              <p>{disclaimer.text}</p>
            </div>
          </div>
        </Container>
      </section>

      <Contact content={contactContent} />
    </div>
  );
}
