"use client";

import { MapPin, Minus, Plus, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { searchDestinations, type Destination } from "@/lib/destinations";
import { cn, formatDateLabel } from "@/lib/utils";
import type { SearchParams } from "@/types/search";

type SearchBarProps = {
  search: SearchParams;
  onChange: (patch: Partial<SearchParams>) => void;
  onSubmit?: () => void;
  variant?: "hero" | "compact";
  className?: string;
};

export function SearchBar({
  search,
  onChange,
  onSubmit,
  variant = "hero",
  className,
}: SearchBarProps) {
  const [destinationQuery, setDestinationQuery] = useState(
    search.destinationName
  );
  const [showDestinations, setShowDestinations] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const containerRef = useRef<HTMLFormElement>(null);
  const destinationFieldRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [dropdownRect, setDropdownRect] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  const suggestions = searchDestinations(destinationQuery);

  useEffect(() => {
    setDestinationQuery(search.destinationName);
  }, [search.destinationName]);

  // Portals render into document.body, so wait for client mount before using them.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep the portaled dropdown glued to the destination field, even on
  // scroll/resize, since it's no longer a DOM child of that field.
  useEffect(() => {
    if (!showDestinations) return;

    function updatePosition() {
      if (!destinationFieldRef.current) return;
      const rect = destinationFieldRef.current.getBoundingClientRect();
      setDropdownRect({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [showDestinations]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const insideForm = containerRef.current?.contains(target);
      const insideDropdown = dropdownRef.current?.contains(target);
      if (!insideForm && !insideDropdown) {
        setShowDestinations(false);
        setActiveField(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectDestination(dest: Destination) {
    onChange({
      destinationSlug: dest.slug,
      destinationName: dest.name,
    });
    setDestinationQuery(dest.name);
    setShowDestinations(false);
    setActiveField(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.();
  }

  const isHero = variant === "hero";

  return (
    <form
      onSubmit={handleSubmit}
      ref={containerRef}
      className={cn(
        "relative w-full bg-white",
        isHero
          ? "rounded-full border border-[#dddddd] shadow-[0_6px_20px_rgba(0,0,0,0.1)]"
          : "rounded-2xl border border-[#dddddd] shadow-sm",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-col md:flex-row md:items-stretch",
          isHero ? "md:divide-x md:divide-[#ebebeb]" : "divide-y md:divide-y-0 md:divide-x divide-[#ebebeb]"
        )}
      >
        {/* Destination */}
        <div
          ref={destinationFieldRef}
          className={cn(
            "relative flex-1 px-6 py-4 transition-colors rounded-t-full md:rounded-l-full md:rounded-tr-none",
            activeField === "destination" && "bg-[#f7f7f7]"
          )}
          onClick={() => {
            setActiveField("destination");
            setShowDestinations(true);
          }}
        >
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#222]">
            Where
          </label>
          <input
            type="text"
            value={destinationQuery}
            onChange={(e) => {
              setDestinationQuery(e.target.value);
              setShowDestinations(true);
              if (!e.target.value) {
                onChange({ destinationSlug: "", destinationName: "" });
              }
            }}
            onFocus={() => {
              setActiveField("destination");
              setShowDestinations(true);
            }}
            placeholder="Naran, Hunza, Skardu..."
            className="mt-0.5 w-full bg-transparent text-sm text-[#222] outline-none placeholder:text-[#717171]"
            autoComplete="off"
          />

          {mounted &&
            showDestinations &&
            suggestions.length > 0 &&
            dropdownRect &&
            createPortal(
              <ul
                ref={dropdownRef}
                style={{
                  position: "fixed",
                  top: dropdownRect.top,
                  left: dropdownRect.left,
                  width: dropdownRect.width,
                }}
                className="z-[9999] max-h-64 overflow-y-auto rounded-2xl border border-[#ebebeb] bg-white py-2 shadow-[0_8px_28px_rgba(0,0,0,0.12)]"
              >
                {suggestions.map((dest) => (
                  <li key={dest.id}>
                    <button
                      type="button"
                      onClick={() => selectDestination(dest)}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-[#f7f7f7] transition-colors"
                    >
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#717171]" />
                      <div>
                        <p className="text-sm font-medium text-[#222]">
                          {dest.name}
                        </p>
                        <p className="text-xs text-[#717171]">
                          {dest.region} · {dest.tagline}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>,
              document.body
            )}
        </div>

        {/* Check-in */}
        <div
          className={cn(
            "flex-1 px-6 py-4 transition-colors",
            activeField === "checkIn" && "bg-[#f7f7f7]"
          )}
          onClick={() => setActiveField("checkIn")}
        >
          <label
            htmlFor="check-in"
            className="block text-xs font-semibold uppercase tracking-wide text-[#222]"
          >
            Check in
          </label>
          <input
            id="check-in"
            type="date"
            value={search.checkIn}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => onChange({ checkIn: e.target.value })}
            onFocus={() => setActiveField("checkIn")}
            className="mt-0.5 w-full bg-transparent text-sm text-[#222] outline-none [color-scheme:light]"
          />
          <span className="sr-only">{formatDateLabel(new Date(search.checkIn))}</span>
        </div>

        {/* Check-out */}
        <div
          className={cn(
            "flex-1 px-6 py-4 transition-colors",
            activeField === "checkOut" && "bg-[#f7f7f7]"
          )}
          onClick={() => setActiveField("checkOut")}
        >
          <label
            htmlFor="check-out"
            className="block text-xs font-semibold uppercase tracking-wide text-[#222]"
          >
            Check out
          </label>
          <input
            id="check-out"
            type="date"
            value={search.checkOut}
            min={search.checkIn || new Date().toISOString().split("T")[0]}
            onChange={(e) => onChange({ checkOut: e.target.value })}
            onFocus={() => setActiveField("checkOut")}
            className="mt-0.5 w-full bg-transparent text-sm text-[#222] outline-none [color-scheme:light]"
          />
        </div>

        {/* Guests */}
        <div
          className={cn(
            "flex flex-1 items-center justify-between gap-4 px-6 py-4 transition-colors",
            activeField === "guests" && "bg-[#f7f7f7]"
          )}
          onClick={() => setActiveField("guests")}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#222]">
              Guests
            </p>
            <p className="mt-0.5 text-sm text-[#222]">
              {search.guests} guest{search.guests !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Decrease guests"
              disabled={search.guests <= 1}
              onClick={(e) => {
                e.stopPropagation();
                onChange({ guests: Math.max(1, search.guests - 1) });
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dddddd] text-[#222] transition hover:border-[#222] disabled:opacity-30 disabled:hover:border-[#dddddd]"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-4 text-center text-sm font-medium">
              {search.guests}
            </span>
            <button
              type="button"
              aria-label="Increase guests"
              disabled={search.guests >= 16}
              onClick={(e) => {
                e.stopPropagation();
                onChange({ guests: Math.min(16, search.guests + 1) });
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dddddd] text-[#222] transition hover:border-[#222] disabled:opacity-30 disabled:hover:border-[#dddddd]"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Search button */}
        <div className="flex items-center p-2 md:pr-2 md:pl-0">
          <button
            type="submit"
            className={cn(
              "flex items-center justify-center gap-2 bg-[#e63946] text-white font-semibold transition hover:bg-[#c1121f]",
              isHero
                ? "w-full md:w-auto rounded-full px-6 py-4 md:py-3.5 md:px-5"
                : "w-full rounded-xl px-6 py-3"
            )}
          >
            <Search className="h-4 w-4" />
            <span className={isHero ? "md:hidden lg:inline" : ""}>Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}
