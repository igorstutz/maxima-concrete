import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";

interface DesignOption {
  image?: string;
  title?: string;
  description?: string;
}

interface CommonApplicationsContent {
  title?: string;
  items?: string[];
  rightTitle?: string;
  designOptions?: DesignOption[];
}

/** Common Applications — fundo azul-noite, lista de aplicações à esquerda, opções de design à direita. */
export default function CommonApplications({
  content,
}: {
  content: Record<string, any>;
}) {
  const c = content as CommonApplicationsContent;
  const items = c.items || [];
  const designOptions = c.designOptions || [];

  return (
    <section className="bg-[#000D16]">
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          {/* Coluna esquerda */}
          <ScrollReveal className="flex-1">
            <h2 className="mb-6 text-[clamp(24px,3vw,32px)] font-medium leading-[120%] tracking-[-1.28px] text-white sm:mb-8">
              {c.title}
            </h2>
            {items.length > 0 && (
              <ul className="space-y-3">
                {items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-[clamp(16px,2vw,20px)] leading-[160%] tracking-[-0.8px] text-white/90"
                  >
                    <span className="mt-[10px] h-[6px] w-[6px] shrink-0 rounded-full bg-white/60" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </ScrollReveal>

          {/* Divisor */}
          <div className="hidden w-px shrink-0 self-center bg-[linear-gradient(90deg,#FFF_0%,rgba(153,153,153,0)_100%)] lg:block lg:h-[446px]" />
          <div className="h-px w-full bg-[linear-gradient(180deg,#FFF_0%,rgba(153,153,153,0)_100%)] lg:hidden" />

          {/* Coluna direita */}
          <ScrollReveal direction="right" className="flex-1">
            {c.rightTitle && (
              <h3 className="mb-6 text-[clamp(24px,3vw,32px)] font-medium leading-[120%] tracking-[-1.28px] text-white sm:mb-8">
                {c.rightTitle}
              </h3>
            )}
            <div className="space-y-8">
              {designOptions.map((opt, i) => (
                <div key={i}>
                  {opt.title && (
                    <h4 className="mb-3 text-[clamp(14px,1.5vw,16px)] font-semibold leading-[140%] text-white">
                      {opt.title}
                    </h4>
                  )}
                  {opt.image && (
                    <div className="relative mb-3 h-[160px] w-full max-w-[400px] overflow-hidden rounded-lg sm:h-[180px]">
                      <Image
                        src={legacyAsset(opt.image)}
                        alt={opt.title || `Design option ${i + 1}`}
                        fill
                        sizes="400px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  {opt.description && (
                    <p className="text-[clamp(13px,1.5vw,15px)] leading-[160%] tracking-[-0.6px] text-white/70">
                      {opt.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
