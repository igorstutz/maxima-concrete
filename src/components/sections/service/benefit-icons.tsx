import {
  CircleCheck,
  ClipboardCheck,
  Droplets,
  Dumbbell,
  Grid3x3,
  HardHat,
  Home,
  Layers,
  Lightbulb,
  Map,
  Package,
  Palette,
  Route,
  Ruler,
  ShieldCheck,
  Sparkles,
  Square,
  Thermometer,
  TreePine,
  TrendingUp,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Ícones vetoriais dos blocos de benefício, referenciados por nome no JSON de
 * conteúdo (mesmo padrão do `trust-global`).
 *
 * Motivo: os ícones vinham do CMS antigo como WebP de 17px ou 49px de largura e
 * eram exibidos em até 56px — apareciam visivelmente pixelados no site.
 */
export const BENEFIT_ICONS: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  sparkles: Sparkles,
  "trending-up": TrendingUp,
  home: Home,
  palette: Palette,
  "hard-hat": HardHat,
  zap: Zap,
  droplets: Droplets,
  ruler: Ruler,
  users: Users,
  "clipboard-check": ClipboardCheck,
  route: Route,
  thermometer: Thermometer,
  layers: Layers,
  grid: Grid3x3,
  lightbulb: Lightbulb,
  dumbbell: Dumbbell,
  tree: TreePine,
  square: Square,
  map: Map,
  "check-circle": CircleCheck,
  wrench: Wrench,
  package: Package,
};

/**
 * Um valor sem "/" é tratado como nome de ícone vetorial; um caminho continua
 * sendo renderizado como imagem pelo componente que chamou.
 */
export function namedBenefitIcon(raw?: string): LucideIcon | undefined {
  if (!raw || raw.includes("/")) return undefined;
  return BENEFIT_ICONS[raw];
}
