/**
 * Finish tags for projects-grid photos (content.imageTypes). The CMS offers
 * these same values as a select — keep PROJECT_TAG_OPTIONS in
 * _extraction/generate-cms-config.mjs in sync.
 */
export const PROJECT_TAGS = {
  concrete: "Concrete",
  stamped: "Stamped",
  broom: "Broom Finish",
  "exposed-aggregate": "Exposed Aggregate",
  paver: "Paver",
} as const;

export type ProjectTag = keyof typeof PROJECT_TAGS;

export const isProjectTag = (t: unknown): t is ProjectTag =>
  typeof t === "string" && Object.hasOwn(PROJECT_TAGS, t);

/** Pavers in amber; every concrete finish in blue. */
export const projectTagColor = (t: ProjectTag) =>
  t === "paver" ? "bg-amber-700/80" : "bg-ocean/80";
