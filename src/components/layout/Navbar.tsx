// Updated Navbar.tsx - Help now opens as a hover popover instead of a modal
"use client";

import Link from "next/link";
import { useState } from "react";
import { Mountain, User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { HelpPopover } from "@/components/layout/HelpPopover";
import { HowItWorksPopover } from "@/components/layout/HowItWorksPopover";
import { DestinationsPopover } from "@/components/layout/DestinationsPopover";
import { useGuestAuth } from "@/hooks/useGuestAuth";
import { useHostAuth } from "@/hooks/useHostAuth";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Navbar() {
  const { guest, ready: guestReady, logout: guestLogout } = useGuestAuth();
  const { host, ready: hostReady, logout: hostLogout } = useHostAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = host ?? guest;
  const isHost = Boolean(host);
  const ready = guestReady && hostReady;

  function handleSignOut() {
    if (isHost) {
      hostLogout();
    } else {
      guestLogout();
      signOut({ redirect: false });
    }
    setMenuOpen(false);
  }

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

        <div className="flex items-center gap-3 relative">
          <Link
            href="/host/signup"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-[#222] transition hover:bg-[#f7f7f7] sm:block"
          >
            Become a host
          </Link>

          {ready && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="inline-flex items-center gap-3 rounded-full border border-[#dddddd] bg-white px-4 py-2 text-sm font-medium text-[#222] shadow-sm transition hover:shadow-md"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#10b981] text-sm font-semibold text-white">
                  {getInitials(user.name)}
                </span>
                <span>{user.name.split(" ")[0]}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl border border-[#e5e7eb] bg-white p-2 shadow-lg">
                  <div className="px-3 py-2 text-sm text-[#717171]">
                    <p className="font-semibold text-[#222]">{user.name}</p>
                    <p className="truncate text-xs">{user.email}</p>
                  </div>
                  <div className="mt-2 border-t border-[#f3f4f6] pt-2">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm text-[#222] transition hover:bg-[#f7f7f7]"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-[#dddddd] px-4 py-2 text-sm font-medium text-[#222] transition hover:shadow-sm"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
