import ServiceIntro from "./ServiceIntro";

/** Section type: `ok-intro` — Outdoor Kitchens intro (standard intro layout). */
export default function OKIntro({ content }: { content: Record<string, any> }) {
  return <ServiceIntro content={content} altPrefix="Outdoor kitchen" />;
}
