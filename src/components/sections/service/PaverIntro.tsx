import ServiceIntro from "./ServiceIntro";

/** paver-intro — introdução "paver" das páginas de serviço (PorchesPaverIntroRenderer). */
export default function PaverIntro({ content }: { content: Record<string, any> }) {
  return <ServiceIntro content={content} altPrefix="Paver porch" />;
}
