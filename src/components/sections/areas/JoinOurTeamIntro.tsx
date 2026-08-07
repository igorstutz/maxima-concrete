import Image from "@/components/Image";
import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { legacyAsset } from "@/components/sections/home/legacy";
import projects from "@/content/data/projects.json";

/**
 * "auto:projects" no valor de um stat vira a contagem real de projetos
 * (projects.json, resolvida no build) em vez de um número fixo.
 */
const AUTO_VALUES: Record<string, string> = {
  "auto:projects": `${projects.length.toLocaleString("en-US")}+`,
};

/**
 * Intro da página Join Our Team — type "joinourteam-sec-intro".
 *
 * Com `backgroundImage`, vira um hero escuro sobre a foto (a página abria com
 * um bloco branco, sem imagem nenhuma). Sem o campo, mantém o layout claro.
 */
export default function JoinOurTeamIntro({ content }: { content: Record<string, any> }) {
  const resolve = (v?: string) => (v && AUTO_VALUES[v]) || v;
  const stats = [
    { v: resolve(content?.stat1Value), l: content?.stat1Label },
    { v: resolve(content?.stat2Value), l: content?.stat2Label },
    { v: resolve(content?.stat3Value), l: content?.stat3Label },
  ].filter((s) => s.v || s.l);

  const background = legacyAsset(content?.backgroundImage);
  const dark = Boolean(background);

  return (
    <section
      className={`relative overflow-hidden ${
        dark ? "bg-navy pb-16 pt-28 lg:pb-24 lg:pt-36" : "bg-white py-16 lg:py-24"
      }`}
    >
      {background && (
        <>
          <Image
            src={background}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Escurece o suficiente para o texto branco ficar legível sobre a foto */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/60" />
        </>
      )}

      <Container className="relative">
        <ScrollReveal>
          {content?.eyebrow && (
            <div
              className={`mb-4 inline-flex items-center rounded-full px-3 py-1 ${
                dark ? "border border-white/20 bg-white/10" : "bg-ocean/10"
              }`}
            >
              <span
                className={`text-xs font-semibold uppercase tracking-wide ${
                  dark ? "text-white" : "text-ocean"
                }`}
              >
                {content.eyebrow}
              </span>
            </div>
          )}
          {content?.title && (
            <h2
              className={`max-w-3xl text-3xl font-bold leading-tight tracking-[-1px] md:text-4xl lg:text-5xl ${
                dark ? "text-white" : "text-navy"
              }`}
            >
              {content.title}
            </h2>
          )}
          <div className="mt-8 grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {content?.paragraph1 && (
              <p
                className={`text-base leading-relaxed lg:text-lg ${
                  dark ? "text-white/80" : "text-gray-600"
                }`}
              >
                {content.paragraph1}
              </p>
            )}
            {content?.paragraph2 && (
              <p
                className={`text-base leading-relaxed lg:text-lg ${
                  dark ? "text-white/80" : "text-gray-600"
                }`}
              >
                {content.paragraph2}
              </p>
            )}
          </div>
        </ScrollReveal>
        {stats.length > 0 && (
          <ScrollReveal
            className={`mt-12 grid max-w-2xl grid-cols-2 gap-6 border-t pt-10 md:grid-cols-3 lg:mt-16 lg:gap-10 ${
              dark ? "border-white/20" : "border-gray-200"
            }`}
          >
            {stats.map((s, i) => (
              <div key={i}>
                <div
                  className={`text-3xl font-bold tracking-[-0.5px] lg:text-4xl ${
                    dark ? "text-white" : "text-ocean"
                  }`}
                >
                  {s.v}
                </div>
                <div className={`mt-1 text-sm ${dark ? "text-white/70" : "text-gray-600"}`}>
                  {s.l}
                </div>
              </div>
            ))}
          </ScrollReveal>
        )}
      </Container>
    </section>
  );
}
