import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  CheckCircle2,
  FileBadge,
  FileText,
  HardHat,
  Lock,
  Phone,
  Scale,
  ShieldCheck,
  Stamp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/Container";
import Image from "@/components/Image";
import Contact from "@/components/sections/home/Contact";
import FindWork from "@/components/sections/home/FindWork";
import home from "@/content/pages/home.json";
import page from "@/content/pages/licensinginsured_page.json";
import FaqAccordion from "./FaqAccordion";

export const metadata: Metadata = {
  title:
    "Maxima Concrete - Licensed & Insured Concrete Contractor in Ohio | Maxima Concrete",
  description:
    "Maxima Concrete is fully licensed, insured, and OSHA-aligned. View our credentials, liability coverage, and protection for homeowners across Ohio.",
  alternates: { canonical: "/licensing-insured/" },
};

const contactContent =
  home.sections.find((s) => s.type === "contact")?.content ?? {};
const findWorkContent =
  home.sections.find((s) => s.type === "find-work")?.content ?? {};

// Conteúdo da página (editável no CMS em Pages › Licensinginsured).
const sectionContent = (key: string): Record<string, any> =>
  page.sections.find((s) => s.key === key)?.content ?? {};
const hero = sectionContent("licensing_hero");
const credentialsSection = sectionContent("licensing_credentials");
const feature = sectionContent("licensing_feature");
const protection = sectionContent("licensing_protection");
const faqSection = sectionContent("licensing_faq");

/** Nomes de ícone aceitos no JSON de conteúdo. */
const ICONS: Record<string, LucideIcon> = {
  FileBadge,
  ShieldCheck,
  Users,
  HardHat,
  Lock,
  Scale,
  Award,
};

interface IconItem {
  icon: string;
  title: string;
  text: string;
}

const credentials: IconItem[] = credentialsSection.items ?? [];
const protections: IconItem[] = protection.items ?? [];
const faqs: { q: string; a: string }[] = (faqSection.items ?? []).map(
  (item: { question: string; answer: string }) => ({ q: item.question, a: item.answer }),
);

const PRIMARY_BTN =
  "gradient-navy inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 font-semibold text-white shadow-md transition-all hover:shadow-[0_8px_20px_-8px_rgba(13,93,147,0.45)] hover:brightness-110";

const SECONDARY_BTN =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-md transition hover:bg-white/15";

export default function Page() {
  return (
    <div className="bg-[hsl(218_45%_8%)] text-white">
      {/* HERO */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28 lg:h-screen lg:max-h-[900px] lg:min-h-0 lg:pt-24">
        {/* Mesma foto da equipe que aparece no card ao lado, agora também como
            fundo do hero. */}
        <div className="absolute inset-0">
          <Image
            src={hero.image}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(110deg, hsl(218 60% 8% / 0.97) 0%, hsl(216 70% 14% / 0.92) 40%, hsl(216 80% 18% / 0.72) 70%, hsl(209 100% 38% / 0.45) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,white,transparent_50%)] opacity-[0.06] mix-blend-overlay" />

        <Container className="relative w-full">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                <ShieldCheck className="h-4 w-4 text-[hsl(210_100%_60%)]" />
                {hero.badge}
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl">
                {hero.titleLine1}{" "}
                <span className="text-[hsl(210_100%_60%)]">{hero.titleHighlight}</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
                {hero.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={hero.ctaLink} className={PRIMARY_BTN}>
                  {hero.ctaText}
                </Link>
                <a href={hero.phoneHref} className={SECONDARY_BTN}>
                  <Phone className="h-4 w-4" /> {hero.phone}
                </a>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 rounded-3xl bg-[hsl(209_100%_56%)]/20 blur-2xl" />
              <Image
                src={hero.image}
                alt={hero.imageAlt}
                width={1024}
                height={1280}
                className="relative aspect-[4/5] w-full rounded-2xl border border-white/15 object-cover shadow-2xl"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* CREDENTIALS GRID */}
      <section className="relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-[hsl(216_55%_14%)] via-[hsl(217_50%_11%)] to-[hsl(218_45%_8%)] py-24">
        <div className="pointer-events-none absolute -top-32 right-0 h-[600px] w-[600px] rounded-full bg-[hsl(209_100%_45%)]/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-[hsl(210_100%_50%)]/10 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(210 100% 56%) 1px, transparent 1px), linear-gradient(90deg, hsl(210 100% 56%) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <Container className="relative">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[hsl(210_100%_60%)]/60" />
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[hsl(210_100%_60%)]">
              {credentialsSection.eyebrow}
            </p>
          </div>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-[1.1] text-white md:text-4xl lg:text-5xl">
            {credentialsSection.title}
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-white/60">
            {credentialsSection.description}
          </p>

          <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Cartão de confiança em destaque */}
            <div className="relative overflow-hidden rounded-2xl border border-[hsl(210_100%_60%)]/25 bg-gradient-to-br from-[hsl(209_100%_22%)] via-[hsl(213_60%_14%)] to-[hsl(218_50%_10%)] p-8 md:p-10 lg:col-span-5">
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[hsl(210_100%_50%)]/15 blur-3xl" />
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(210_100%_56%)]" />
                  {credentialsSection.cardBadge}
                </div>
                <div className="mt-8 flex items-end gap-3">
                  <span className="text-7xl font-black leading-none tracking-tight text-white md:text-8xl">
                    {credentialsSection.cardNumber}
                    <span className="text-[hsl(210_100%_60%)]">
                      {credentialsSection.cardNumberSuffix}
                    </span>
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-bold text-white">
                  {credentialsSection.cardTitle}
                </h3>
                <p className="mt-3 leading-relaxed text-white/65">
                  {credentialsSection.cardDescription}
                </p>
                <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                  {(credentialsSection.cardStats ?? []).map(
                    (stat: { value: string; label: string }) => (
                      <div key={stat.label}>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="mt-1 text-xs leading-tight text-white/55">{stat.label}</p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Lista de credenciais */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-7">
              {credentials.map((c, i) => {
                const Icon = ICONS[c.icon] ?? ShieldCheck;
                return (
                <div
                  key={c.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[hsl(210_100%_60%)]/50 hover:bg-white/[0.06]"
                >
                  <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-[hsl(209_100%_56%)] to-[hsl(210_100%_60%)] transition-all duration-500 group-hover:w-full" />
                  <span className="absolute right-6 top-5 font-mono text-xs font-semibold tracking-wider text-white/25">
                    0{i + 1}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-[hsl(209_100%_56%)]/30 to-[hsl(210_100%_50%)]/20 shadow-[0_0_30px_-10px_hsl(210_100%_50%/0.5)]">
                    <Icon className="h-5 w-5 text-[hsl(210_100%_56%)]" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-white">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{c.text}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[hsl(210_100%_56%)]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{credentialsSection.verifiableLabel}</span>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* FEATURE — estilo certificado */}
      <section className="relative overflow-hidden bg-[hsl(218_45%_8%)] py-20 md:py-28">
        <div className="pointer-events-none absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[hsl(209_100%_38%)]/15 blur-3xl" />
        <Container className="relative">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
            {/* Foto com carimbo */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                <Image
                  src={feature.image}
                  alt={feature.imageAlt}
                  width={1280}
                  height={960}
                  className="h-[380px] w-full object-cover md:h-[480px]"
                />
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(218_60%_4%)]/95 via-[hsl(218_60%_6%)]/55 to-[hsl(218_60%_6%)]/25" />
                {/* Carimbo */}
                <div className="absolute right-6 top-6 -rotate-12 md:right-8 md:top-8">
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-[3px] border-[hsl(210_100%_56%)]/80 bg-[hsl(214_100%_14%)]/75 backdrop-blur-sm md:h-32 md:w-32">
                    <div className="absolute inset-1.5 rounded-full border border-[hsl(210_100%_56%)]/50" />
                    <div className="text-center">
                      <Stamp className="mx-auto h-5 w-5 text-white md:h-6 md:w-6" />
                      <p className="mt-1 text-[9px] font-black leading-tight tracking-[0.15em] text-white md:text-[10px]">
                        {feature.stampLine1}
                        <br />
                        {feature.stampLine2}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Barra de metadados */}
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 md:p-7">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                      {feature.issuedLabel}
                    </p>
                    <p className="mt-1 text-lg font-bold text-white md:text-xl">
                      {feature.companyName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                      {feature.licenseLabel}
                    </p>
                    <p className="mt-1 font-mono text-sm font-semibold text-[hsl(210_100%_60%)] md:text-base">
                      {feature.licenseNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy editorial */}
            <div className="relative">
              <FileText className="h-10 w-10 text-[hsl(210_100%_60%)]/70" />
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-[hsl(210_100%_60%)]">
                {feature.eyebrow}
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-[1.1] text-white md:text-4xl lg:text-[2.75rem]">
                {feature.titlePart1}{" "}
                <span className="font-serif italic text-white/55">{feature.titleHighlight}</span>{" "}
                {feature.titlePart2}
              </h2>
              <p className="mt-6 leading-relaxed text-white/65">{feature.description}</p>
              <div className="mt-8 flex items-center gap-6 border-t border-white/10 pt-6">
                <div className="flex -space-x-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[hsl(218_45%_8%)] bg-[hsl(209_100%_45%)] text-xs font-bold text-white">
                    M
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[hsl(218_45%_8%)] bg-[hsl(210_100%_45%)] text-xs font-bold text-white">
                    C
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[hsl(218_45%_8%)] bg-[hsl(214_100%_40%)] text-xs font-bold text-white">
                    +
                  </div>
                </div>
                <p className="text-xs leading-snug text-white/55">
                  {feature.teamNoteLine1}
                  <br />
                  {feature.teamNoteLine2}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* WHAT IT MEANS — timeline horizontal */}
      <section className="relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-[hsl(216_55%_14%)] via-[hsl(217_50%_11%)] to-[hsl(218_45%_8%)] py-24">
        <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-[hsl(216_100%_27%)]/25 blur-3xl" />
        <Container className="relative">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[hsl(210_100%_60%)]">
              {protection.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-[1.1] text-white md:text-4xl lg:text-5xl">
              {protection.titlePart1}{" "}
              <span className="font-serif italic text-white/55">{protection.titleHighlight}</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/65">{protection.description}</p>
          </div>

          {/* Timeline com conectores */}
          <div className="relative mt-16">
            <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-[hsl(210_100%_60%)]/30 to-transparent lg:block" />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
              {protections.map((p, i) => {
                const Icon = ICONS[p.icon] ?? ShieldCheck;
                return (
                <div key={p.title} className="relative">
                  {/* Nó */}
                  <div className="relative flex items-center gap-4 lg:block">
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[hsl(210_100%_60%)]/60 bg-[hsl(218_45%_8%)] shadow-[0_0_30px_-5px_hsl(210_100%_50%/0.6)]">
                      <Icon className="h-5 w-5 text-[hsl(210_100%_56%)]" />
                      <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(210_100%_56%)] text-[10px] font-black text-[hsl(218_50%_10%)]">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white lg:hidden">{p.title}</h3>
                  </div>
                  {/* Corpo */}
                  <div className="mt-6 lg:mt-8 lg:pr-6">
                    <h3 className="hidden text-xl font-bold text-white lg:block">{p.title}</h3>
                    <p className="mt-3 leading-relaxed text-white/65">{p.text}</p>
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          {/* Faixa de garantias */}
          <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
              {protection.alsoIncludedLabel}
            </p>
            {(protection.alsoIncluded ?? []).map((item: string) => (
              <div key={item} className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle2 className="h-4 w-4 text-[hsl(210_100%_56%)]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ — accordion + painel lateral */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(218_45%_8%)] to-[hsl(218_50%_5%)] py-24">
        <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[hsl(209_100%_45%)]/10 blur-3xl" />
        <Container className="relative">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            {/* Painel de introdução */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(210_100%_56%)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[hsl(210_100%_60%)]" />
                {faqSection.badge}
              </div>
              <h2 className="mt-5 text-3xl font-bold leading-[1.1] text-white md:text-4xl lg:text-5xl">
                {faqSection.titlePart1} <br className="hidden md:block" />
                <span className="font-serif italic text-white/55">
                  {faqSection.titleHighlight}
                </span>
              </h2>
              <p className="mt-5 leading-relaxed text-white/60">{faqSection.description}</p>
              <Link
                href={faqSection.ctaLink}
                className="mt-7 inline-flex items-center gap-2 font-semibold text-[hsl(210_100%_60%)] transition-all hover:gap-3"
              >
                {faqSection.ctaText} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Accordion */}
            <FaqAccordion faqs={faqs} />
          </div>
        </Container>
      </section>

      <FindWork content={findWorkContent} />
      <Contact content={contactContent} />
    </div>
  );
}
