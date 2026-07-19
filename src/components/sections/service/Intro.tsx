import ServiceIntro from "./ServiceIntro";

/** intro — introdução padrão das páginas de serviço (DrivewaysPageIntroRenderer). */
export default function Intro({ content }: { content: Record<string, any> }) {
  return <ServiceIntro content={content} altPrefix="Project" />;
}
