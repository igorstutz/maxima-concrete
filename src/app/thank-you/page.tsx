import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Images,
  MapPin,
  Moon,
  Phone,
  PhoneCall,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/Container";
import Image from "@/components/Image";
import { ScrollReveal } from "@/components/ScrollReveal";
import page from "@/content/pages/thankyou_page.json";

// Conteúdo da página (editável no CMS em Pages › Thank You).
const sectionContent = (key: string): Record<string, any> =>
  page.sections.find((s) => s.key === key)?.content ?? {};

const seo = sectionContent("thankyou_seo");
const hero = sectionContent("thankyou_hero");
const next = sectionContent("thankyou_next");
const when = sectionContent("thankyou_when");
const numbers = sectionContent("thankyou_numbers");
const explore = sectionContent("thankyou_explore");
const closing = sectionContent("thankyou_closing");

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  // Ninguém deve chegar aqui por busca: fora de contexto a página promete uma
  // ligação que não foi pedida, e competiria com /contact-us/ justamente pelas
  // buscas que deveriam cair no formulário. `follow` para os links internos
  // daqui continuarem valendo.
  robots: { index: false, follow: true },
};

const ICONS: Record<string, LucideIcon> = {
  Clock,
  Moon,
  MapPin,
  ShieldCheck,
  Images,
};

interface WhenItem {
  icon: string;
  title: string;
  hours: string;
  text: string;
}

interface ExploreItem {
  icon: string;
  image: string;
  title: string;
  text: string;
  href: string;
  cta: string;
}

const steps: { title: string; text: string }[] = next.steps ?? [];
const whenItems: WhenItem[] = when.items ?? [];
const numberList: { display: string; href: string }[] = numbers.list ?? [];
const exploreItems: ExploreItem[] = explore.items ?? [];

/**
 * Rótulo de seção: filete luminoso + texto espaçado. É o mesmo motivo da
 * página Licensed & Insured — repeti-lo é o que faz as duas parecerem do
 * mesmo site, e não duas páginas bonitas por conta própria.
 */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden className="h-px w-10 bg-[hsl(210_100%_60%)]/60" />
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[hsl(210_100%_65%)]">
        {children}
      </p>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <div className="bg-[hsl(218_45%_8%)] text-white">
      {/* ════════ HERO ════════ */}
      <section className="relative overflow-hidden pb-20 pt-28 sm:pb-24 lg:pb-28 lg:pt-32">
        {/* Fundo: degradê base + manchas líquidas em movimento lento. */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(216_65%_14%)] via-[hsl(217_55%_10%)] to-[hsl(218_45%_8%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="liquid-blob left-[8%] top-[-12%] h-[460px] w-[460px] bg-[hsl(209_100%_48%)]/60" />
          <span className="liquid-blob liquid-blob-slow right-[-6%] top-[18%] h-[520px] w-[520px] bg-[hsl(196_100%_50%)]/40" />
          <span className="liquid-blob bottom-[-18%] left-[32%] h-[380px] w-[380px] bg-[hsl(224_100%_50%)]/45" />
        </div>
        {/* Malha fina por cima das manchas: dá textura de concreto ao vidro. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(210 100% 70%) 1px, transparent 1px), linear-gradient(90deg, hsl(210 100% 70%) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <Container className="relative">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-sm text-white/60"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/90">Thank You</span>
          </nav>

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            {/* ─── A mensagem ─── */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(210_100%_60%)]/30 bg-[hsl(210_100%_60%)]/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                <CheckCircle2 className="h-4 w-4 text-[hsl(210_100%_65%)]" />
                {hero.badge}
              </span>

              <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-[3.4rem]">
                {hero.titleLine1}
                <span className="mt-2 block bg-gradient-to-r from-white via-[hsl(205_100%_80%)] to-[hsl(210_100%_62%)] bg-clip-text text-transparent">
                  {hero.titleHighlight}
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">
                {hero.description}
              </p>

              <ul className="mt-8 space-y-3">
                {(hero.trustPoints ?? []).map((point: string) => (
                  <li key={point} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[hsl(210_100%_60%)]/40 bg-[hsl(210_100%_60%)]/15">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(210_100%_70%)]" />
                    </span>
                    <span className="text-[15px] font-medium text-white/85">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ─── Ligar agora: o caminho mais rápido, e por isso o elemento
                   mais alto da página depois do título. ─── */}
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-[hsl(209_100%_50%)]/20 blur-3xl"
              />
              <div className="glass-panel liquid-sheen relative overflow-hidden rounded-3xl p-7 sm:p-9">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[hsl(210_100%_65%)]">
                  {hero.fastTitle}
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-white/75">
                  {hero.fastText}
                </p>

                <a
                  href={hero.fastPhoneHref}
                  className="group mt-6 flex items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-4 sm:gap-4 sm:px-5 transition-all hover:border-[hsl(210_100%_60%)]/50 hover:bg-white/[0.07]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-blue shadow-[0_0_30px_-8px_hsl(210_100%_55%/0.9)]">
                    <PhoneCall className="h-5 w-5 text-white" />
                  </span>
                  <span className="min-w-0">
                    <span className="block whitespace-nowrap text-[22px] font-bold tracking-tight text-white sm:text-[1.7rem]">
                      {hero.fastPhone}
                    </span>
                    {/* O ramal fica fora do link discado de propósito: parte dos
                        celulares não disca dígitos depois do número, e um ramal
                        colado ao tel: faz a ligação cair em lugar nenhum. */}
                    <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-[hsl(210_100%_60%)]/30 bg-[hsl(210_100%_60%)]/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[hsl(210_100%_72%)]">
                      {hero.fastExtension}
                    </span>
                  </span>
                  <ArrowUpRight className="ml-auto hidden h-5 w-5 shrink-0 text-white/40 sm:block transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[hsl(210_100%_65%)]" />
                </a>

                <a
                  href={hero.fastPhoneHref}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl gradient-blue px-6 py-3.5 font-semibold text-white shadow-lg transition-all hover:brightness-110"
                >
                  <Phone className="h-4 w-4" />
                  {hero.fastCta}
                </a>

                <p className="mt-4 flex items-center justify-center gap-2 text-xs text-white/50">
                  <Clock className="h-3.5 w-3.5" />
                  {hero.fastNote}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ════════ O QUE ACONTECE AGORA ════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(218_45%_8%)] to-[hsl(217_52%_11%)] py-20 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="liquid-blob liquid-blob-slow right-[12%] top-[-20%] h-[420px] w-[420px] bg-[hsl(209_100%_48%)]/40" />
        </div>

        <Container className="relative">
          <ScrollReveal>
            <div className="max-w-3xl">
              <Eyebrow>{next.eyebrow}</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl lg:text-[2.6rem]">
                {next.title}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/65">
                {next.description}
              </p>
            </div>
          </ScrollReveal>

          <div className="relative mt-14">
            {/* Fio ligando os três passos — a leitura horizontal só existe no
                desktop, onde os cartões ficam lado a lado. */}
            <div
              aria-hidden
              className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-[hsl(210_100%_60%)]/35 to-transparent lg:block"
            />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {steps.map((step, i) => (
                <ScrollReveal key={step.title} delay={i + 1}>
                  <div className="glass-panel liquid-sheen relative h-full overflow-hidden rounded-3xl p-7 pt-8">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[hsl(210_100%_60%)]/35 bg-[hsl(214_100%_20%)]/60 text-xl font-bold text-[hsl(210_100%_72%)] shadow-[0_0_35px_-12px_hsl(210_100%_55%/0.9)]">
                      0{i + 1}
                    </span>
                    <h3 className="mt-6 text-lg font-bold text-white">{step.title}</h3>
                    <p className="mt-3 leading-relaxed text-white/65">{step.text}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ════════ QUANDO LIGAMOS ════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(217_52%_11%)] to-[hsl(218_45%_8%)] py-20 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="liquid-blob bottom-[-25%] left-[-8%] h-[480px] w-[480px] bg-[hsl(214_100%_42%)]/45" />
        </div>

        <Container className="relative">
          <ScrollReveal>
            <Eyebrow>{when.eyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl lg:text-[2.6rem]">
              {when.title}
            </h2>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {whenItems.map((item, i) => {
              const Icon = ICONS[item.icon] ?? Clock;
              return (
                <ScrollReveal key={item.title} delay={i + 1}>
                  <div className="glass-panel liquid-sheen relative h-full overflow-hidden rounded-3xl p-8 sm:p-9">
                    <div className="flex items-start gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-blue shadow-[0_0_30px_-10px_hsl(210_100%_55%/0.9)]">
                        <Icon className="h-5 w-5 text-white" />
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-white">{item.title}</h3>
                        {/* A resposta em si, legível sem precisar ler o parágrafo. */}
                        <p className="mt-1 font-semibold text-[hsl(210_100%_70%)]">
                          {item.hours}
                        </p>
                      </div>
                    </div>
                    <p className="mt-5 leading-relaxed text-white/65">{item.text}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ════════ NOSSOS NÚMEROS ════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(218_45%_8%)] via-[hsl(214_58%_13%)] to-[hsl(218_45%_8%)] py-20 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="liquid-blob left-[18%] top-[-30%] h-[420px] w-[420px] bg-[hsl(196_100%_48%)]/40" />
          <span className="liquid-blob liquid-blob-slow right-[10%] bottom-[-35%] h-[440px] w-[440px] bg-[hsl(224_100%_50%)]/40" />
        </div>

        <Container className="relative">
          <ScrollReveal>
            <div className="glass-panel liquid-sheen relative overflow-hidden rounded-[2rem] p-8 text-center sm:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[hsl(210_100%_65%)]">
                {numbers.eyebrow}
              </p>
              <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-bold leading-[1.15] tracking-tight md:text-3xl lg:text-[2.2rem]">
                {numbers.title}
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/65">
                {numbers.description}
              </p>

              <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {numberList.map((n) => (
                  <a
                    key={n.href}
                    href={n.href}
                    className="group flex items-center justify-center gap-3 rounded-2xl border border-white/12 bg-white/[0.05] px-5 py-5 transition-all hover:-translate-y-0.5 hover:border-[hsl(210_100%_60%)]/50 hover:bg-white/[0.08]"
                  >
                    <PhoneCall className="h-5 w-5 shrink-0 text-[hsl(210_100%_65%)]" />
                    <span className="text-xl font-bold tracking-wide text-white sm:text-2xl">
                      {n.display}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ════════ ENQUANTO ESPERA ════════ */}
      <section className="relative overflow-hidden bg-[hsl(218_45%_8%)] py-20 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="liquid-blob liquid-blob-slow right-[-10%] top-[10%] h-[500px] w-[500px] bg-[hsl(209_100%_46%)]/38" />
        </div>

        <Container className="relative">
          <ScrollReveal>
            <div className="max-w-3xl">
              <Eyebrow>{explore.eyebrow}</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl lg:text-[2.6rem]">
                {explore.title}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/65">
                {explore.description}
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {exploreItems.map((item, i) => {
              const Icon = ICONS[item.icon] ?? Images;
              return (
                <ScrollReveal key={item.href} delay={i + 1} className="h-full">
                  <Link
                    href={item.href}
                    className="group glass-panel liquid-sheen relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1 hover:border-[hsl(210_100%_60%)]/45"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={item.image}
                        alt=""
                        aria-hidden
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(218_60%_6%)]/90 via-[hsl(218_60%_6%)]/35 to-transparent" />
                      <span className="absolute bottom-4 left-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-[hsl(218_50%_10%)]/80 backdrop-blur-md">
                        <Icon className="h-5 w-5 text-[hsl(210_100%_65%)]" />
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-7">
                      <h3 className="text-lg font-bold leading-snug text-white">
                        {item.title}
                      </h3>
                      <p className="mt-3 leading-relaxed text-white/65">{item.text}</p>
                      <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-[hsl(210_100%_65%)]">
                        {item.cta}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ════════ FECHAMENTO ════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(218_45%_8%)] via-[hsl(216_58%_12%)] to-[hsl(218_50%_5%)] py-20 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="liquid-blob left-[30%] top-[-40%] h-[520px] w-[520px] bg-[hsl(209_100%_48%)]/42" />
        </div>

        <Container className="relative">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl lg:text-[2.6rem]">
                {closing.title}
              </h2>
              <p className="mt-5 leading-relaxed text-white/65">{closing.description}</p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={closing.ctaLink}
                  className="inline-flex items-center gap-2 rounded-xl gradient-blue px-7 py-3.5 font-semibold text-white shadow-lg transition-all hover:brightness-110"
                >
                  {closing.ctaText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={closing.secondaryCtaLink}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-7 py-3.5 font-semibold text-white backdrop-blur-md transition hover:border-[hsl(210_100%_60%)]/50 hover:bg-white/[0.1]"
                >
                  <Phone className="h-4 w-4" />
                  {closing.secondaryCtaText}
                </a>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </div>
  );
}
