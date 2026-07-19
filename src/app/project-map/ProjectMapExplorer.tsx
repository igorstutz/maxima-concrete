"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import projectsData from "@/content/data/projects.json";

interface Project {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
}

interface ExplorerContent {
  zipPlaceholder?: string;
  searchButtonText?: string;
  projectsLabel?: string;
  nearbyLabel?: string;
  noResultsText?: string;
}

const PROJECTS = projectsData as Project[];

// Centro padrão: Columbus, OH (mesmo do site antigo).
const CENTER_LAT = 39.9612;
const CENTER_LNG = -82.9988;
const DEFAULT_ZOOM = 11;

/**
 * Projetos de um ZIP: match exato pelo campo zip; se não houver, usa o ZIP
 * numericamente mais próximo entre os existentes (aproxima a "cidade mais
 * próxima" — ZIPs vizinhos na região de Columbus são numericamente próximos).
 */
function projectsForZip(zip: string): Project[] {
  const exact = PROJECTS.filter((p) => p.zip === zip);
  if (exact.length > 0) return exact;

  const target = Number(zip);
  if (!Number.isFinite(target)) return [];

  let bestZip: string | null = null;
  let bestDiff = Infinity;
  for (const p of PROJECTS) {
    if (!/^\d{5}$/.test(p.zip)) continue;
    const diff = Math.abs(Number(p.zip) - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestZip = p.zip;
    }
  }
  // Só aceita um ZIP "vizinho" plausível; fora disso mantém o centro padrão.
  if (bestZip === null || bestDiff > 100) return [];
  return PROJECTS.filter((p) => p.zip === bestZip);
}

/**
 * Mapa interativo dos 1825 projetos (Leaflet, carregado só no browser).
 * Canvas renderer + circle markers para performance com todos os pontos.
 */
export default function ProjectMapExplorer({ content }: { content: ExplorerContent }) {
  const zipPlaceholder = content.zipPlaceholder || "Enter ZIP code";
  const searchButtonText = content.searchButtonText || "Search";
  const projectsLabel = content.projectsLabel || "projects";
  const nearbyLabel = content.nearbyLabel || "nearby";
  const noResultsText = content.noResultsText || "No projects found";

  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LayerGroup | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);

  const [ready, setReady] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [filtered, setFiltered] = useState<Project[] | null>(null);
  const [noResults, setNoResults] = useState(false);

  const searchParams = useSearchParams();
  const zipParam = searchParams.get("zip");

  // Inicializa o mapa apenas no browser (import dinâmico do leaflet).
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!mapElRef.current || mapRef.current) return;
      const L = (await import("leaflet")).default;
      if (cancelled || !mapElRef.current || mapRef.current) return;

      leafletRef.current = L;
      const map = L.map(mapElRef.current, {
        preferCanvas: true,
        scrollWheelZoom: true,
        zoomControl: false,
      }).setView([CENTER_LAT, CENTER_LNG], DEFAULT_ZOOM);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      markersRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setReady(true);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = null;
    };
  }, []);

  // (Re)desenha os markers quando o filtro muda.
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const layer = markersRef.current;
    if (!ready || !L || !map || !layer) return;

    layer.clearLayers();
    const visible = filtered ?? PROJECTS;
    for (const p of visible) {
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: 6,
        color: "#ffffff",
        weight: 1.5,
        fillColor: "#041C2D",
        fillOpacity: 0.85,
      });
      marker.bindPopup(
        `<div style="font-family:Poppins,sans-serif;font-size:13px;"><strong>${
          p.name || "Project"
        }</strong><br/>${p.address ? `${p.address}<br/>` : ""}${p.city}, ${p.state}${
          p.zip ? ` ${p.zip}` : ""
        }</div>`
      );
      layer.addLayer(marker);
    }

    if (filtered && filtered.length > 0) {
      const bounds = L.latLngBounds(filtered.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
    }
  }, [ready, filtered]);

  const runSearch = useCallback((zip: string) => {
    const clean = zip.replace(/\D/g, "").slice(0, 5);
    if (clean.length < 5) return;
    const matches = projectsForZip(clean);
    if (matches.length > 0) {
      setFiltered(matches);
      setNoResults(false);
    } else {
      // Nada encontrado: mantém todos os projetos e o centro padrão.
      setFiltered(null);
      setNoResults(true);
      mapRef.current?.setView([CENTER_LAT, CENTER_LNG], DEFAULT_ZOOM);
    }
  }, []);

  // Aplica o parâmetro ?zip= da URL assim que o mapa estiver pronto.
  useEffect(() => {
    if (!ready || !zipParam) return;
    const clean = zipParam.replace(/\D/g, "").slice(0, 5);
    if (clean.length === 5) {
      setZipCode(clean);
      runSearch(clean);
    }
  }, [ready, zipParam, runSearch]);

  const clearFilter = () => {
    setFiltered(null);
    setNoResults(false);
    setZipCode("");
    mapRef.current?.setView([CENTER_LAT, CENTER_LNG], DEFAULT_ZOOM);
  };

  const count = filtered ? filtered.length : PROJECTS.length;

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2 lg:gap-3">
        <div className="flex min-w-[240px] max-w-md flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              inputMode="numeric"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
              onKeyDown={(e) => e.key === "Enter" && runSearch(zipCode)}
              placeholder={zipPlaceholder}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/40"
            />
          </div>
          <button
            onClick={() => runSearch(zipCode)}
            className="rounded-lg bg-ocean px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy"
          >
            {searchButtonText}
          </button>
        </div>

        {(filtered || noResults) && (
          <button
            onClick={clearFilter}
            className="inline-flex items-center gap-1 px-3 py-2.5 text-sm text-ocean hover:text-navy"
          >
            <X className="h-4 w-4" /> Clear
          </button>
        )}

        <div className="ml-auto flex items-center gap-3 text-sm text-gray-600">
          {noResults && <span className="text-gray-500">{noResultsText}</span>}
          <span>
            <span className="font-semibold text-navy">{count}</span>{" "}
            {filtered ? nearbyLabel : projectsLabel}
          </span>
        </div>
      </div>

      {/* Mapa */}
      <div className="h-[70vh] min-h-[500px] overflow-hidden rounded-xl border border-gray-200">
        <div ref={mapElRef} className="relative h-full w-full" />
      </div>
    </div>
  );
}
