import { Check } from "lucide-react";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";

interface TrustItem {
  label?: string;
  description?: string;
}

/**
 * Section type: `trust-maxima` — black band with a three-line title on the
 * left, vertical divider and a checklist on the right.
 */
export default function TrustMaxima({
  content,
}: {
  content: Record<string, any>;
}) {
  const titleLine1 = content?.titleLine1 || "Why Homeowners";
  const titleLine2 = content?.titleLine2 || "Trust Maxima";
  const titleLine3 = content?.titleLine3 || "Concrete";
  const items: TrustItem[] = content?.items || [];

  return (
    <section className="bg-black py-16 sm:py-20 lg:py-28">
      <Container>
        <ScrollReveal>
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:gap-16">
            {/* Left — title */}
            <div className="max-w-[280px] shrink-0">
              <h2 className="text-[32px] font-medium leading-[120%] tracking-tight text-white">
                {titleLine1}
                <br />
                {titleLine2}
                <br />
                {titleLine3}
              </h2>
            </div>

            {/* Divider */}
            <div className="hidden min-h-[200px] w-px self-stretch bg-white/20 lg:block" />
            <div className="h-px w-full bg-white/20 lg:hidden" />

            {/* Right — checklist */}
            <div className="flex flex-1 flex-col gap-5">
              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                  <p className="text-[14px] leading-[150%] text-white">
                    <span className="font-semibold">{item.label}</span>{" "}
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
