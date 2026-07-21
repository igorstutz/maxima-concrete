import { BadgeCheck } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import { HubCtaButton } from "./shared";

interface HubWhyMaximaGroup {
  icon?: string;
  title?: string;
  items?: Array<{ label?: string; text?: string }>;
}

interface HubWhyMaximaContent {
  eyebrow?: string;
  title?: string;
  description?: string;
  groups?: HubWhyMaximaGroup[];
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

/** Hub Why Maxima — fundo escuro, benefícios agrupados com ícones e itens rotulados. */
export default function HubWhyMaxima({ content }: { content: Record<string, any> }) {
  const c = content as HubWhyMaximaContent;
  const groups = c.groups || [];
  const backgroundImage = legacyAsset(c.backgroundImage);

  return (
    <section className="relative overflow-hidden bg-[#161616]">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 py-16 md:py-24">
        <Container>
          <ScrollReveal className="mx-auto max-w-2xl lg:mx-0">
            {c.eyebrow && (
              <p className="mb-2 text-sm text-white/80">{c.eyebrow}</p>
            )}
            <h2 className="mb-5 whitespace-pre-line text-3xl font-light leading-tight tracking-[-1px] text-white md:text-4xl lg:text-5xl">
              {c.title}
            </h2>
            {c.description && (
              <p className="mb-12 whitespace-pre-line text-sm leading-relaxed text-white/90 md:text-base">
                {c.description}
              </p>
            )}

            <div className="space-y-10">
              {groups.map((group, i) => (
                <div key={i}>
                  <div className="mb-5 flex items-center gap-3">
                    {group.icon ? (
                      <Image
                        src={legacyAsset(group.icon)}
                        alt=""
                        width={28}
                        height={28}
                        className="h-7 w-7 object-contain"
                      />
                    ) : (
                      <BadgeCheck className="h-6 w-6 text-white" strokeWidth={1.5} />
                    )}
                    <h3 className="text-base font-semibold text-white md:text-lg">
                      {group.title}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {(group.items || []).map((item, j) => (
                      <p key={j} className="text-sm leading-relaxed text-white/85">
                        {item.label && (
                          <span className="font-semibold text-white">
                            {item.label}:{" "}
                          </span>
                        )}
                        {item.text}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-14 flex items-center gap-6">
              <div className="hidden flex-1 border-t border-white/60 md:block" />
              <HubCtaButton text={c.ctaText} link={c.ctaLink} variant="light" />
            </div>
          </ScrollReveal>
        </Container>
      </div>
    </section>
  );
}
