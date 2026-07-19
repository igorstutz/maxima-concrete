import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { sanitizeHtml } from "./sanitize";

interface AdaItem {
  title?: string;
  description?: string;
}

interface CommercialAdaContent {
  title?: string;
  subtitle?: string;
  items?: AdaItem[];
  closing1?: string;
  closing2?: string;
}

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    className="mt-1 shrink-0"
  >
    <path
      d="M8.5 0C6.81886 0 5.17547 0.498516 3.77766 1.43251C2.37984 2.3665 1.29037 3.69402 0.647028 5.24719C0.00368291 6.80036 -0.164645 8.50943 0.163329 10.1583C0.491303 11.8071 1.30085 13.3217 2.4896 14.5104C3.67834 15.6992 5.1929 16.5087 6.84174 16.8367C8.49057 17.1646 10.1996 16.9963 11.7528 16.353C13.306 15.7096 14.6335 14.6202 15.5675 13.2223C16.5015 11.8245 17 10.1811 17 8.5C16.9963 6.2468 16.0996 4.08694 14.5063 2.49369C12.9131 0.900433 10.7532 0.00370861 8.5 0ZM8.2535 10.8035C8.09236 10.9615 7.87568 11.05 7.65 11.05C7.42432 11.05 7.20764 10.9615 7.0465 10.8035L5.1 8.8485L6.2985 7.65L7.65 9.0015L10.7015 5.95L11.9 7.1485L8.2535 10.8035Z"
      fill="white"
    />
  </svg>
);

/**
 * type: "commercial-ada" — painel full-bleed com gradiente navy→ocean,
 * checklist de itens e frases de fechamento (também usado como
 * "Industries We Serve" em /commercial-concrete).
 */
export default function Ada({ content }: { content: Record<string, any> }) {
  const c = content as CommercialAdaContent;
  const title = c.title || "ADA Compliance Expertise";
  const items = c.items ?? [];

  return (
    <section className="bg-gradient-to-br from-navy to-ocean py-16 md:py-24">
      <Container>
        <ScrollReveal>
          <h2 className="mb-4 text-[32px] font-medium leading-[120%] tracking-[-1.28px] text-white">
            {title}
          </h2>

          {c.subtitle && (
            <p
              className="mb-8 w-full text-[18px] font-normal leading-[120%] tracking-[-0.72px] text-[#F3F3F3] lg:max-w-[801px]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.subtitle) }}
            />
          )}

          {items.length > 0 && (
            <ul className="mb-10 flex flex-col gap-4">
              {items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckIcon />
                  <p className="text-[18px] font-normal leading-[120%] tracking-[-0.72px] text-[#F3F3F3]">
                    <span className="font-semibold">{item.title}</span>
                    {item.description ? <>: {item.description}</> : null}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {c.closing1 && (
            <p
              className="mb-6 w-full text-[22px] font-normal leading-[130%] tracking-[-0.88px] text-white lg:max-w-[719px]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.closing1) }}
            />
          )}
          {c.closing2 && (
            <p
              className="w-full text-[22px] font-normal leading-[130%] tracking-[-0.88px] text-white lg:max-w-[719px]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.closing2) }}
            />
          )}
        </ScrollReveal>
      </Container>
    </section>
  );
}
