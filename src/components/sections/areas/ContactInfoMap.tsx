"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";

// Ícones de marca (removidos do lucide 1.x) — SVGs no mesmo estilo stroke.
type BrandIconProps = { size?: number };
const Facebook = ({ size = 16 }: BrandIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const Instagram = ({ size = 16 }: BrandIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const Twitter = ({ size = 16 }: BrandIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);
const Youtube = ({ size = 16 }: BrandIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);
import { Container } from "@/components/Container";
import { SERVICE_AREAS } from "./service-areas";

/**
 * Informações de contato + mapa (página Contact Us) — type "contact-info-map".
 * O modal "Areas We Serve" (antes carregado do Supabase) agora usa o snapshot
 * estático de ./service-areas.
 */
export default function ContactInfoMap({ content }: { content: Record<string, any> }) {
  const [areasOpen, setAreasOpen] = useState(false);

  useEffect(() => {
    if (!areasOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAreasOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [areasOpen]);

  const title: string = content?.title || "Contact Us";
  const subtitle: string =
    content?.subtitle || "Your Trusted Concrete Contractor in Central Ohio";
  const intro: string =
    content?.intro ||
    "Tell us about your project, ask a question, or request your free estimate.";
  const description: string =
    content?.description ||
    "Our experts will review your details and get back to you quickly with insights, timelines, and recommendations.";
  const addressLabel: string = content?.addressLabel || "Office Address:";
  const addressLine1: string = content?.addressLine1 || "4059 State Route 37 E, Suite A";
  const addressLine2: string = content?.addressLine2 || "Delaware, OH 43015";
  const phoneLabel: string = content?.phoneLabel || "Phone:";
  const phone: string = content?.phone || "(614) 384-5917";
  const emailLabel: string = content?.emailLabel || "Email:";
  const email: string = content?.email || "info@maximaconcrete.com";
  const hoursLabel: string = content?.hoursLabel || "Business Hours:";
  const hoursLine1: string = content?.hoursLine1 || "Monday – Friday: 8 AM – 5 PM";
  const hoursLine2: string = content?.hoursLine2 || "Saturday: By Appointment";
  const hoursLine3: string = content?.hoursLine3 || "Sunday: Closed";
  const facebookUrl: string = content?.facebookUrl || "";
  const instagramUrl: string = content?.instagramUrl || "";
  const twitterUrl: string = content?.twitterUrl || "";
  const youtubeUrl: string = content?.youtubeUrl || "";
  const mapEmbedUrl: string =
    content?.mapEmbedUrl ||
    "https://www.google.com/maps?q=4059+State+Route+37+E,+Delaware,+OH+43015&output=embed";

  const phoneHref = `tel:${(phone || "").replace(/[^\d+]/g, "")}`;

  const socials = [
    { url: facebookUrl, label: "Facebook", Icon: Facebook, dark: true },
    { url: instagramUrl, label: "Instagram", Icon: Instagram, dark: false },
    { url: twitterUrl, label: "Twitter", Icon: Twitter, dark: true },
    { url: youtubeUrl, label: "YouTube", Icon: Youtube, dark: false },
  ].filter((s) => s.url);

  return (
    <section className="bg-surface-alt py-12 md:py-16 lg:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-12 xl:gap-16">
          {/* Coluna esquerda — informações */}
          <div className="space-y-6">
            <h2 className="text-3xl font-light text-navy md:text-4xl">{title}</h2>
            <p className="border-b border-navy/15 pb-6 text-base text-navy/70 md:text-lg">
              {subtitle}
            </p>

            {socials.length > 0 && (
              <div className="flex items-center gap-3 pt-1">
                {socials.map(({ url, label, Icon, dark }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={
                      dark
                        ? "flex h-9 w-9 items-center justify-center rounded-md bg-navy text-white transition-colors hover:bg-ocean"
                        : "flex h-9 w-9 items-center justify-center rounded-md bg-ocean text-white transition-colors hover:bg-navy"
                    }
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            )}

            <div className="space-y-3 text-sm text-navy/80 md:text-base">
              <p>{intro}</p>
              <p>{description}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                className="gradient-navy inline-flex items-center gap-2 rounded-[10px] px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:opacity-90"
              >
                {content?.ctaText || "Request a Free Estimate"}
                <ArrowRight size={18} />
              </a>
              <button
                type="button"
                onClick={() => setAreasOpen(true)}
                className="inline-flex items-center gap-2 rounded-[10px] border-2 border-navy bg-white px-6 py-3 font-medium text-navy transition-all duration-300 hover:bg-navy hover:text-white"
              >
                <MapPin size={18} />
                {content?.areasCtaText || "Areas We Serve"}
              </button>
            </div>

            <div className="space-y-4 border-t border-navy/15 pt-2">
              <div className="flex items-start gap-3 pt-4">
                <MapPin size={18} className="mt-0.5 flex-shrink-0 text-[#C0392B]" />
                <div className="text-sm text-navy/80 md:text-base">
                  <p className="font-medium text-navy">{addressLabel}</p>
                  <p>{addressLine1}</p>
                  <p>{addressLine2}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 flex-shrink-0 text-navy" />
                <p className="text-sm text-navy/80 md:text-base">
                  <span className="font-medium text-navy">{phoneLabel} </span>
                  <a href={phoneHref} className="transition-colors hover:text-ocean">
                    {phone}
                  </a>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 flex-shrink-0 text-navy" />
                <p className="text-sm text-navy/80 md:text-base">
                  <span className="font-medium text-navy">{emailLabel} </span>
                  <a
                    href={`mailto:${email}`}
                    className="transition-colors hover:text-ocean"
                  >
                    {email}
                  </a>
                </p>
              </div>

              <div className="flex items-start gap-3 border-t border-navy/15 pt-2">
                <Clock size={18} className="mt-3 flex-shrink-0 text-navy" />
                <div className="pt-2 text-sm text-navy/80 md:text-base">
                  <p className="font-medium text-navy">{hoursLabel}</p>
                  <p>{hoursLine1}</p>
                  <p>{hoursLine2}</p>
                  <p>{hoursLine3}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna direita — mapa */}
          <div className="h-[320px] w-full overflow-hidden rounded-md border border-navy/10 shadow-sm md:h-[480px] lg:h-full lg:min-h-[520px]">
            <iframe
              src={mapEmbedUrl}
              title="Office location map"
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </Container>

      {areasOpen && (
        <div
          className="fixed inset-0 z-[1400] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setAreasOpen(false)}
        >
          <div
            className="relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h3 className="text-xl font-semibold text-navy md:text-2xl">
                  Areas We Serve
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Click a city to explore concrete services there.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAreasOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-navy transition-colors hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {SERVICE_AREAS.map((area) => (
                  <Link
                    key={area.slug}
                    href={`/areas-we-serve/${area.slug}/`}
                    onClick={() => setAreasOpen(false)}
                    className="group flex items-center justify-between gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm text-navy transition-all hover:border-ocean hover:bg-ocean/5"
                  >
                    <span className="font-medium">{area.name}</span>
                    <ArrowUpRight
                      size={16}
                      className="text-gray-400 transition-colors group-hover:text-ocean"
                    />
                  </Link>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
              <Link
                href="/areas-we-serve/"
                onClick={() => setAreasOpen(false)}
                className="inline-flex items-center gap-1 text-sm font-medium text-ocean hover:text-navy"
              >
                View full Areas We Serve page
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
