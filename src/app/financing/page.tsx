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
} from "lucide-react";
import { Container } from "@/components/Container";
import Image from "@/components/Image";
import Contact from "@/components/sections/home/Contact";
import FindWork from "@/components/sections/home/FindWork";
import home from "@/content/pages/home.json";
import FaqAccordion from "./FaqAccordion";

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

const steps = [
  {
    icon: FileCheck,
    title: "Apply in Minutes",
    text: "Quick online pre-qualification with a soft credit check — no impact to your score.",
  },
  {
    icon: BadgePercent,
    title: "Choose Your Plan",
    text: "Pick the term and monthly payment that fits your budget. Competitive rates available.",
  },
  {
    icon: Hammer,
    title: "Start Your Project",
    text: "Once approved, we schedule your build and you pay over time — not all at once.",
  },
];

const highlights = [
  { icon: Clock, title: "Fast Decisions", text: "Most applications receive an answer in under 60 seconds." },
  { icon: DollarSign, title: "$0 Down Options", text: "Qualified homeowners can start with no down payment." },
  { icon: ShieldCheck, title: "Trusted Lenders", text: "We partner with vetted U.S. financing institutions." },
  { icon: Sparkles, title: "No Prepayment Fees", text: "Pay off your loan early with zero penalties." },
];

const faqs = [
  {
    q: "What types of projects can I finance?",
    a: "Driveways, patios, pool decks, walkways, stamped concrete, outdoor living areas, and any other residential or commercial concrete service Maxima offers.",
  },
  {
    q: "Will applying affect my credit score?",
    a: "No. Pre-qualification uses a soft credit pull. A hard inquiry only happens if you accept a loan offer.",
  },
  {
    q: "What credit score do I need?",
    a: "Programs are available for a wide range of credit profiles. Our lending partners review each application individually.",
  },
  {
    q: "How long does approval take?",
    a: "Most homeowners receive a decision within minutes of submitting their application.",
  },
];

/** Divider fino com legenda central (mesmo padrão do site antigo). */
function Divider({ label }: { label: string }) {
  return (
    <div className="bg-[hsl(218_45%_8%)]">
      <Container className="flex items-center gap-6 py-4 md:py-5">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-white/5" />
        <div className="flex items-center gap-2 text-[hsl(210_100%_70%)]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(210_100%_70%)]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">{label}</span>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(210_100%_70%)]" />
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
            src="/images/assets/financing-hero.jpg"
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
                "linear-gradient(115deg, hsl(218 60% 5% / 0.9) 0%, hsl(216 55% 8% / 0.78) 40%, hsl(216 45% 12% / 0.6) 65%, hsl(28 80% 22% / 0.4) 100%)",
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
          <div className="absolute bottom-[-15%] left-[5%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,hsl(28_100%_55%/0.22),transparent_70%)] blur-3xl" />
          {/* Grade */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(210 100% 85% / 1) 1px, transparent 1px), linear-gradient(90deg, hsl(210 100% 85% / 1) 1px, transparent 1px)",
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
                "repeating-linear-gradient(45deg, transparent 0 22px, hsl(210 100% 75% / 0.5) 22px 23px)",
              maskImage: "linear-gradient(115deg, transparent 30%, black 70%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(115deg, transparent 30%, black 70%, transparent 100%)",
            }}
          />
          {/* Pontilhado no canto superior esquerdo */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.25]"
            style={{
              backgroundImage: "radial-gradient(hsl(210 100% 85% / 0.6) 1px, transparent 1.5px)",
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
                <CreditCard className="h-4 w-4 text-[hsl(210_100%_75%)]" />
                Financing by Hearth · Ohio
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-[1.02] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] md:text-5xl lg:text-[68px]">
                Build Now.
                <br />
                <span className="bg-gradient-to-r from-[hsl(210_100%_75%)] via-[hsl(210_100%_72%)] to-[hsl(205_90%_70%)] bg-clip-text text-transparent">
                  Pay Over Time.
                </span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
                Affordable monthly payments on your concrete project — driveways, patios, pool
                decks and outdoor living. Through our lending partner{" "}
                <strong className="font-semibold text-white">Hearth</strong>, get pre-qualified in
                minutes with no impact to your credit.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="https://app.gethearth.com/financing/19313/27602/prequalify?utm_campaign=19313&utm_content=white&utm_medium=contractor-website&utm_source=contractor&utm_term=27602"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gradient-navy group inline-flex items-center gap-2 rounded-lg px-7 py-4 font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_18px_-8px_rgba(13,93,147,0.45)]"
                >
                  Get Pre-Qualified
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>
                <a
                  href="tel:+16143845917"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
                >
                  <Phone className="h-4 w-4" /> (614) 384-5917
                </a>
              </div>

              {/* Faixa de confiança */}
              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm text-white/75">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(210_100%_60%)]" /> Soft credit check
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(210_100%_60%)]" /> Decision in 60s
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(210_100%_60%)]" /> $0 down options
                </div>
              </div>
            </div>

            {/* Cartão de simulação (vidro) */}
            <div className="relative hidden lg:block">
              <div
                className="absolute -inset-6 animate-pulse rounded-3xl bg-gradient-to-br from-[hsl(210_100%_56%)]/40 via-[hsl(209_100%_50%)]/20 to-transparent blur-3xl"
                style={{ animationDuration: "5s" }}
              />
              <div className="absolute -left-5 -top-5 z-10 rotate-[-6deg] rounded-full bg-[hsl(210_100%_55%)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[hsl(218_60%_8%)] shadow-lg shadow-[hsl(210_100%_55%)]/40">
                From 7.99% APR
              </div>
              <div className="relative rounded-3xl border border-white/15 bg-white/[0.07] p-8 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                    Sample Payment
                  </span>
                  <BadgePercent className="h-5 w-5 text-[hsl(210_100%_60%)]" />
                </div>
                <div className="mt-6">
                  <div className="text-5xl font-bold text-white">
                    $189<span className="text-xl font-medium text-white/60">/mo</span>
                  </div>
                  <p className="mt-2 text-sm text-white/60">
                    on a $12,000 driveway · 84 mo · subject to credit approval
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-wider text-white/50">Down</div>
                    <div className="mt-1 text-lg font-bold text-white">$0</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-wider text-white/50">Term</div>
                    <div className="mt-1 text-lg font-bold text-white">Up to 144 mo</div>
                  </div>
                </div>
                <a
                  href="https://app.gethearth.com/financing/19313/27602/prequalify?utm_campaign=19313&utm_content=white&utm_medium=contractor-website&utm_source=contractor&utm_term=27602"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gradient-navy mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold text-white transition hover:opacity-90"
                >
                  Check My Rate
                </a>
              </div>
            </div>
          </div>
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
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(210_100%_70%)]">
                  Rates from 7.99% APR
                </span>
              </div>

              <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl">
                How it
                <br />
                <span className="bg-gradient-to-r from-[hsl(210_100%_75%)] to-[hsl(209_100%_60%)] bg-clip-text text-transparent">
                  works
                </span>
              </h2>

              <p className="max-w-sm text-lg leading-relaxed text-white/65">
                A simple three-step process designed to get your concrete project moving fast —
                with flexible financing tailored to your budget.
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
                            ? "bg-gradient-to-br from-[hsl(210_100%_55%)] to-[hsl(210_100%_50%)] text-[hsl(218_60%_8%)] shadow-[0_0_30px_rgba(34,211,238,0.35)]"
                            : "border border-[hsl(210_100%_55%)]/50 bg-[hsl(217_50%_11%)] text-[hsl(210_100%_70%)] shadow-[0_0_20px_rgba(34,211,238,0.18)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
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

      <Divider label="Real homeowners" />

      {/* FEATURE QUOTE */}
      <section className="relative overflow-hidden bg-[hsl(218_45%_8%)] pb-20 pt-6 md:pb-28 md:pt-8">
        <div className="pointer-events-none absolute left-0 top-1/2 h-[450px] w-[450px] -translate-y-1/2 rounded-full bg-[hsl(210_100%_50%)]/10 blur-3xl" />
        <Container className="relative">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            {/* Imagem com chip flutuante */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                <Image
                  src="/images/assets/financing-feature.jpg"
                  alt="Happy homeowners enjoying their new concrete project"
                  width={1280}
                  height={960}
                  className="h-[380px] w-full object-cover md:h-[480px]"
                />
                <div className="absolute inset-0 bg-black/55" />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(218_60%_4%)]/95 via-[hsl(218_60%_6%)]/55 to-[hsl(218_60%_6%)]/25" />
                <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[hsl(218_60%_6%)]/70 px-3 py-1.5 backdrop-blur-md">
                  <span className="text-sm tracking-tight text-[hsl(45_100%_60%)]">★★★★★</span>
                  <span className="text-xs font-semibold text-white/80">5.0</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 md:p-7">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                      Verified review
                    </p>
                    <p className="mt-1 text-lg font-bold text-white">The Johnson Family</p>
                  </div>
                  <p className="font-mono text-xs text-[hsl(210_100%_60%)]">Columbus, OH</p>
                </div>
              </div>
              {/* Cartão "recibo" flutuante */}
              <div className="absolute -bottom-8 -right-6 hidden w-[260px] rotate-3 rounded-2xl border border-white/15 bg-gradient-to-b from-[hsl(218_50%_14%)] to-[hsl(218_55%_9%)] p-5 shadow-2xl md:block lg:-right-10">
                <div className="flex items-center justify-between border-b border-dashed border-white/15 pb-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                    Monthly
                  </span>
                  <Wallet className="h-4 w-4 text-[hsl(210_100%_60%)]" />
                </div>
                <div className="mt-3 text-3xl font-black text-white">
                  $189<span className="text-sm font-medium text-white/50">/mo</span>
                </div>
                <p className="mt-1 text-xs text-white/55">vs $12,000 upfront</p>
                <div className="mt-3 flex items-center gap-1.5 border-t border-dashed border-white/15 pt-3 text-[11px] font-semibold text-[hsl(150_80%_60%)]">
                  <TrendingUp className="h-3 w-3" /> Approved in 47s
                </div>
              </div>
            </div>

            {/* Depoimento editorial */}
            <div className="relative">
              <span className="font-serif text-7xl leading-none text-[hsl(210_100%_60%)]/40 md:text-8xl">
                &ldquo;
              </span>
              <p className="-mt-6 text-2xl font-bold leading-[1.2] text-white md:text-3xl lg:text-[2rem]">
                We didn&apos;t have to wait years to{" "}
                <span className="font-serif italic text-[hsl(210_100%_70%)]">finally</span> redo
                our driveway.
              </p>
              <p className="mt-6 leading-relaxed text-white/65">
                A simple soft credit check, a payment that fit our budget, and the project
                started the next week. No drama, no hidden fees — just our new driveway.
              </p>
              <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(209_100%_45%)] to-[hsl(210_100%_45%)] text-lg font-bold text-white">
                  J
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">The Johnson Family</p>
                  <p className="text-xs text-white/55">
                    Driveway project · Financed over 84 months
                  </p>
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
                Why finance with Maxima
              </p>
            </div>
            <h2 className="mt-4 text-3xl font-bold leading-[1.1] text-white md:text-4xl lg:text-5xl">
              Designed for real homeowners,{" "}
              <span className="font-serif italic text-white/55">
                not just the perfect-credit few.
              </span>
            </h2>
          </div>

          {/* Bento grid */}
          <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-4 md:grid-cols-4">
            {/* Tile principal 2x2 */}
            <div className="relative col-span-2 row-span-2 flex flex-col justify-between overflow-hidden rounded-2xl border border-[hsl(210_100%_60%)]/25 bg-gradient-to-br from-[hsl(209_100%_22%)] via-[hsl(213_60%_14%)] to-[hsl(218_50%_10%)] p-8">
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[hsl(210_100%_50%)]/15 blur-3xl" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[hsl(210_100%_70%)]">
                  <Zap className="h-3 w-3" /> Most chosen
                </div>
                <p className="mt-6 text-6xl font-black leading-none text-white md:text-7xl">
                  $0<span className="ml-1 text-2xl font-medium text-white/60">down</span>
                </p>
                <p className="mt-3 max-w-sm leading-relaxed text-white/70">
                  Qualified homeowners start with nothing out of pocket — the project begins and
                  you pay over time.
                </p>
              </div>
              <div className="relative grid grid-cols-2 gap-3 border-t border-white/10 pt-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/50">Avg approval</p>
                  <p className="mt-1 text-xl font-bold text-white">&lt; 60s</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/50">Terms up to</p>
                  <p className="mt-1 text-xl font-bold text-white">144 mo</p>
                </div>
              </div>
            </div>

            {/* Tiles menores */}
            {highlights.map((h) => (
              <div
                key={h.title}
                className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[hsl(210_100%_60%)]/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-[hsl(209_100%_56%)]/30 to-[hsl(210_100%_50%)]/20">
                  <h.icon className="h-4 w-4 text-[hsl(210_100%_70%)]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{h.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-snug text-white/60">{h.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Garantias em linha */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-6">
            {[
              "No application fees",
              "Fixed monthly payments",
              "Covers labor + materials",
              "Funds released after work starts",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle2 className="h-4 w-4 text-[hsl(150_80%_60%)]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Divider label="Questions & answers" />

      {/* FAQ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(218_45%_8%)] to-[hsl(218_50%_5%)] pb-24 pt-6 md:pt-8">
        <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[hsl(209_100%_45%)]/10 blur-3xl" />
        <Container className="relative">
          <div className="max-w-[1000px]">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[hsl(210_100%_60%)]/60" />
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[hsl(210_100%_60%)]">
                Frequently asked
              </p>
            </div>
            <h2 className="mt-4 text-3xl font-bold leading-[1.1] text-white md:text-4xl lg:text-5xl">
              Financing, <span className="font-serif italic text-white/55">explained simply.</span>
            </h2>

            <div className="mt-12">
              <FaqAccordion faqs={faqs} />
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-white/80">Still have a question? We&apos;re here to help.</p>
              <Link
                href="/contact-us/#contact"
                className="gradient-navy inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-white transition hover:brightness-110"
              >
                Talk to financing <ArrowRight className="h-4 w-4" />
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
