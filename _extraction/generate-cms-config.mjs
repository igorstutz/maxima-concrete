// Gera public/admin/cms/config.yml para o Sveltia CMS a partir dos JSONs de
// src/content/pages. Cada página é uma "file collection" cujo campo `sections`
// é uma lista tipada (typeKey: type); o schema de cada tipo de seção é
// inferido da união dos campos reais de todas as instâncias daquele tipo.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const PAGES_DIR = join(ROOT, "src", "content", "pages");
const OUT_DIR = join(ROOT, "public", "admin", "cms");

const IMG_RE = /\.(png|jpe?g|webp|avif|gif|svg)$/i;
const isImagePath = (s) =>
  typeof s === "string" && (s.startsWith("/images/") || IMG_RE.test(s));

// ---------- inferência de schema ----------
function mergeSchemas(a, b) {
  if (!a) return b;
  if (!b) return a;
  if (a.kind !== b.kind) {
    // conflito (ex.: string vs objeto) → texto bruto para não perder dado
    return { kind: a.kind === "unknown" ? b.kind : "mixed" };
  }
  if (a.kind === "object" || a.kind === "list-object") {
    const fields = { ...a.fields };
    for (const [k, v] of Object.entries(b.fields || {})) {
      fields[k] = mergeSchemas(fields[k], v);
    }
    return { kind: a.kind, fields };
  }
  if (a.kind === "string") {
    return {
      kind: "string",
      image: a.image && b.image,
      long: a.long || b.long,
    };
  }
  return a;
}

function inferSchema(value) {
  if (value === null || value === undefined) return { kind: "unknown" };
  if (typeof value === "boolean") return { kind: "boolean" };
  if (typeof value === "number") return { kind: "number" };
  if (typeof value === "string") {
    return {
      kind: "string",
      image: isImagePath(value),
      long: value.length > 120 || value.includes("\n"),
    };
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return { kind: "unknown-list" };
    let el = null;
    for (const v of value) el = mergeSchemas(el, inferSchema(v));
    if (el?.kind === "string")
      return { kind: el.image ? "list-image" : "list-string" };
    if (el?.kind === "object") return { kind: "list-object", fields: el.fields };
    return { kind: "list-string" };
  }
  if (typeof value === "object") {
    const fields = {};
    for (const [k, v] of Object.entries(value)) fields[k] = inferSchema(v);
    return { kind: "object", fields };
  }
  return { kind: "unknown" };
}

// ---------- schema → campos Decap/Sveltia ----------
function schemaToField(name, schema, indentLevel) {
  const base = { name, label: name, required: false };
  switch (schema?.kind) {
    case "boolean":
      return { ...base, widget: "boolean" };
    case "number":
      return { ...base, widget: "number", value_type: "float" };
    case "string":
      if (schema.image) return { ...base, widget: "image", choose_url: true };
      return { ...base, widget: schema.long ? "text" : "string" };
    case "list-image":
      return {
        ...base,
        widget: "list",
        field: { name: "image", label: "Image", widget: "image", choose_url: true },
      };
    case "list-string":
    case "unknown-list":
      return { ...base, widget: "list", field: { name: "item", label: "Item", widget: "string" } };
    case "list-object":
      return {
        ...base,
        widget: "list",
        fields: Object.entries(schema.fields).map(([k, v]) => schemaToField(k, v)),
      };
    case "object":
      return {
        ...base,
        widget: "object",
        collapsed: true,
        fields: Object.entries(schema.fields).map(([k, v]) => schemaToField(k, v)),
      };
    default:
      return { ...base, widget: "string" };
  }
}

// ---------- YAML emitter (subset suficiente) ----------
const yamlStr = (s) => {
  if (typeof s !== "string") return String(s);
  if (/^[A-Za-z0-9_./-]+$/.test(s) && !/^(true|false|null|yes|no)$/i.test(s)) return s;
  return JSON.stringify(s);
};
function emit(value, indent) {
  const pad = "  ".repeat(indent);
  if (Array.isArray(value)) {
    return value
      .map((v) => {
        const inner = emit(v, indent + 1);
        if (typeof v === "object" && v !== null) {
          const lines = inner.trimStart();
          return `${pad}- ${lines.replace(new RegExp(`\n${"  ".repeat(indent + 1)}`, "g"), `\n${pad}  `)}`;
        }
        return `${pad}- ${yamlStr(v)}`;
      })
      .join("\n");
  }
  if (typeof value === "object" && value !== null) {
    return Object.entries(value)
      .map(([k, v]) => {
        if (v === undefined) return null;
        if (Array.isArray(v)) {
          if (v.length === 0) return `${pad}${k}: []`;
          return `${pad}${k}:\n${emit(v, indent + 1)}`;
        }
        if (typeof v === "object" && v !== null) {
          return `${pad}${k}:\n${emit(v, indent + 1)}`;
        }
        return `${pad}${k}: ${yamlStr(v)}`;
      })
      .filter(Boolean)
      .join("\n");
  }
  return `${pad}${yamlStr(value)}`;
}

// ---------- coleta ----------
const pageFiles = readdirSync(PAGES_DIR).filter((f) => f.endsWith(".json"));
const typeSchemas = new Map();
const pages = [];

for (const file of pageFiles) {
  const page = JSON.parse(readFileSync(join(PAGES_DIR, file), "utf8"));
  pages.push({ file, pageKey: page.pageKey, types: [...new Set(page.sections.map((s) => s.type))] });
  for (const s of page.sections) {
    const cur = typeSchemas.get(s.type);
    typeSchemas.set(s.type, mergeSchemas(cur, inferSchema(s.content)));
  }
}

// tipos → definição de type do widget list
const sectionTypes = [...typeSchemas.entries()]
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([type, schema]) => ({
    label: type,
    name: type,
    widget: "object",
    fields: [
      { name: "key", label: "Key (não alterar)", widget: "string", required: true },
      { name: "label", label: "Label", widget: "string", required: false },
      {
        name: "content",
        label: "Content",
        widget: "object",
        fields:
          schema?.kind === "object" && schema.fields
            ? Object.entries(schema.fields).map(([k, v]) => schemaToField(k, v))
            : [{ name: "raw", label: "Raw", widget: "string", required: false }],
      },
    ],
  }));

const PAGE_LABELS = {
  home: "Home",
};
const labelFor = (pageKey) =>
  PAGE_LABELS[pageKey] ??
  pageKey.replace(/_page$/, "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const config = {
  backend: {
    name: "github",
    repo: "igorstutz/maxima-concrete",
    branch: "main",
    base_url: "https://maximaconcrete.com",
    auth_endpoint: "api/oauth/authorize.php",
    commit_messages: {
      update: 'content: update {{collection}} "{{slug}}" (via CMS)',
      uploadMedia: "content: upload {{path}} (via CMS)",
      deleteMedia: "content: delete {{path}} (via CMS)",
    },
  },
  site_url: "https://maximaconcrete.com",
  media_folder: "public/images",
  public_folder: "/images",
  collections: [
    {
      name: "pages",
      label: "Pages",
      description: "Todas as páginas do site — textos, imagens e seções.",
      editor: { preview: false },
      files: pages
        .sort((a, b) => (a.pageKey === "home" ? -1 : b.pageKey === "home" ? 1 : a.pageKey.localeCompare(b.pageKey)))
        .map((p) => ({
          name: p.pageKey,
          label: labelFor(p.pageKey),
          file: `src/content/pages/${p.file}`,
          fields: [
            { name: "pageKey", label: "Page key (não alterar)", widget: "string", required: true },
            {
              name: "sections",
              label: "Sections",
              label_singular: "section",
              widget: "list",
              typeKey: "type",
              types: sectionTypes.filter((t) => p.types.includes(t.name)),
            },
          ],
        })),
    },
    {
      name: "settings",
      label: "Site Settings",
      editor: { preview: false },
      files: [
        {
          name: "navigation",
          label: "Navigation (menu)",
          file: "src/content/settings/navigation.json",
          fields: [{ name: "raw", label: "⚠ Edite com cuidado", widget: "code", output_code_only: true, default_language: "json" }],
        },
        {
          name: "footer",
          label: "Footer",
          file: "src/content/settings/footer.json",
          fields: [{ name: "raw", label: "⚠ Edite com cuidado", widget: "code", output_code_only: true, default_language: "json" }],
        },
        {
          name: "tracking",
          label: "Tracking & Scripts",
          file: "src/content/settings/tracking.json",
          fields: [
            { name: "gtmId", label: "Google Tag Manager ID", widget: "string", required: false },
            { name: "extraBodyCode", label: "Extra body code", widget: "text", required: false },
          ],
        },
      ],
    },
    {
      name: "data",
      label: "Data",
      editor: { preview: false },
      files: [
        {
          name: "service_areas",
          label: "Service Areas (cidades)",
          file: "src/content/data/service-areas.json",
          fields: [
            {
              name: "areas",
              label: "Cities",
              widget: "list",
              root: true,
              fields: [
                { name: "slug", label: "Slug (URL)", widget: "string" },
                { name: "name", label: "Name", widget: "string" },
                { name: "description", label: "Description", widget: "text", required: false },
                { name: "image", label: "Image", widget: "image", required: false, choose_url: true },
              ],
            },
          ],
        },
        {
          name: "google_reviews",
          label: "Google Reviews (destacados)",
          file: "src/content/data/google-reviews.json",
          fields: [
            {
              name: "reviews",
              label: "Reviews",
              widget: "list",
              root: true,
              fields: [
                { name: "name", label: "Reviewer name", widget: "string" },
                { name: "rating", label: "Rating (1-5)", widget: "number", value_type: "int", min: 1, max: 5 },
                { name: "comment", label: "Comment", widget: "text", required: false },
                { name: "date", label: "Date (ISO)", widget: "string", required: false },
                { name: "featured", label: "Featured", widget: "boolean", required: false },
                { name: "photo", label: "Photo", widget: "image", required: false, choose_url: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};

mkdirSync(OUT_DIR, { recursive: true });
const yaml =
  "# GERADO por _extraction/generate-cms-config.mjs — edite o script, não este arquivo.\n" +
  emit(config, 0) +
  "\n";
writeFileSync(join(OUT_DIR, "config.yml"), yaml);
console.log(
  `config.yml gerado: ${pages.length} páginas, ${sectionTypes.length} tipos de seção, ${yaml.split("\n").length} linhas`
);
