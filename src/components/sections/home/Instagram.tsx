import { Heart } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import ElfsightWidget from "@/components/ElfsightWidget";

// Feed do Instagram (Elfsight) — mesmo ID do site antigo.
const INSTAGRAM_WIDGET_ID = "4f034239-e161-402c-af0e-9237ac6c441b";

interface InstagramContent {
  titlePart1?: string;
  titlePart2?: string;
  handle?: string;
}

export default function Instagram({ content }: { content: Record<string, any> }) {
  const c = content as InstagramContent;

  return (
    <section id="instagram" className="bg-navy py-12 sm:py-16">
      <Container>
        {/* Cabeçalho */}
        <div className="mb-6 flex flex-col items-start md:mb-10">
          <h2 className="m-0 mb-4 flex flex-wrap items-center justify-start gap-2 text-xl font-medium leading-[120%] tracking-[-1.08px] md:mb-6 md:text-2xl lg:text-[36px]">
            <Heart className="h-4 w-4 text-white md:h-5 md:w-5" fill="white" />
            <span className="text-white">{c.titlePart1}</span>
            <span className="text-white/80">{c.titlePart2}</span>
          </h2>

          {/* Avatar com anel gradiente + handle */}
          <div className="flex items-center gap-3">
            <span
              className="rounded-full p-[2px] md:p-[3px]"
              style={{
                background:
                  "linear-gradient(225deg, #8A3BEE 0%, #F200B7 39%, #FE9402 91.67%)",
              }}
            >
              <span className="relative block h-10 w-10 overflow-hidden rounded-full border-2 border-navy md:h-12 md:w-12">
                <Image
                  src="/images/assets/instagram-profile.png"
                  alt="Maxima Concrete Instagram"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </span>
            </span>
            <span className="text-sm font-medium text-white md:text-base">
              {c.handle}
            </span>
          </div>
        </div>

        {/* Feed via Elfsight (carrega ao entrar na viewport) */}
        <ElfsightWidget widgetId={INSTAGRAM_WIDGET_ID} className="max-w-[900px]" />
      </Container>
    </section>
  );
}
