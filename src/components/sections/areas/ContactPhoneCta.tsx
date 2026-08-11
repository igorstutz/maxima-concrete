import { Clock, Phone } from "lucide-react";
import { Container } from "@/components/Container";

/**
 * contact-phone — bloco de telefone da página Contact Us, alvo do atalho
 * "Call us" da seção de escolha. No desktop é uma faixa horizontal (dado à
 * esquerda, ação à direita); no mobile empilha centralizado.
 */
export default function ContactPhoneCta({
  content,
}: {
  content: Record<string, any>;
}) {
  const phone: string = content?.phone || "";
  const eyebrow: string = content?.eyebrow || "";
  const message: string = content?.message || "";
  const hours: string = content?.hours || "";
  const ctaText: string = content?.ctaText || "Call now";

  if (!phone) return null;

  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <section id="contact-phone" className="w-full scroll-mt-24 bg-surface py-10 md:py-14">
      <Container>
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-2xl border border-navy/10 bg-white p-6 text-center shadow-[0_1px_3px_rgba(4,28,45,0.06)] md:flex-row md:items-center md:justify-between md:gap-10 md:p-8 md:text-left">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ocean/10 text-ocean md:mt-1">
              <Phone className="h-5 w-5" />
            </span>

            <div className="flex flex-col items-center gap-1.5 md:items-start">
              {eyebrow && (
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ocean">
                  {eyebrow}
                </span>
              )}

              <a
                href={phoneHref}
                className="text-[30px] font-semibold leading-none tracking-tight text-navy transition-colors hover:text-ocean md:text-[40px]"
              >
                {phone}
              </a>

              {message && (
                <p className="max-w-md text-sm leading-relaxed text-navy/70 md:text-base">
                  {message}
                </p>
              )}

              {hours && (
                <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-navy/60 md:text-sm">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-ocean" />
                  {hours}
                </p>
              )}
            </div>
          </div>

          <a
            href={phoneHref}
            className="gradient-navy inline-flex shrink-0 items-center gap-2 rounded-[10px] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:opacity-90 md:text-base"
          >
            <Phone className="h-4 w-4" />
            {ctaText}
          </a>
        </div>
      </Container>
    </section>
  );
}
