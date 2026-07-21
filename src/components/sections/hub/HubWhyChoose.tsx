import { Package, Waves, LayoutGrid, ClipboardCheck } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";

interface HubWhyChooseItem {
  icon?: string;
  title?: string;
  description?: string;
}

interface HubWhyChooseContent {
  title?: string;
  description?: string;
  items?: HubWhyChooseItem[];
}

// Ícones de fallback (na ordem dos itens) quando não há ícone customizado no CMS.
const FALLBACK_ICONS = [Package, Waves, LayoutGrid, ClipboardCheck];

/** Hub Why Choose — gradiente navy, título + descrição à esquerda, colunas de ícones à direita. */
export default function HubWhyChoose({ content }: { content: Record<string, any> }) {
  const c = content as HubWhyChooseContent;
  const items = c.items || [];

  return (
    <section className="bg-[linear-gradient(100deg,#04121D_0%,var(--color-ocean)_100%)]">
      <Container className="py-14 md:py-20">
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:gap-12">
          <ScrollReveal className="shrink-0 lg:max-w-xs">
            <h2 className="mb-5 whitespace-pre-line text-3xl font-medium leading-tight tracking-[-1px] text-white md:text-4xl">
              {c.title}
            </h2>
            {c.description && (
              <p className="whitespace-pre-line text-sm leading-relaxed text-white/90 md:text-base">
                {c.description}
              </p>
            )}
          </ScrollReveal>

          <div className="hidden self-stretch border-l border-white/40 lg:block" />

          <ScrollReveal
            direction="right"
            className="grid flex-1 grid-cols-2 gap-8 md:grid-cols-4"
          >
            {items.map((item, i) => {
              const FallbackIcon = FALLBACK_ICONS[i % FALLBACK_ICONS.length];
              return (
                <div key={i} className="flex flex-col items-center gap-3 text-center">
                  <p className="text-sm font-semibold leading-snug text-white">
                    {item.title}
                  </p>
                  {item.icon ? (
                    <Image
                      src={legacyAsset(item.icon)}
                      alt=""
                      width={56}
                      height={56}
                      className="h-14 w-14 object-contain"
                    />
                  ) : (
                    <FallbackIcon className="h-12 w-12 text-white" strokeWidth={1.2} />
                  )}
                  <p className="text-xs leading-relaxed text-white/90 md:text-sm">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
