import type { Icon } from "leaflet";

type Leaflet = typeof import("leaflet");

/** Pino teardrop (SVG data URL) na cor informada — igual ao do site antigo. */
const pinUrl = (fill: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40"><path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.27 21.73 0 14 0z" fill="${fill}"/><circle cx="14" cy="13" r="5.5" fill="#ffffff"/></svg>`,
  )}`;

/** Pino de projeto (navy). */
export function makeProjectPin(L: Leaflet): Icon {
  return L.icon({
    iconUrl: pinUrl("#041C2D"),
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -40],
  });
}

/** Pino da localização do usuário (ocean). */
export function makeUserPin(L: Leaflet): Icon {
  return L.icon({
    iconUrl: pinUrl("#0D5D93"),
    iconSize: [32, 46],
    iconAnchor: [16, 46],
    popupAnchor: [0, -46],
  });
}
