// HowItWorksPopover.tsx - "How it works" hover popover, same pattern as HelpPopover
// Anchored under the "How it works" nav link. Opens on hover (desktop) and click (touch/keyboard).
"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, MapPin, CalendarDays, Tag } from "lucide-react";

export function HowItWorksPopover() {
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

  // Close on Escape and on outside click
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
        How it works
      </button>

      <div
        role="dialog"
        aria-label="How PakStays works"
        className={`absolute right-0 top-full z-50 w-80 pt-3 transition-all duration-200 ease-out ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div className="relative rounded-2xl border border-[#ebebeb] bg-white p-5 shadow-xl">
          {/* Arrow pointer */}
          <div className="absolute -top-1.5 right-6 h-3 w-3 rotate-45 border-l border-t border-[#ebebeb] bg-white" />

          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#10b981]/10 text-[#10b981]">
              <Compass className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="font-[family-name:var(--font-plus-jakarta)] text-base font-bold tracking-tight text-[#222]">
                How it works
              </p>
              <p className="text-xs text-[#717171]">
                Book your stay in three simple steps.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-3 rounded-xl border border-[#ebebeb] p-3">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#10b981]/10 text-[#10b981]">
                <MapPin className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-[#222]">
                  Pick your destination
                </span>
                <span className="text-[11px] text-[#717171]">
                  Naran, Hunza, Skardu, and more — filtered to match what you're after
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#ebebeb] p-3">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#10b981]/10 text-[#10b981]">
                <CalendarDays className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-[#222]">
                  Choose dates &amp; guests
                </span>
                <span className="text-[11px] text-[#717171]">
                  Set your check-in, check-out, and how many people are staying
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#ebebeb] p-3">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#10b981]/10 text-[#10b981]">
                <Tag className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-[#222]">
                  See a fair price instantly
                </span>
                <span className="text-[11px] text-[#717171]">
                  A clear, reasonable rate right away — no hidden fees
                </span>
              </span>
            </div>
          </div>

          <p className="mt-4 border-t border-[#ebebeb] pt-3 text-center text-[11px] italic text-[#717171]">
            Simple search, honest prices — booking made easy.
          </p>
        </div>
      </div>
    </div>
  );
}
