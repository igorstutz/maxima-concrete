import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/Container";
import Image from "@/components/Image";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SmartLink } from "@/components/sections/home/SmartLink";
import { legacyAsset } from "@/components/sections/home/legacy";
import { htmlWithBreaks } from "./shared";

/** "Financing Options That Fit Your Budget" (página Why Maxima) — type "financing". */
export default function Financing({ content }: { content: Record<string, any> }) {
  const title = content.title || "Financing Options\nThat Fit Your Budget";
  const description =
    content.description ||
    "Home improvement shouldn't feel out of reach — that's why Maxima Concrete partners with Hearth Financing to make your project more affordable and stress-free.";
  const benefitsTitle =
    content.benefitsTitle || "Benefits of Financing with Maxima Concrete:";
  const benefits: string[] = content.benefits || [
    "Loan amounts up to $100,000",
    "Affordable monthly payments tailored to your budget",
    "Fast approval — see your options in minutes without affecting your credit score",
    "Funding within 1–3 days",
    "No prepayment penalties",
    "No home equity required",
  ];
  const bottomText =
    content.bottomText ||
    "See your personalized payment options today — simple, secure, and transparent.";
  const ctaText = content.ctaText || "Contact Us";
  const ctaLink = content.ctaLink || "#contact";
  const cardImage = content.cardImage || "";
  const dollarIcon = content.dollarIcon || "";

  const html = (text: string) => (
    <span dangerouslySetInnerHTML={{ __html: htmlWithBreaks(text) }} />
  );

  const heading = (
    <h2 className="font-medium leading-[115%] tracking-[-1.44px] text-navy [font-size:clamp(26px,3vw,36px)]">
      {html(title)}
    </h2>
  );

  return (
    <section className="overflow-hidden bg-[#E8E8E8]">
      <Container className="py-16 md:py-24">
        <ScrollReveal>
          <div className="flex flex-col items-start gap-10 lg:flex-row lg:gap-16">
            {/* Mobile: ícone + título primeiro */}
            <div className="flex items-center gap-3 lg:hidden">
              {dollarIcon && (
                <Image
                  src={legacyAsset(dollarIcon)}
                  alt="Dollar icon"
                  width={45}
                  height={81}
                  className="h-[81px] w-[45px] shrink-0 object-contain"
                />
              )}
              {heading}
            </div>

            {/* Esquerda — imagem do cartão */}
            <div className="mx-auto w-full max-w-[340px] shrink-0 lg:mx-0">
              {cardImage ? (
                <Image
                  src={legacyAsset(cardImage)}
                  alt="Financing card"
                  width={340}
                  height={480}
                  className="max-h-[480px] w-full rounded-xl object-contain"
                />
              ) : (
                <div className="flex aspect-[3/4] max-h-[480px] w-full items-center justify-center rounded-xl bg-gray-300 text-sm text-gray-500">
                  Upload card image
                </div>
              )}
            </div>

            {/* Direita — texto */}
            <div className="min-w-0 flex-1">
              <div className="mb-6 hidden items-center gap-3 lg:flex">
                {dollarIcon && (
                  <Image
                    src={legacyAsset(dollarIcon)}
                    alt="Dollar icon"
                    width={45}
                    height={81}
                    className="h-[81px] w-[45px] shrink-0 object-contain"
                  />
                )}
                <div className="flex items-center gap-4">
                  {heading}
                  <div className="mt-2 hidden h-[3px] w-20 shrink-0 bg-navy md:block" />
                </div>
              </div>

              <p className="mb-8 max-w-[599px] font-medium tracking-[-0.8px] text-[#484848] [font-size:clamp(16px,2vw,20px)]">
                {html(description)}
              </p>

              <h3 className="mb-4 font-medium tracking-[-1.04px] text-ocean [font-size:clamp(20px,2.5vw,26px)]">
                {html(benefitsTitle)}
              </h3>

              {benefits.length > 0 && (
                <ul className="mb-8 space-y-0.5">
                  {benefits.map((benefit, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm font-medium leading-[184%] tracking-[-0.56px] text-[#484848]"
                    >
                      <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#484848]" />
                      {html(benefit)}
                    </li>
                  ))}
                </ul>
              )}

              <p className="mb-6 max-w-[401px] font-medium tracking-[-0.8px] text-[#484848] [font-size:clamp(16px,2vw,20px)]">
                {html(bottomText)}
              </p>

              <SmartLink
                href={ctaLink}
                className="gradient-navy inline-flex items-center gap-2 rounded-[10px] px-7 py-3 text-sm font-medium text-white transition-all hover:brightness-110"
              >
                {ctaText}
                <ArrowUpRight className="h-4 w-4" />
              </SmartLink>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
