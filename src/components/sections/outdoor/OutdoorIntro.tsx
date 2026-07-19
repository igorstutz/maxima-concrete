import ServiceIntro from "./ServiceIntro";

/** Section type: `outdoor-intro` — standard intro with "Outdoor living" alt prefix. */
export default function OutdoorIntro({ content }: { content: Record<string, any> }) {
  return <ServiceIntro content={content} altPrefix="Outdoor living" />;
}
