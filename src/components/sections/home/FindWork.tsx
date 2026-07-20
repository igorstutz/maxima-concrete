"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Search } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import "leaflet/dist/leaflet.css";
import type { Circle, LayerGroup, Map as LeafletMap, Marker } from "leaflet";
import { makeProjectPin, makeUserPin } from "@/lib/leaflet-pins";

interface FindWorkContent {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  mapCenter?: [number, number];
}

interface Project {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
}

// Selos de confiança exibidos no rodapé da seção (iguais em todas as páginas).
const TRUST_BADGES = [
  { src: "/images/assets/badges/google-reviews.png", alt: "Google Reviews", width: 115, height: 64 },
  { src: "/images/assets/badges/bbb.png", alt: "BBB A+ Accredited Business", width: 88, height: 61 },
  { src: "/images/assets/badges/homeadvisor-screened.png", alt: "HomeAdvisor Screened & Approved", width: 51, height: 58 },
  { src: "/images/assets/badges/homeadvisor-elite.png", alt: "HomeAdvisor Elite Service", width: 61, height: 58 },
  { src: "/images/assets/badges/homeadvisor-toprated.png", alt: "HomeAdvisor Top Rated", width: 51, height: 58 },
  { src: "/images/assets/badges/angies-list.png", alt: "Angie's List", width: 57, height: 62 },
];

const RADII = ["3", "4", "5", "6", "10", "20", "40", "100"];

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

function popupHtml(p: Project): string {
  return `<div style="font-family:Poppins,sans-serif;font-size:13px;"><strong>${
    p.name || "Project"
  }</strong><br/>${p.address ? `${p.address}<br/>` : ""}${p.city}, ${p.state}${
    p.zip ? ` ${p.zip}` : ""
  }</div>`;
}

/**
 * "Find Our Work Near You" — mapa Leaflet interativo com busca por ZIP,
 * raio e auto-localização. Leaflet e a base de projetos (~300KB) são
 * carregados sob demanda quando a seção entra na viewport, para não pesar
 * as páginas que a reutilizam.
 */
export default function FindWork({ content }: { content: Record<string, any> }) {
  const c = content as FindWorkContent;
  const title = c.title || "Find Our Work Near You";
  const subtitle = c.subtitle || "";
  const ctaText = c.ctaText || "View Project Map";
  const ctaLink = c.ctaLink || "/project-map/";
  const centerLat = c.mapCenter?.[0] ?? 39.9612;
  const centerLng = c.mapCenter?.[1] ?? -82.9988;
  const defaultZoom = 12;

  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const circleRef = useRef<Circle | null>(null);
  const userMarkerRef = useRef<Marker | null>(null);
  const projectIconRef = useRef<ReturnType<typeof makeProjectPin> | null>(null);
  const userIconRef = useRef<ReturnType<typeof makeUserPin> | null>(null);

  const [projects, setProjects] = useState<Project[] | null>(null);
  const [ready, setReady] = useState(false);
  const [zip, setZip] = useState("");
  const [radius, setRadius] = useState("3");
  const [autoFind, setAutoFind] = useState(false);
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [filtered, setFiltered] = useState<Project[] | null>(null);
  const [nearbyCount, setNearbyCount] = useState<number | null>(null);
  const [searching, setSearching] = useState(false);

  // Preferência de auto-find persistida.
  useEffect(() => {
    setAutoFind(localStorage.getItem("findwork_autofind") === "true");
  }, []);

  // Inicialização preguiçosa: só carrega Leaflet + projetos ao entrar na viewport.
  useEffect(() => {
    const el = mapElRef.current;
    if (!el) return;
    let cancelled = false;

    const init = async () => {
      if (mapRef.current) return;
      const [{ default: L }, projModule] = await Promise.all([
        import("leaflet"),
        import("@/content/data/projects.json"),
      ]);
      if (cancelled || !mapElRef.current || mapRef.current) return;

      leafletRef.current = L;
      projectIconRef.current = makeProjectPin(L);
      userIconRef.current = makeUserPin(L);

      const map = L.map(mapElRef.current, {
        scrollWheelZoom: false,
        zoomControl: false,
      }).setView([centerLat, centerLng], defaultZoom);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      L.control.zoom({ position: "topright" }).addTo(map);

      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setProjects((projModule.default || projModule) as Project[]);
      setReady(true);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          init();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, [centerLat, centerLng]);

  // Desenha os pinos dos projetos (todos ou o subconjunto filtrado).
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const layer = layerRef.current;
    const icon = projectIconRef.current;
    if (!ready || !L || !map || !layer || !icon || !projects) return;

    layer.clearLayers();
    const visible = filtered ?? projects;
    for (const p of visible) {
      L.marker([p.lat, p.lng], { icon }).addTo(layer).bindPopup(popupHtml(p));
    }
  }, [ready, filtered, projects]);

  // Filtra por raio ao mudar o centro de busca ou o raio.
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!ready || !L || !map || !projects || !searchCenter) return;

    const r = parseFloat(radius);
    const nearby = projects.filter(
      (p) => distanceMiles(searchCenter.lat, searchCenter.lng, p.lat, p.lng) <= r,
    );
    setFiltered(nearby);
    setNearbyCount(nearby.length);

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
    map.fitBounds(circle.getBounds(), { padding: [24, 24] });
  }, [ready, searchCenter, radius, projects]);

  // Auto-find (geolocalização) quando habilitado.
  useEffect(() => {
    if (!ready || !autoFind || !projects || searchCenter) return;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setSearchCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { timeout: 5000 },
      );
    }
  }, [ready, autoFind, projects, searchCenter]);

  const searchByZip = async () => {
    if (zip.length < 5) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${zip}+USA&limit=1&countrycodes=us`,
      );
      const data = await res.json();
      if (data.length > 0) {
        setSearchCenter({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
      }
    } catch {
      /* silencioso */
    } finally {
      setSearching(false);
    }
  };

  const clearFilter = () => {
    const map = mapRef.current;
    setFiltered(null);
    setNearbyCount(null);
    setSearchCenter(null);
    setZip("");
    if (map) {
      if (circleRef.current) {
        map.removeLayer(circleRef.current);
        circleRef.current = null;
      }
      if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }
      map.setView([centerLat, centerLng], defaultZoom);
    }
  };

  const toggleAutoFind = (checked: boolean) => {
    setAutoFind(checked);
    localStorage.setItem("findwork_autofind", String(checked));
    if (checked && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setSearchCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { timeout: 5000 },
      );
    } else if (!checked) {
      clearFilter();
    }
  };

  const totalCount = projects?.length ?? 0;

  return (
    <section id="find-work" className="scroll-mt-24 bg-white py-16 lg:py-24">
      <Container>
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:gap-16">
          {/* Esquerda — texto, busca, raio e auto-find */}
          <div className="flex w-full flex-col gap-4 lg:w-[460px] lg:shrink-0 lg:gap-6">
            <div>
              <div className="mb-2 flex items-center gap-3 lg:mb-3">
                <h2 className="text-2xl font-bold leading-[110%] tracking-[-1px] text-navy md:text-[32px] lg:text-[36px]">
                  {title}
                </h2>
                <Image
                  src="/images/assets/maxima-logo-icon.png"
                  alt="Maxima Concrete"
                  width={40}
                  height={40}
                  className="h-8 w-auto shrink-0 opacity-90 lg:h-10"
                />
              </div>
              <p className="text-sm leading-[160%] text-gray-600 lg:text-[15px]">{subtitle}</p>
            </div>

            {/* Contador de projetos */}
            <p className="text-sm text-gray-500">
              <span className="font-medium text-navy">
                {nearbyCount !== null ? nearbyCount : totalCount || "…"}
              </span>{" "}
              {nearbyCount !== null ? "projects nearby" : "projects completed"}
              {nearbyCount !== null && (
                <button
                  onClick={clearFilter}
                  className="ml-2 text-xs text-ocean underline transition-colors hover:text-navy"
                >
                  Show all ({totalCount})
                </button>
              )}
            </p>

            {/* Busca por ZIP */}
            <div>
              <label
                htmlFor="findwork-zip"
                className="mb-1.5 block text-xs font-medium text-navy lg:mb-2 lg:text-sm"
              >
                Your Location
              </label>
              <div className="flex gap-2">
                <input
                  id="findwork-zip"
                  type="text"
                  inputMode="numeric"
                  value={zip}
                  onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  onKeyDown={(e) => e.key === "Enter" && searchByZip()}
                  placeholder="ZIP Code"
                  className="max-w-[160px] flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/40 lg:max-w-[180px] lg:px-4"
                />
                <button
                  type="button"
                  onClick={searchByZip}
                  disabled={searching}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-ocean px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy disabled:cursor-not-allowed disabled:opacity-70 lg:gap-2 lg:px-5"
                >
                  {searching ? "Searching…" : (
                    <>
                      Search <Search className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Raio + Auto find */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-medium text-navy lg:text-sm">Radius</span>
              <select
                aria-label="Search radius in miles"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="cursor-pointer appearance-none rounded-lg bg-ocean py-2 pl-3 pr-8 text-xs font-medium text-white lg:text-sm"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 8px center",
                }}
              >
                {RADII.map((r) => (
                  <option key={r} value={r}>
                    {r} mi
                  </option>
                ))}
              </select>
              <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-gray-600 lg:text-sm">
                <input
                  type="checkbox"
                  checked={autoFind}
                  onChange={(e) => toggleAutoFind(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-ocean focus:ring-ocean"
                />
                <MapPin className="h-3.5 w-3.5" />
                Auto find
              </label>
            </div>
          </div>

          {/* Direita — mapa interativo */}
          <div className="w-full lg:min-w-0 lg:flex-1">
            <div
              ref={mapElRef}
              className="h-[280px] w-full overflow-hidden rounded-xl sm:h-[340px] lg:h-[420px] lg:rounded-2xl"
            />
          </div>
        </div>

        {/* CTA */}
        {ctaText && (
          <div className="mt-8 flex justify-center lg:mt-10">
            <Link
              href={ctaLink}
              className="gradient-navy inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white shadow-md transition-opacity hover:opacity-90 lg:text-base"
            >
              {ctaText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Selos de confiança */}
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-6 border-t border-gray-100 pt-8 sm:gap-x-12 lg:mt-14 lg:pt-10">
          {TRUST_BADGES.map((badge) => (
            <li key={badge.src}>
              <Image
                src={badge.src}
                alt={badge.alt}
                width={badge.width}
                height={badge.height}
                className="h-12 w-auto object-contain lg:h-14"
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
