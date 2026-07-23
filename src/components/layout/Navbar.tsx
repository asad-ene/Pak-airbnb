// Updated Navbar.tsx - Help now opens as a hover popover instead of a modal
"use client";

import Link from "next/link";
import { Mountain } from "lucide-react";
import { HelpPopover } from "@/components/layout/HelpPopover";
import { HowItWorksPopover } from "@/components/layout/HowItWorksPopover";
import { DestinationsPopover } from "@/components/layout/DestinationsPopover";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#ebebeb] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Mountain className="h-7 w-7 text-[#10b981]" />
          <span className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold tracking-tight text-[#222]">
            PakStays
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#222] md:flex">
          <DestinationsPopover />
          <HowItWorksPopover />
          <HelpPopover />
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/host/signup"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-[#222] transition hover:bg-[#f7f7f7] sm:block"
          >
            Become a host
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-[#dddddd] px-4 py-2 text-sm font-medium text-[#222] transition hover:shadow-sm"
          >
            Log in
          </Link>
        </div>
      </div>
    </header>
  );
}
