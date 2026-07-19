"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { X, Search } from "lucide-react";
import navigation from "@/content/settings/navigation.json";
import { NAV_ICONS } from "@/components/nav-icons";

export type SubmenuMode = "services" | "finishes" | "why";

interface SubmenuItem {
  label: string;
  href: string;
  icon: string;
}

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: SubmenuMode;
}

const ServiceCard = ({
  item,
  onSelect,
}: {
  item: SubmenuItem;
  onSelect: () => void;
}) => {
  const Icon = NAV_ICONS[item.icon];
  return (
    <Link
      href={item.href}
      onClick={onSelect}
      className="group flex flex-col items-center gap-1.5 sm:gap-2.5 rounded-lg sm:rounded-xl bg-white/8 border border-white/10 px-2 py-3 sm:px-3 sm:py-5 text-center transition-all duration-200 hover:bg-white/15 hover:border-white/25 hover:scale-[1.03] hover:shadow-lg"
    >
      <div className="flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-md sm:rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
        {Icon && (
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white/80 group-hover:text-white transition-colors" />
        )}
      </div>
      <span className="text-[10px] sm:text-xs font-semibold text-white/85 group-hover:text-white leading-tight transition-colors">
        {item.label}
      </span>
    </Link>
  );
};

const ServicesModal = ({ isOpen, onClose, mode = "services" }: ServicesModalProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setSearchOpen(false);
      setSearchQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  if (!isOpen) return null;

  const submenu = navigation.submenus[mode];
  const { title, subtitle } = submenu;
  const items = submenu.items as SubmenuItem[];

  const filteredItems = searchQuery.trim()
    ? items.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[1400] bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 sm:inset-auto sm:fixed sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[1401] flex items-end sm:items-center justify-center">
        <div
          className="relative w-full sm:max-w-[780px] max-h-[95vh] sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-y-auto animate-modal-in"
          style={{
            background: "linear-gradient(145deg, #041C2D 0%, #0D5D93 50%, #041C2D 100%)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 sm:px-8 pt-5 sm:pt-8 pb-2 sticky top-0 z-10"
            style={{ background: "linear-gradient(145deg, #041C2D 0%, #0a4a75 100%)" }}
          >
            <div className="flex items-center gap-2">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">{title}</h2>
                <p className="text-xs sm:text-sm text-white/60 mt-0.5 sm:mt-1">{subtitle}</p>
              </div>
              <button
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  if (searchOpen) setSearchQuery("");
                }}
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all ml-1"
                aria-label="Search services"
              >
                <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all"
              aria-label="Close menu"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="px-4 sm:px-8 pt-3 pb-1">
              <div className="flex items-center gap-2 rounded-lg bg-white/10 border border-white/15 px-3 py-2">
                <Search className="h-4 w-4 text-white/50 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services..."
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-white/50 hover:text-white">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Items Grid */}
          <div className="px-4 sm:px-8 pt-4 sm:pt-6 pb-6 sm:pb-8">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                {filteredItems.map((item) => (
                  <ServiceCard key={item.href + item.label} item={item} onSelect={onClose} />
                ))}
              </div>
            ) : (
              <p className="text-center text-white/50 text-sm py-8">No services found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesModal;
