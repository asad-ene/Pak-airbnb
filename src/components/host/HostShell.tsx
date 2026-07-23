"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type HostShellProps = {
  hostName?: string;
  onLogout?: () => void;
  children: React.ReactNode;
  className?: string;
};

export function HostShell({ hostName, onLogout, children, className }: HostShellProps) {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="border-b border-[#eeeeee] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold text-[#222]"
          >
            <span className="text-[#10b981]">Pak</span>Airbnb{" "}
            <span className="text-sm font-medium text-[#717171]">for hosts</span>
          </Link>

          {hostName && (
            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-[#717171] sm:inline">
                Signed in as <span className="font-medium text-[#222]">{hostName}</span>
              </span>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="rounded-full border border-[#dddddd] px-3.5 py-1.5 text-sm font-medium text-[#222] transition hover:border-[#222]"
                >
                  Log out
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      <main className={cn("mx-auto max-w-6xl px-4 py-10 sm:px-6", className)}>
        {children}
      </main>
    </div>
  );
}
