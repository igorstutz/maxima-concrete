// Nome de cada página como ele aparece no painel — usado pelo gerador do
// config.yml e pelas mensagens da ferramenta de copiar seção, para os dois
// falarem o mesmo idioma com quem edita ("Steps", não "steps_page").
//
// Sem esta tabela o nome sai do pageKey e vira coisa como "Finishesbuffwash"
// ou "Areaswe Serve". O travessão agrupa as páginas filhas na listagem (que é
// ordenada por este nome), então "Gallery — Pools" fica logo abaixo de
// "Gallery". Ao criar uma página nova, acrescente o nome aqui.
export const PAGE_LABELS = {
  home: "Home",

  // Serviços
  drivewayshub_page: "Driveways",
  driveways_page: "Driveways — Concrete",
  paverdriveways_page: "Driveways — Paver",
  patioshub_page: "Patios",
  patios_page: "Patios — Concrete",
  paverpatios_page: "Patios — Paver",
  slabs_page: "Slabs",
  porches_page: "Porches",
  sidewalks_page: "Sidewalks",
  footers_page: "Footers",
  sportscourts_page: "Sports Courts",
  steps_page: "Steps",
  garagefloors_page: "Garage Floors",
  curbsgutters_page: "Curbs & Gutters",
  approaches_page: "Approaches",
  basementfloors_page: "Basement Floors",
  firepits_page: "Fire Pits",
  fireplaces_page: "Fireplaces",
  seatingwalls_page: "Seating Walls",
  retainingwalls_page: "Retaining Walls",
  outdoorliving_page: "Outdoor Living",
  outdoorlighting_page: "Outdoor Lighting",
  outdoorkitchens_page: "Outdoor Kitchens",
  shelters_page: "Shelters",
  pool_decks_page: "Pool Decks & Surrounds",

  // Galeria
  gallery_page: "Gallery",
  gallerypools_page: "Gallery — Pools",
  gallerypatios_page: "Gallery — Patios",
  gallerysidewalks_page: "Gallery — Sidewalks",
  galleryporchessteps_page: "Gallery — Porches & Steps",
  gallerydriveways_page: "Gallery — Driveways",
  gallerypavers_page: "Gallery — Pavers",
  gallerycommercial_page: "Gallery — Commercial",
  gallerygaragebarn_page: "Gallery — Garage Floor & Barn",
  gallerysportcourt_page: "Gallery — Sport Court",
  galleryfirepitsfireplaces_page: "Gallery — Fire Pits & Fireplaces",
  galleryoutdoorlivingkitchen_page: "Gallery — Outdoor Living & Kitchen",
  galleryretainingcitywalls_page: "Gallery — Retaining & City Walls",

  // Acabamentos
  finishes_page: "Finishes",
  finishesbroom_page: "Finishes — Broom",
  finishescoloredbroom_page: "Finishes — Colored Broom",
  finishesstampedcolored_page: "Finishes — Stamped Colored",
  finishessmooth_page: "Finishes — Smooth",
  finishesbuffwash_page: "Finishes — Buff Wash & Exposed",
  finishespaver_page: "Finishes — Paver",

  // Comercial
  commercial_page: "Commercial",
  commercialconcrete_page: "Commercial Concrete",
  commercialpools_page: "Commercial Pools",

  // Institucionais
  whymaxima_page: "Why Maxima",
  concretespecs_page: "Why Maxima — Concrete Specifications",
  joinourteam_page: "Join Our Team",
  contactus_page: "Contact Us",
  projectmap_page: "Project Map",
  reviews_page: "Reviews",
  financing_page: "Financing",
  licensinginsured_page: "Licensed & Insured",
  areaswe_serve_page: "Areas We Serve",
  areascolumbus_page: "Areas We Serve — Columbus",
};

export const labelFor = (pageKey) =>
  PAGE_LABELS[pageKey] ??
  pageKey
    .replace(/_page$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
