// DestinationsPopover.tsx - "Destinations" hover popover, same pattern as HelpPopover
// Uses photo thumbnails instead of icons since the point here is to show the places off.
"use client";

import { useEffect, useRef, useState } from "react";
import { Map } from "lucide-react";

type Destination = {
  name: string;
  description: string;
  image: string;
};

const DESTINATIONS: Destination[] = [
  {
    name: "Hunza",
    description: "Terraced orchards, snow peaks, and centuries-old forts.",
    image: "/images/hunza-valley-1.png",
  },
  {
    name: "Skardu",
    description: "Gateway to K2, framed by dramatic desert-mountain scenery.",
    image: "https://picsum.photos/id/1040/200/200",
  },
  {
    name: "Naran",
    description: "Alpine lakes and pine forests along the Kunhar River.",
    image: "https://picsum.photos/id/1015/200/200",
  },
  {
    name: "Fairy Meadows",
    description: "Base camp views of Nanga Parbat, the world's 9th-highest peak.",
    image: "/images/fairy-meadows.png",
  },
  {
    name: "Attabad Lake",
    description: "Turquoise waters formed by a 2010 landslide dam.",
    image: "/images/attabad-lake.png",
  },
];

export function DestinationsPopover() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  useEffect(() => () => cancelClose(), []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="transition hover:text-[#10b981]"
      >
        Destinations
      </button>

      <div
        role="dialog"
        aria-label="Popular destinations"
        className={`absolute left-0 top-full z-50 w-80 pt-3 transition-all duration-200 ease-out ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div className="relative rounded-2xl border border-[#ebebeb] bg-white p-5 shadow-xl">
          {/* Arrow pointer */}
          <div className="absolute -top-1.5 left-6 h-3 w-3 rotate-45 border-l border-t border-[#ebebeb] bg-white" />

          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#10b981]/10 text-[#10b981]">
              <Map className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="font-[family-name:var(--font-plus-jakarta)] text-base font-bold tracking-tight text-[#222]">
                Explore destinations
              </p>
              <p className="text-xs text-[#717171]">
                Handpicked beauty across the north.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {DESTINATIONS.map((dest) => (
              // eslint-disable-next-line @next/next/no-img-element
              <div
                key={dest.name}
                className="flex items-center gap-3 rounded-xl border border-[#ebebeb] p-2.5"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                  loading="lazy"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-[#222]">
                    {dest.name}
                  </span>
                  <span className="block text-[11px] leading-snug text-[#717171]">
                    {dest.description}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 border-t border-[#ebebeb] pt-3 text-center text-[11px] italic text-[#717171]">
            From glacial valleys to alpine meadows — find your next stay.
          </p>
        </div>
      </div>
    </div>
  );
}
