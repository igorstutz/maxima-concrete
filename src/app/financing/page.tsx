import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  FileCheck,
  Hammer,
  Phone,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/Container";
import Image from "@/components/Image";
import { LyonBanner, LYON_APPLY_URL } from "@/components/LyonBanner";
import Contact from "@/components/sections/home/Contact";
import FindWork from "@/components/sections/home/FindWork";
import { sanitizeHtml } from "@/components/sections/service/shared";
import home from "@/content/pages/home.json";
import page from "@/content/pages/financing_page.json";
import FaqAccordion from "./FaqAccordion";

const HEARTH_APPLY_URL =
  "https://app.gethearth.com/financing/19313/27602/prequalify?utm_campaign=19313&utm_content=white&utm_medium=contractor-website&utm_source=contractor&utm_term=27602";

export const metadata: Metadata = {
  title: "Maxima Concrete - Concrete Financing in Ohio | Maxima Concrete",
  description:
    "Flexible financing for driveways, patios, pool decks and more. Fast pre-qualification, $0 down options, and trusted lending partners across Ohio.",
  alternates: { canonical: "/financing/" },
};

const contactContent =
  home.sections.find((s) => s.type === "contact")?.content ?? {};
const findWorkContent =
  home.sections.find((s) => s.type === "find-work")?.content ?? {};

// Conteúdo da página (editável no CMS em Pages › Financing).
const sectionContent = (key: string): Record<string, any> =>
  page.sections.find((s) => s.key === key)?.content ?? {};
const hero = sectionContent("financing_hero");
const partnersSection = sectionContent("financing_partners");
const stepsSection = sectionContent("financing_steps");
const quote = sectionContent("financing_quote");
const highlightsSection = sectionContent("financing_highlights");
const faqSection = sectionContent("financing_faq");

/** Nomes de ícone aceitos no JSON de conteúdo. */
const ICONS: Record<string, LucideIcon> = {
  Clock,
  DollarSign,
  ShieldCheck,
  Sparkles,
  FileCheck,
  BadgePercent,
  Hammer,
};

const steps: { title: string; text: string }[] = stepsSection.items ?? [];
const highlights: { icon: string; title: string; text: string }[] =
  highlightsSection.items ?? [];

interface Partner {
  name: string;
  logo?: string;
  tagline: string;
  description: string;
  facts: { label: string; value: string }[];
  ctaLabel: string;
  /** Qual credor abrir — a URL fica no código porque carrega o ID da indicação. */
  partner: string;
}

const partners: Partner[] = partnersSection.items ?? [];
const applyUrl = (p: Partner) =>
  p.partner === "lyon" ? LYON_APPLY_URL : HEARTH_APPLY_URL;

const faqs: { q: string; a: string }[] = (faqSection.items ?? []).map(
  (item: { question: string; answer: string }) => ({ q: item.question, a: item.answer }),
);

/** Divider fino com legenda central (mesmo padrão do site antigo). */
function Divider({ label }: { label: string }) {
  return (
    <div className="bg-[hsl(218_45%_8%)]">
      <Container className="flex items-center gap-6 py-4 md:py-5">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-white/5" />
        <div className="flex items-center gap-2 text-[hsl(210_100%_56%)]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(210_100%_56%)]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">{label}</span>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(210_100%_56%)]" />
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/15 to-white/5" />
      </Container>
    </div>
  );
}

export default function Page() {
  return (
    <div className="bg-[hsl(218_45%_8%)] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden pb-24 pt-28 lg:pb-32 lg:pt-32">
        {/* Fundo com overlay cinematográfico */}
        <div className="absolute inset-0 z-0">
          <Image
            src={hero.image}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ filter: "saturate(1.05) contrast(1.05)" }}
          />
          {/* Vinheta escura */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, hsl(218 60% 5% / 0.9) 0%, hsl(216 55% 8% / 0.78) 40%, hsl(216 45% 12% / 0.6) 65%, hsl(216 45% 12% / 0.4) 100%)",
            }}
          />
          {/* Fades superior/inferior */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[hsl(218_60%_6%)] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[hsl(218_45%_8%)] via-[hsl(218_45%_8%)]/70 to-transparent" />
          {/* Orbes de luz */}
          <div
            className="absolute right-[-5%] top-[-10%] h-[600px] w-[600px] animate-pulse rounded-full bg-[radial-gradient(circle,hsl(210_100%_55%/0.35),transparent_65%)] blur-2xl"
            style={{ animationDuration: "6s" }}
          />
          <div className="absolute bottom-[-15%] left-[5%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,hsl(210_100%_50%/0.22),transparent_70%)] blur-3xl" />
          {/* Grade */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(0 0% 100% / 1) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 1) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage: "radial-gradient(ellipse 80% 70% at 60% 40%, black 20%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 70% at 60% 40%, black 20%, transparent 80%)",
            }}
          />
          {/* Linhas diagonais */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent 0 22px, hsl(210 100% 56% / 0.5) 22px 23px)",
              maskImage: "linear-gradient(115deg, transparent 30%, black 70%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(115deg, transparent 30%, black 70%, transparent 100%)",
            }}
          />
          {/* Pontilhado no canto superior esquerdo */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.25]"
            style={{
              backgroundImage: "radial-gradient(hsl(0 0% 100% / 0.6) 1px, transparent 1.5px)",
              backgroundSize: "22px 22px",
              maskImage: "radial-gradient(circle at 15% 25%, black 0%, transparent 35%)",
              WebkitMaskImage: "radial-gradient(circle at 15% 25%, black 0%, transparent 35%)",
            }}
          />
          {/* Grão */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.1] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
            }}
          />
        </div>

        <Container className="relative z-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-[0_4px_30px_-10px_hsl(210_100%_60%/0.6)] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(210_100%_60%)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(210_100%_60%)]" />
                </span>
                <CreditCard className="h-4 w-4 text-[hsl(210_100%_56%)]" />
                {hero.badge}
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-[1.02] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] md:text-5xl lg:text-[68px]">
                {hero.titleLine1}
                <br />
                {/* Branco -> azul da marca. As três paradas anteriores eram
                    tons de azul claro que não existem na identidade. */}
                <span className="bg-gradient-to-r from-white to-[hsl(210_100%_56%)] bg-clip-text text-transparent">
                  {hero.titleHighlight}
                </span>
              </h1>
              {/* O texto vem do CMS e aceita <strong> para destacar os nomes
                  dos parceiros; o resto de HTML é removido. */}
              <p
                className="mt-7 max-w-2xl text-lg leading-relaxed text-white/85 [&_strong]:font-semibold [&_strong]:text-white md:text-xl"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(hero.description ?? "") }}
              />
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href={HEARTH_APPLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gradient-navy group inline-flex items-center gap-2 rounded-lg px-7 py-4 font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_18px_-8px_rgba(13,93,147,0.45)]"
                >
                  {hero.ctaText}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>
                <a
                  href={hero.phoneHref}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
                >
                  <Phone className="h-4 w-4" /> {hero.phone}
                </a>
              </div>

              {/* Faixa de confiança */}
              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm text-white/75">
                {(hero.trustItems ?? []).map((item: string) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[hsl(210_100%_60%)]" /> {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Cartão de simulação (vidro) */}
            <div className="relative hidden lg:block">
              <div
                className="absolute -inset-6 animate-pulse rounded-3xl bg-gradient-to-br from-[hsl(210_100%_56%)]/40 via-[hsl(209_100%_50%)]/20 to-transparent blur-3xl"
                style={{ animationDuration: "5s" }}
              />
              <div className="absolute -left-5 -top-5 z-10 rotate-[-6deg] rounded-full bg-[hsl(210_100%_55%)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[hsl(218_60%_8%)] shadow-lg shadow-[hsl(210_100%_55%)]/40">
                {hero.cardBadge}
              </div>
              <div className="relative rounded-3xl border border-white/15 bg-white/[0.07] p-8 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                    {hero.cardLabel}
                  </span>
                  <BadgePercent className="h-5 w-5 text-[hsl(210_100%_60%)]" />
                </div>
                <div className="mt-6">
                  <div className="text-5xl font-bold text-white">
                    {hero.cardAmount}
                    <span className="text-xl font-medium text-white/60">
                      {hero.cardAmountSuffix}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/60">{hero.cardNote}</p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {(hero.cardStats ?? []).map((stat: { label: string; value: string }) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="text-xs uppercase tracking-wider text-white/50">
                        {stat.label}
                      </div>
                      <div className="mt-1 text-lg font-bold text-white">{stat.value}</div>
                    </div>
                  ))}
                </div>
                <a
                  href={HEARTH_APPLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gradient-navy mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold text-white transition hover:opacity-90"
                >
                  {hero.cardCtaText}
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* LENDING PARTNERS */}
      <section className="relative overflow-hidden border-t border-white/5 bg-[hsl(218_45%_8%)] py-20 md:py-24">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[hsl(210_100%_50%)]/10 blur-3xl" />
        <Container className="relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[hsl(210_100%_60%)]/60" />
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[hsl(210_100%_60%)]">
                {partnersSection.eyebrow}
              </p>
            </div>
            <h2 className="mt-4 text-3xl font-bold leading-[1.1] text-white md:text-4xl lg:text-5xl">
              {partnersSection.titlePart1}{" "}
              <span className="font-serif italic text-white/55">
                {partnersSection.titleHighlight}
              </span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/65">
              {partnersSection.description}
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {partners.map((p) => (
              <div
                key={p.name}
                className="relative flex flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[hsl(210_100%_60%)]/50 md:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* A logo do Lyon é escura: precisa de fundo claro no tema dark */}
                  {p.logo ? (
                    <span className="inline-flex items-center rounded-xl bg-white px-4 py-3">
                      <Image
                        src={p.logo}
                        alt={p.name}
                        width={814}
                        height={220}
                        className="h-6 w-auto md:h-7"
                      />
                    </span>
                  ) : (
                    <span className="text-2xl font-bold tracking-tight text-white md:text-[28px]">
                      {p.name}
                    </span>
                  )}
                  <span className="shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/80">
                    {p.tagline}
                  </span>
                </div>

                <p className="mt-5 leading-relaxed text-white/65">{p.description}</p>

                {/* Absorve a sobra de altura para os dois cards alinharem os
                    números e os botões na mesma linha. */}
                <div className="grow" />

                <dl className="mt-7 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
                  {p.facts.map((f) => (
                    <div key={f.label}>
                      <dt className="text-[11px] uppercase tracking-wider text-white/50">
                        {f.label}
                      </dt>
                      <dd className="mt-1 text-base font-bold text-white md:text-lg">{f.value}</dd>
                    </div>
                  ))}
                </dl>

                <a
                  href={applyUrl(p)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gradient-navy group mt-7 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 font-semibold text-white transition-all hover:-translate-y-0.5 hover:brightness-110"
                >
                  {p.ctaLabel}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>
              </div>
            ))}
          </div>

          {/* Banner oficial do Lyon (material do parceiro) */}
          <LyonBanner className="mt-8" />
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(216_55%_14%)] via-[hsl(217_50%_11%)] to-[hsl(218_45%_8%)] py-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-[hsl(209_100%_56%)]/10 blur-3xl" />

        <Container className="relative">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Coluna esquerda — título */}
            <div className="space-y-7 lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(210_100%_55%)]/30 bg-[hsl(210_100%_55%)]/10 px-4 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(210_100%_60%)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(210_100%_60%)]" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(210_100%_56%)]">
                  {stepsSection.eyebrow}
                </span>
              </div>

              <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl">
                {stepsSection.titlePart1}
                <br />
                <span className="bg-gradient-to-r from-[hsl(210_100%_56%)] to-[hsl(209_100%_60%)] bg-clip-text text-transparent">
                  {stepsSection.titleHighlight}
                </span>
              </h2>

              <p className="max-w-sm text-lg leading-relaxed text-white/65">
                {stepsSection.description}
              </p>
            </div>

            {/* Coluna direita — passos */}
            <div className="relative lg:col-span-7">
              <div className="absolute bottom-0 left-8 top-0 hidden w-px bg-gradient-to-b from-[hsl(210_100%_55%)]/50 via-[hsl(210_100%_55%)]/20 to-transparent md:block" />

              <div className="space-y-14">
                {steps.map((s, i) => {
                  const isLast = i === steps.length - 1;
                  return (
                    <div key={s.title} className="group relative flex items-start gap-8">
                      <div
                        className={`relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-lg font-bold transition-all duration-300 ${
                          isLast
                            ? "bg-gradient-to-br from-[hsl(210_100%_55%)] to-[hsl(210_100%_50%)] text-[hsl(218_60%_8%)] shadow-[0_0_30px_rgba(30,144,255,0.35)]"
                            : "border border-[hsl(210_100%_55%)]/50 bg-[hsl(217_50%_11%)] text-[hsl(210_100%_56%)] shadow-[0_0_20px_rgba(30,144,255,0.18)] group-hover:shadow-[0_0_30px_rgba(30,144,255,0.4)]"
                        }`}
                      >
                        0{i + 1}
                      </div>
                      <div className="pt-2">
                        <h3 className="mb-3 text-2xl font-bold tracking-tight text-white">
                          {s.title}
                        </h3>
                        <p className="max-w-md leading-relaxed text-white/65">{s.text}</p>
                      </div>
                      <span className="pointer-events-none absolute -left-4 -top-8 hidden select-none text-9xl font-black text-white/[0.035] md:block">
                        0{i + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Divider label={quote.dividerLabel} />

      {/* FEATURE QUOTE */}
      <section className="relative overflow-hidden bg-[hsl(218_45%_8%)] pb-20 pt-6 md:pb-28 md:pt-8">
        <div className="pointer-events-none absolute left-0 top-1/2 h-[450px] w-[450px] -translate-y-1/2 rounded-full bg-[hsl(210_100%_50%)]/10 blur-3xl" />
        <Container className="relative">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            {/* Imagem com chip flutuante */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                <Image
                  src={quote.image}
                  alt={quote.imageAlt}
                  width={1280}
                  height={960}
                  className="h-[380px] w-full object-cover md:h-[480px]"
                />
                <div className="absolute inset-0 bg-black/55" />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(218_60%_4%)]/95 via-[hsl(218_60%_6%)]/55 to-[hsl(218_60%_6%)]/25" />
                <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[hsl(218_60%_6%)]/70 px-3 py-1.5 backdrop-blur-md">
                  <span className="text-sm tracking-tight text-[hsl(45_100%_60%)]">★★★★★</span>
                  <span className="text-xs font-semibold text-white/80">{quote.rating}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 md:p-7">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                      {quote.verifiedLabel}
                    </p>
                    <p className="mt-1 text-lg font-bold text-white">{quote.customerName}</p>
                  </div>
                  <p className="font-mono text-xs text-[hsl(210_100%_60%)]">{quote.customerCity}</p>
                </div>
              </div>
              {/* Cartão "recibo" flutuante */}
              <div className="absolute -bottom-8 -right-6 hidden w-[260px] rotate-3 rounded-2xl border border-white/15 bg-gradient-to-b from-[hsl(218_50%_14%)] to-[hsl(218_55%_9%)] p-5 shadow-2xl md:block lg:-right-10">
                <div className="flex items-center justify-between border-b border-dashed border-white/15 pb-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                    {quote.receiptLabel}
                  </span>
                  <Wallet className="h-4 w-4 text-[hsl(210_100%_60%)]" />
                </div>
                <div className="mt-3 text-3xl font-black text-white">
                  {quote.receiptAmount}
                  <span className="text-sm font-medium text-white/50">{quote.receiptSuffix}</span>
                </div>
                <p className="mt-1 text-xs text-white/55">{quote.receiptNote}</p>
                <div className="mt-3 flex items-center gap-1.5 border-t border-dashed border-white/15 pt-3 text-[11px] font-semibold text-[hsl(210_100%_56%)]">
                  <TrendingUp className="h-3 w-3" /> {quote.receiptApproved}
                </div>
              </div>
            </div>

            {/* Depoimento editorial */}
            <div className="relative">
              <span className="font-serif text-7xl leading-none text-[hsl(210_100%_60%)]/40 md:text-8xl">
                &ldquo;
              </span>
              <p className="-mt-6 text-2xl font-bold leading-[1.2] text-white md:text-3xl lg:text-[2rem]">
                {quote.quotePart1}{" "}
                <span className="font-serif italic text-[hsl(210_100%_56%)]">
                  {quote.quoteHighlight}
                </span>{" "}
                {quote.quotePart2}
              </p>
              <p className="mt-6 leading-relaxed text-white/65">{quote.description}</p>
              <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(209_100%_45%)] to-[hsl(210_100%_45%)] text-lg font-bold text-white">
                  {quote.authorInitial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{quote.authorName}</p>
                  <p className="text-xs text-white/55">{quote.authorNote}</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* HIGHLIGHTS — bento grid */}
      <section className="relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-[hsl(216_55%_14%)] via-[hsl(217_50%_11%)] to-[hsl(218_45%_8%)] py-24">
        <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-[hsl(216_100%_27%)]/25 blur-3xl" />
        <Container className="relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[hsl(210_100%_60%)]/60" />
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[hsl(210_100%_60%)]">
                {highlightsSection.eyebrow}
              </p>
            </div>
            <h2 className="mt-4 text-3xl font-bold leading-[1.1] text-white md:text-4xl lg:text-5xl">
              {highlightsSection.titlePart1}{" "}
              <span className="font-serif italic text-white/55">
                {highlightsSection.titleHighlight}
              </span>
            </h2>
          </div>

          {/* Bento grid */}
          <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-4 md:grid-cols-4">
            {/* Tile principal 2x2 */}
            <div className="relative col-span-2 row-span-2 flex flex-col justify-between overflow-hidden rounded-2xl border border-[hsl(210_100%_60%)]/25 bg-gradient-to-br from-[hsl(209_100%_22%)] via-[hsl(213_60%_14%)] to-[hsl(218_50%_10%)] p-8">
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[hsl(210_100%_50%)]/15 blur-3xl" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/90">
                  <Zap className="h-3 w-3" /> {highlightsSection.tileBadge}
                </div>
                <p className="mt-6 text-6xl font-black leading-none text-white md:text-7xl">
                  {highlightsSection.tileAmount}
                  <span className="ml-1 text-2xl font-medium text-white/60">
                    {highlightsSection.tileAmountSuffix}
                  </span>
                </p>
                <p className="mt-3 max-w-sm leading-relaxed text-white/70">
                  {highlightsSection.tileText}
                </p>
              </div>
              <div className="relative grid grid-cols-2 gap-3 border-t border-white/10 pt-6">
                {(highlightsSection.tileStats ?? []).map(
                  (stat: { label: string; value: string }) => (
                    <div key={stat.label}>
                      <p className="text-xs uppercase tracking-wider text-white/50">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-xl font-bold text-white">{stat.value}</p>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Tiles menores */}
            {highlights.map((h) => {
              const Icon = ICONS[h.icon] ?? Clock;
              return (
              <div
                key={h.title}
                className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[hsl(210_100%_60%)]/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-[hsl(209_100%_56%)]/30 to-[hsl(210_100%_50%)]/20">
                  <Icon className="h-4 w-4 text-[hsl(210_100%_56%)]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{h.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-snug text-white/60">{h.text}</p>
                </div>
              </div>
              );
            })}
          </div>

          {/* Garantias em linha */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-6">
            {(highlightsSection.guarantees ?? []).map((item: string) => (
              <div key={item} className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle2 className="h-4 w-4 text-[hsl(210_100%_56%)]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Divider label={faqSection.dividerLabel} />

      {/* FAQ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(218_45%_8%)] to-[hsl(218_50%_5%)] pb-24 pt-6 md:pt-8">
        <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[hsl(209_100%_45%)]/10 blur-3xl" />
        <Container className="relative">
          <div className="max-w-[1000px]">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[hsl(210_100%_60%)]/60" />
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[hsl(210_100%_60%)]">
                {faqSection.eyebrow}
              </p>
            </div>
            <h2 className="mt-4 text-3xl font-bold leading-[1.1] text-white md:text-4xl lg:text-5xl">
              {faqSection.titlePart1}{" "}
              <span className="font-serif italic text-white/55">{faqSection.titleHighlight}</span>
            </h2>

            <div className="mt-12">
              <FaqAccordion faqs={faqs} />
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-white/80">{faqSection.footerText}</p>
              <Link
                href={faqSection.ctaLink}
                className="gradient-navy inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-white transition hover:brightness-110"
              >
                {faqSection.ctaText} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <FindWork content={findWorkContent} />
      <Contact content={contactContent} />
    </div>
  );
}
