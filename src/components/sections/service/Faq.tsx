"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/Container";

interface FAQItem {
  question: string;
  answer: string;
}

/**
 * faq — accordion de perguntas frequentes (DrivewaysPageFAQRenderer).
 * Item aberto fica com fundo ocean; título dividido em " — ".
 */
export default function Faq({ content }: { content: Record<string, any> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const title = content?.title || "";
  const faqItems: FAQItem[] = content?.items || [];

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const titleParts = title.split(" — ");
  const titleMain = titleParts[0] || "FAQ";
  const titleSub = titleParts.length > 1 ? ` — ${titleParts.slice(1).join(" — ")}` : "";

  return (
    <section className="w-full bg-white py-10 md:py-16 lg:py-24">
      <Container>
        {/* Título — quebra no mobile para títulos longos */}
        <h2 className="mb-6 text-center text-xl leading-tight tracking-[-0.5px] text-[#222] sm:mb-8 sm:text-2xl sm:tracking-[-1px] md:mb-12 md:text-4xl md:tracking-[-2px] lg:text-left lg:text-[50px]">
          <span className="font-semibold">{titleMain}</span>
          <span className="block font-normal sm:inline">{titleSub}</span>
        </h2>

        <div className="mx-auto max-w-4xl space-y-2 sm:space-y-3 md:space-y-4 lg:mx-0">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`overflow-hidden rounded-lg border transition-all duration-300 ${
                  isOpen
                    ? "border-ocean bg-ocean"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className={`flex w-full items-center justify-between px-3 py-3 text-left transition-colors duration-300 sm:px-4 sm:py-4 md:px-6 md:py-5 ${
                    isOpen ? "text-white" : "text-[#1a1a1a]"
                  }`}
                >
                  <span className="pr-3 text-sm font-medium sm:pr-4 sm:text-base md:text-lg">
                    {index + 1}. {item.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 flex-shrink-0 transition-transform duration-300 sm:h-5 sm:w-5 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p
                    className={`px-3 pb-3 text-xs leading-relaxed sm:px-4 sm:pb-4 sm:text-sm md:px-6 md:pb-5 md:text-base ${
                      isOpen ? "text-white/90" : "text-gray-600"
                    }`}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
