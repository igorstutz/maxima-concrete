"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, Menu, X, ChevronRight } from "lucide-react";
import Image from "@/components/Image";
import navigation from "@/content/settings/navigation.json";
import ServicesModal, { type SubmenuMode } from "@/components/ServicesModal";
import {
  NAV_ICONS,
  InstagramIcon,
  GoogleIcon,
  FacebookIcon,
} from "@/components/nav-icons";

const DESKTOP_MENU_STORAGE_KEY = "maxima_desktop_menu_open";

interface NavItem {
  label: string;
  href?: string;
  submenu?: SubmenuMode;
  icon: string;
  variant?: "outline";
  showIcon?: boolean;
}

const navItems = navigation.items as NavItem[];
const { logo, phone, email, social } = navigation;

const btnStyle = {
  background: "linear-gradient(90deg, #0D5D93 0%, #041C2D 100%)",
};

/** Normalizes trailing slashes so active-state works with trailingSlash: true. */
const normalizePath = (path: string) =>
  path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(true);
  const [modalMode, setModalMode] = useState<SubmenuMode | null>(null);
  const pathname = usePathname();

  // Restore persisted state after hydration (avoids SSR/client mismatch).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(DESKTOP_MENU_STORAGE_KEY);
      if (stored !== null) setIsDesktopMenuOpen(stored === "true");
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(DESKTOP_MENU_STORAGE_KEY, String(isDesktopMenuOpen));
    } catch {}
  }, [isDesktopMenuOpen]);

  // Auto-close desktop floating menu only after leaving the hero section
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024) return;
      const hero = document.querySelector("main section, body section") as HTMLElement | null;
      const heroBottom = hero
        ? hero.getBoundingClientRect().bottom + window.scrollY
        : 600;
      if (window.scrollY > heroBottom + 120) {
        setIsDesktopMenuOpen(false);
      } else if (window.scrollY < heroBottom - 40) {
        setIsDesktopMenuOpen(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Header Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-[1100] bg-white/95 backdrop-blur-sm shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" onClick={closeMobileMenu} aria-label="Maxima Concrete — Home">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-white"
            style={btnStyle}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-[1200] bg-black/50 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu Drawer */}
      <nav
        className={`lg:hidden fixed top-0 right-0 z-[1300] h-full w-[300px] shadow-2xl transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: "linear-gradient(180deg, #041C2D 0%, #0D5D93 100%)" }}
      >
        <div className="flex flex-col h-full pt-14 pb-8 px-4">
          <button
            onClick={closeMobileMenu}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>

          <Link href="/" onClick={closeMobileMenu} className="flex justify-center mb-5">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="h-16 w-auto brightness-0 invert"
            />
          </Link>

          <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = NAV_ICONS[item.icon];
              const isActive =
                item.href !== undefined &&
                normalizePath(pathname ?? "/") === normalizePath(item.href);
              const itemClass = `w-full py-2.5 px-3 flex items-center gap-3 text-sm font-medium rounded-lg transition-all ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`;
              const inner = (
                <>
                  {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.submenu && <ChevronRight className="h-3.5 w-3.5 opacity-50" />}
                </>
              );
              return item.submenu ? (
                <button
                  key={item.label}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setModalMode(item.submenu!);
                  }}
                  className={itemClass}
                >
                  {inner}
                </button>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  onClick={closeMobileMenu}
                  className={itemClass}
                >
                  {inner}
                </Link>
              );
            })}
          </div>

          {/* Bottom fixed section */}
          <div className="mt-auto pt-2">
            {/* Divider */}
            <div className="mb-3 h-px bg-white/10" />

            {/* Call Button */}
            <a
              href={phone.href}
              className="w-full py-3 flex items-center justify-center text-sm font-semibold text-[#041C2D] bg-white rounded-lg transition-all hover:bg-white/90 active:scale-[0.98]"
            >
              <Phone className="mr-2 h-4 w-4" />
              Call Now {phone.label}
            </a>

            {/* Social Icons */}
            <div className="mt-3 flex flex-col items-center gap-2">
              <div className="flex justify-center gap-2">
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white" aria-label="Instagram">
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a href={social.google} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white" aria-label="Google">
                  <GoogleIcon className="h-4 w-4" />
                </a>
                <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white" aria-label="Facebook">
                  <FacebookIcon className="h-4 w-4" />
                </a>
                <a href={`mailto:${email}`} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white" aria-label="Email">
                  <Mail className="h-4 w-4" />
                </a>
                <a href={phone.href} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white" aria-label="Phone">
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Desktop Floating Menu - Collapsed */}
      {!isDesktopMenuOpen && (
        <nav
          className="hidden lg:flex fixed z-50 flex-col items-center"
          style={{
            width: "181px",
            left: "150px",
            top: "32px",
            background: "#ffffff",
            border: "1px solid rgba(4,28,45,0.08)",
            boxShadow: "0 2px 8px rgba(4,28,45,0.06)",
            borderRadius: "10px",
            padding: "28px 0",
            gap: "24px",
          }}
        >
          <Link href="/" className="text-center" aria-label="Maxima Concrete — Home">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="h-[72px] w-auto"
            />
          </Link>
          <button
            onClick={() => setIsDesktopMenuOpen(true)}
            aria-label="Open menu"
            className="flex flex-col items-center justify-center gap-[5px] transition-opacity hover:opacity-70"
            style={{ width: "44px", height: "32px" }}
          >
            <span className="block h-[3px] w-7 rounded-sm bg-[#0D5D93]" />
            <span className="block h-[3px] w-7 rounded-sm bg-[#0D5D93]" />
            <span className="block h-[3px] w-7 rounded-sm bg-[#0D5D93]" />
          </button>

          <div className="flex flex-col items-center" style={{ gap: "10px" }}>
            <div className="flex justify-center gap-2">
              <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center text-[#0D5D93] transition-opacity hover:opacity-70" aria-label="Instagram">
                <InstagramIcon className="h-5 w-5" strokeWidth={2.5} />
              </a>
              <a href={social.google} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center text-[#0D5D93] transition-opacity hover:opacity-70" aria-label="Google">
                <GoogleIcon className="h-5 w-5" />
              </a>
              <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center text-[#0D5D93] transition-opacity hover:opacity-70" aria-label="Facebook">
                <FacebookIcon className="h-5 w-5" />
              </a>
            </div>
            <div className="flex justify-center gap-2">
              <a href={`mailto:${email}`} className="flex h-8 w-8 items-center justify-center text-[#0D5D93] transition-opacity hover:opacity-70" aria-label="Email">
                <Mail className="h-5 w-5" strokeWidth={2.5} />
              </a>
              <a href={phone.href} className="flex h-8 w-8 items-center justify-center text-[#0D5D93] transition-opacity hover:opacity-70" aria-label="Phone">
                <Phone className="h-5 w-5" strokeWidth={2.5} />
              </a>
            </div>
          </div>
        </nav>
      )}

      {/* Desktop Floating Menu - Expanded */}
      <nav
        className={`${isDesktopMenuOpen ? "hidden lg:flex" : "hidden"} fixed z-50 flex-col items-center overflow-y-auto`}
        style={{
          width: "181px",
          left: "150px",
          top: "32px",
          maxHeight: "calc(100vh - 64px)",
          background: "#ffffff",
          border: "1px solid rgba(4,28,45,0.08)",
          boxShadow: "0 2px 8px rgba(4,28,45,0.06)",
          borderRadius: "10px",
          padding: "18px 0",
          gap: "18px",
        }}
      >
        <button
          onClick={() => setIsDesktopMenuOpen(false)}
          aria-label="Collapse menu"
          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/40 text-[#041C2D] transition-colors hover:bg-white/70"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Logo */}
        <Link href="/" className="text-center" aria-label="Maxima Concrete — Home">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className="h-[72px] w-auto"
            priority
          />
        </Link>

        {/* Navigation Buttons */}
        <div className="flex flex-col" style={{ gap: "6px" }}>
          {navItems.map((item) => {
            const isOutline = item.variant === "outline";
            const Icon = NAV_ICONS[item.icon];
            const itemClass = `group flex items-center justify-center text-sm font-medium transition-all hover:brightness-110 ${
              isOutline ? "text-[#041C2D]" : "text-white"
            }`;
            const itemStyle: React.CSSProperties = {
              width: "150px",
              height: "38px",
              padding: "9px",
              ...(isOutline
                ? {
                    background:
                      "linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(90deg, #0D5D93 0%, #041C2D 100%) border-box",
                    border: "2px solid transparent",
                  }
                : {
                    background:
                      "linear-gradient(90deg, #0D5D93 0%, #041C2D 100%)",
                    border: "none",
                  }),
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: isOutline ? 600 : 500,
            };
            const inner = (
              <>
                {item.showIcon && Icon && <Icon className="mr-1.5 h-4 w-4" />}
                {item.label}
              </>
            );
            return item.submenu ? (
              <button
                key={item.label}
                onClick={() => setModalMode(item.submenu!)}
                className={itemClass}
                style={itemStyle}
              >
                {inner}
              </button>
            ) : (
              <Link key={item.label} href={item.href!} className={itemClass} style={itemStyle}>
                {inner}
              </Link>
            );
          })}
        </div>

        {/* Call Now */}
        <a
          href={phone.href}
          className="flex flex-col items-center justify-center text-white transition-all hover:brightness-110"
          style={{
            width: "150px",
            height: "56px",
            padding: "8px",
            background: "linear-gradient(90deg, #0D5D93 0%, #041C2D 100%)",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
        >
          <span className="flex items-center text-sm font-semibold">
            <Phone className="mr-1 h-4 w-4" />
            Call Now
          </span>
          <span className="text-xs font-medium">{phone.label}</span>
        </a>

        {/* Social Icons */}
        <div className="flex flex-col items-center" style={{ gap: "8px" }}>
          <div className="flex justify-center gap-1">
            <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-200 text-gray-600 transition-colors hover:bg-gray-300" aria-label="Instagram">
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a href={social.google} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-200 text-gray-600 transition-colors hover:bg-gray-300" aria-label="Google">
              <GoogleIcon className="h-4 w-4" />
            </a>
            <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-200 text-gray-600 transition-colors hover:bg-gray-300" aria-label="Facebook">
              <FacebookIcon className="h-4 w-4" />
            </a>
          </div>
          <div className="flex justify-center gap-1">
            <a href={`mailto:${email}`} className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-200 text-gray-600 transition-colors hover:bg-gray-300" aria-label="Email">
              <Mail className="h-4 w-4" />
            </a>
            <a href={phone.href} className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-200 text-gray-600 transition-colors hover:bg-gray-300" aria-label="Phone">
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* Services/Finishes/Why Modal */}
      <ServicesModal
        isOpen={modalMode !== null}
        onClose={() => setModalMode(null)}
        mode={modalMode || "services"}
      />
    </>
  );
};

export default Navigation;
