// HelpPopover.tsx - Customer support hover popover (replaces HelpModal)
// Anchored under the "Help" nav link. Opens on hover (desktop) and click (touch/keyboard).
"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, Phone, Clock, ShieldCheck } from "lucide-react";

export function HelpPopover() {
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
        Help
      </button>

      <div
        role="dialog"
        aria-label="Help and support"
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
              <ShieldCheck className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="font-[family-name:var(--font-plus-jakarta)] text-base font-bold tracking-tight text-[#222]">
                Help &amp; Support
              </p>
              <p className="text-xs text-[#717171]">
                Guest-first, every step of the way.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <a
              href="tel:+923001234567"
              className="group/item flex items-center gap-3 rounded-xl border border-[#ebebeb] p-3 transition hover:border-[#10b981] hover:bg-[#10b981]/5"
            >
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#10b981]/10 text-[#10b981]">
                <Phone className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-[#222] transition group-hover/item:text-[#10b981]">
                  +92 300 1234567
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#717171]">
                  <Clock className="h-3 w-3" /> 9 AM – 9 PM PKT, daily
                </span>
              </span>
            </a>

            <a
              href="mailto:pakstay@cort.com"
              className="group/item flex items-center gap-3 rounded-xl border border-[#ebebeb] p-3 transition hover:border-[#10b981] hover:bg-[#10b981]/5"
            >
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#10b981]/10 text-[#10b981]">
                <Mail className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-[#222] transition group-hover/item:text-[#10b981]">
                  pakstay@cort.com
                </span>
                <span className="text-[11px] text-[#717171]">
                  Replies within 24 hours
                </span>
              </span>
            </a>
          </div>

          <p className="mt-4 border-t border-[#ebebeb] pt-3 text-center text-[11px] italic text-[#717171]">
            Your satisfaction is not just our goal — it is our responsibility.
          </p>
        </div>
      </div>
    </div>
  );
}
