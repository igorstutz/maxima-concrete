import {
  ArrowUpRight,
  FileCheck,
  Home,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmartLink } from "./SmartLink";

interface TrustItem {
  icon?: string;
  title?: string;
  description?: string;
}

interface TrustGlobalContent {
  title?: string;
  projectsText?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  items?: TrustItem[];
}

const ICONS: Record<string, LucideIcon> = {
  home: Home,
  users: Users,
  shield: Shield,
  filecheck: FileCheck,
};

export default function TrustGlobal({ content }: { content: Record<string, any> }) {
  const c = content as TrustGlobalContent;
  const items = c.items ?? [];

  return (
    <section id="trust" className="relative overflow-hidden">
      {c.backgroundImage && (
        <Image
          src={c.backgroundImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-navy/85" />

      <div className="relative z-10 py-16 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
            {/* Esquerda: título + contagem + CTA */}
            <ScrollReveal className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
              <h2 className="whitespace-pre-line text-3xl font-semibold leading-tight text-white md:text-4xl">
                {c.title}
              </h2>
              <p className="text-lg font-medium text-white/90">{c.projectsText}</p>
              <SmartLink
                href={c.ctaLink}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-ocean transition-all hover:brightness-95"
              >
                {c.ctaText}
                <ArrowUpRight className="h-4 w-4" />
              </SmartLink>
            </ScrollReveal>

            {/* Direita: 4 itens de confiança */}
            <ScrollReveal direction="right" className="md:rounded-2xl md:border md:border-white/15 md:p-8">
              <ul className="flex flex-col gap-6">
                {items.map((item, idx) => {
                  const Icon = ICONS[item.icon || ""] || Home;
                  return (
                    <li key={idx} className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                        <Icon className="h-5 w-5 text-white" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-base font-semibold text-white">
                          {item.title}
                        </span>
                        <span className="text-sm leading-snug text-white/80">
                          {item.description}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </ScrollReveal>
          </div>
        </Container>
      </div>
    </section>
  );
}
