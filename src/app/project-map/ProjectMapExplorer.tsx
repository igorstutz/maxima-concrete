"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Locate, Search, X } from "lucide-react";
import "leaflet/dist/leaflet.css";
import type { Circle, Icon, LayerGroup, Map as LeafletMap, Marker } from "leaflet";
import projectsData from "@/content/data/projects.json";
import { makeProjectPin, makeUserPin } from "@/lib/leaflet-pins";

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
  myLocationLabel?: string;
  projectsLabel?: string;
  nearbyLabel?: string;
  noResultsText?: string;
  defaultRadius?: string;
}

const PROJECTS = projectsData as Project[];

// Centro padrão: Columbus, OH.
const CENTER_LAT = 39.9612;
const CENTER_LNG = -82.9988;
const DEFAULT_ZOOM = 11;
const RADII = ["3", "5", "10", "20", "40", "100"];

// Distância em milhas (Haversine).
function distanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Fallback offline: centroide dos projetos de um ZIP (exato ou vizinho numérico). */
function centroidForZip(zip: string): { lat: number; lng: number } | null {
  let list = PROJECTS.filter((p) => p.zip === zip);
  if (list.length === 0) {
    const target = Number(zip);
    if (!Number.isFinite(target)) return null;
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
    if (bestZip === null || bestDiff > 100) return null;
    list = PROJECTS.filter((p) => p.zip === bestZip);
  }
  const lat = list.reduce((s, p) => s + p.lat, 0) / list.length;
  const lng = list.reduce((s, p) => s + p.lng, 0) / list.length;
  return { lat, lng };
}

function popupHtml(p: Project): string {
  return `<div style="font-family:Poppins,sans-serif;font-size:13px;"><strong>${
    p.name || "Project"
  }</strong><br/>${p.address ? `${p.address}<br/>` : ""}${p.city}, ${p.state}${
    p.zip ? ` ${p.zip}` : ""
  }</div>`;
}

/**
 * Mapa interativo dos 1825 projetos (Leaflet, client-only). Busca por ZIP
 * (geocodificado via Nominatim, com fallback local) ou pela localização do
 * usuário, filtrando por raio. Pinos teardrop iguais aos do site antigo.
 */
export default function ProjectMapExplorer({ content }: { content: ExplorerContent }) {
  const zipPlaceholder = content.zipPlaceholder || "Enter ZIP code";
  const searchButtonText = content.searchButtonText || "Search";
  const myLocationLabel = content.myLocationLabel || "My location";
  const projectsLabel = content.projectsLabel || "projects";
  const nearbyLabel = content.nearbyLabel || "nearby";
  const noResultsText = content.noResultsText || "No projects found";

  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const markersRef = useRef<LayerGroup | null>(null);
  const circleRef = useRef<Circle | null>(null);
  const userMarkerRef = useRef<Marker | null>(null);
  const pinIconRef = useRef<Icon | null>(null);
  const userIconRef = useRef<Icon | null>(null);

  const [ready, setReady] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [radius, setRadius] = useState(content.defaultRadius || "10");
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [filtered, setFiltered] = useState<Project[] | null>(null);
  const [nearbyCount, setNearbyCount] = useState<number | null>(null);
  const [searching, setSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const searchParams = useSearchParams();
  const zipParam = searchParams.get("zip");

  // Inicializa o mapa (import dinâmico do leaflet, só no browser).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!mapElRef.current || mapRef.current) return;
      const L = (await import("leaflet")).default;
      if (cancelled || !mapElRef.current || mapRef.current) return;

      leafletRef.current = L;
      pinIconRef.current = makeProjectPin(L);
      userIconRef.current = makeUserPin(L);

      const map = L.map(mapElRef.current, {
        scrollWheelZoom: true,
        zoomControl: false,
      }).setView([CENTER_LAT, CENTER_LNG], DEFAULT_ZOOM);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
      circleRef.current = null;
      userMarkerRef.current = null;
    };
  }, []);

  // Desenha os pinos (todos ou o subconjunto filtrado).
  useEffect(() => {
    const L = leafletRef.current;
    const layer = markersRef.current;
    const icon = pinIconRef.current || undefined;
    if (!ready || !L || !layer) return;

    layer.clearLayers();
    const visible = filtered ?? PROJECTS;
    for (const p of visible) {
      L.marker([p.lat, p.lng], { icon }).addTo(layer).bindPopup(popupHtml(p));
    }
  }, [ready, filtered]);

  // Filtra por raio quando o centro de busca ou o raio muda.
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!ready || !L || !map || !searchCenter) return;

    const r = parseFloat(radius);
    const nearby = PROJECTS.filter(
      (p) => distanceMiles(searchCenter.lat, searchCenter.lng, p.lat, p.lng) <= r,
    );
    setFiltered(nearby);
    setNearbyCount(nearby.length);
    setNoResults(nearby.length === 0);

    if (circleRef.current) map.removeLayer(circleRef.current);
    if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);

    if (userIconRef.current) {
      userMarkerRef.current = L.marker([searchCenter.lat, searchCenter.lng], {
        icon: userIconRef.current,
      })
        .addTo(map)
        .bindPopup(
          '<div style="font-family:Poppins,sans-serif;font-size:13px;"><strong>Your Location</strong></div>',
        );
    }
    const circle = L.circle([searchCenter.lat, searchCenter.lng], {
      radius: r * 1609.34,
      color: "#0D5D93",
      fillColor: "#0D5D93",
      fillOpacity: 0.08,
      weight: 2,
    }).addTo(map);
    circleRef.current = circle;
    map.fitBounds(circle.getBounds(), { padding: [40, 40] });
  }, [ready, searchCenter, radius]);

  const searchByZip = useCallback(async (rawZip: string) => {
    const zip = rawZip.replace(/\D/g, "").slice(0, 5);
    if (zip.length < 5) return;
    setSearching(true);
    setNoResults(false);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${zip}+USA&limit=1&countrycodes=us`,
      );
      const data = await res.json();
      if (data.length > 0) {
        setSearchCenter({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
        return;
      }
    } catch {
      /* cai no fallback */
    } finally {
      setSearching(false);
    }
    // Fallback offline: centroide dos projetos daquele ZIP.
    const local = centroidForZip(zip);
    if (local) setSearchCenter(local);
    else setNoResults(true);
  }, []);

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) return;
    setSearching(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSearchCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSearching(false);
      },
      () => setSearching(false),
      { timeout: 8000 },
    );
  };

  // Aplica ?zip= da URL assim que o mapa estiver pronto.
  useEffect(() => {
    if (!ready || !zipParam) return;
    const clean = zipParam.replace(/\D/g, "").slice(0, 5);
    if (clean.length === 5) {
      setZipCode(clean);
      searchByZip(clean);
    }
  }, [ready, zipParam, searchByZip]);

  const clearFilter = () => {
    const map = mapRef.current;
    setFiltered(null);
    setNearbyCount(null);
    setNoResults(false);
    setSearchCenter(null);
    setZipCode("");
    if (map) {
      if (circleRef.current) {
        map.removeLayer(circleRef.current);
        circleRef.current = null;
      }
      if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }
      map.setView([CENTER_LAT, CENTER_LNG], DEFAULT_ZOOM);
    }
  };

  const count = nearbyCount !== null ? nearbyCount : PROJECTS.length;

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
              onKeyDown={(e) => e.key === "Enter" && searchByZip(zipCode)}
              placeholder={zipPlaceholder}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/40"
            />
          </div>
          <button
            onClick={() => searchByZip(zipCode)}
            disabled={searching}
            className="rounded-lg bg-ocean px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy disabled:opacity-70"
          >
            {searching ? "…" : searchButtonText}
          </button>
        </div>

        <button
          onClick={useMyLocation}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-navy transition-colors hover:bg-gray-50"
          title="Use my location"
        >
          <Locate className="h-4 w-4" /> {myLocationLabel}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-navy">Radius</span>
          <select
            aria-label="Search radius in miles"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-navy"
          >
            {RADII.map((r) => (
              <option key={r} value={r}>
                {r} mi
              </option>
            ))}
          </select>
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
            {nearbyCount !== null ? nearbyLabel : projectsLabel}
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
