import { SECTION_REGISTRY } from "./registry";

interface Section {
  key: string;
  label?: string;
  type: string;
  content: Record<string, any>;
}

// Tipos renderizados fora do fluxo de seções.
const SKIP = new Set(["footer", "explorer"]);

/** Renderiza as seções de uma página (JSON de src/content/pages) na ordem. */
export function PageSections({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => {
        if (SKIP.has(section.type)) return null;
        const Component = SECTION_REGISTRY[section.type];
        if (!Component) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(`[PageSections] tipo sem componente: ${section.type} (${section.key})`);
          }
          return null;
        }
        return <Component key={section.key} content={section.content} />;
      })}
    </>
  );
}
