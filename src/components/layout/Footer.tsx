"use client";

import { ChevronDown, ChevronUp, Mountain } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { INSPIRATION_TABS } from "@/lib/footerInspiration";

const PRIMARY_COUNT = 17; // 3 rows x 6 cols, minus the "Show more" cell

const SUPPORT_LINKS = [
  { label: "Help Center", href: "#" },
  { label: "Get help with a safety issue", href: "#" },
  { label: "Cancellation options", href: "#" },
  { label: "Report a neighborhood concern", href: "#" },
  { label: "Trust & safety", href: "#" },
];

const HOSTING_LINKS = [
  { label: "List your place", href: "/host/signup" },
  { label: "Hosting resources", href: "#" },
  { label: "Community forum", href: "#" },
  { label: "Hosting responsibly", href: "#" },
];

const COMPANY_LINKS = [
  { label: "About PakStays", href: "#" },
  { label: "What's new", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Investors", href: "#" },
];

export function Footer() {
  const [activeTabId, setActiveTabId] = useState(INSPIRATION_TABS[0].id);
  const [expanded, setExpanded] = useState(false);

  const activeTab = INSPIRATION_TABS.find((t) => t.id === activeTabId) ?? INSPIRATION_TABS[0];
  const visibleItems = expanded ? activeTab.items : activeTab.items.slice(0, PRIMARY_COUNT);

  function selectTab(id: string) {
    setActiveTabId(id);
    setExpanded(false);
  }

  return (
    <footer className="border-t border-[#eeeeee] bg-[#fafafa]">
      {/* Inspiration for future getaways */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h2 className="text-xl font-semibold text-[#222] sm:text-2xl">
          Inspiration for future getaways
        </h2>

        <div className="mt-4 overflow-x-auto">
          <div className="flex min-w-max gap-6 border-b border-[#eeeeee] text-sm">
            {INSPIRATION_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => selectTab(tab.id)}
                className={`whitespace-nowrap border-b-2 pb-3 pt-1 font-medium transition ${
                  tab.id === activeTabId
                    ? "border-[#222] text-[#222]"
                    : "border-transparent text-[#717171] hover:text-[#222]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
          {visibleItems.map((item, i) => (
            <Link
              key={`${item.name}-${i}`}
              href="#"
              className="block leading-snug"
            >
              <span className="block text-sm font-semibold text-[#222]">{item.name}</span>
              <span className="block text-sm text-[#717171] transition group-hover:underline hover:text-[#222] hover:underline">
                {item.category}
              </span>
            </Link>
          ))}

          {!expanded && activeTab.items.length > PRIMARY_COUNT && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="flex items-center gap-1 text-sm font-semibold text-[#222] underline decoration-1 underline-offset-2"
            >
              Show more
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {expanded && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="mt-5 flex items-center gap-1 text-sm font-semibold text-[#222] underline decoration-1 underline-offset-2"
          >
            Show less
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Link columns */}
      <div className="border-t border-[#eeeeee]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-[#222]">Support</h3>
            <ul className="mt-3 space-y-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[#717171] hover:underline hover:text-[#222]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#222]">Hosting</h3>
            <ul className="mt-3 space-y-3">
              {HOSTING_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[#717171] hover:underline hover:text-[#222]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#222]">PakStays</h3>
            <ul className="mt-3 space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[#717171] hover:underline hover:text-[#222]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#eeeeee]">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-4 px-4 py-6 text-sm text-[#717171] sm:flex-row sm:px-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-1.5 font-medium text-[#222]">
              <Mountain className="h-4 w-4 text-[#10b981]" />
              © {new Date().getFullYear()} PakStays
            </span>
            <Link href="#" className="hover:underline hover:text-[#222]">Privacy</Link>
            <Link href="#" className="hover:underline hover:text-[#222]">Terms</Link>
            <Link href="#" className="hover:underline hover:text-[#222]">Sitemap</Link>
          </div>

          <div className="flex items-center gap-4">
            <button type="button" className="rounded-full border border-[#dddddd] px-3 py-1.5 font-medium text-[#222] transition hover:shadow-sm">
              English (PK)
            </button>
            <button type="button" className="rounded-full border border-[#dddddd] px-3 py-1.5 font-medium text-[#222] transition hover:shadow-sm">
              PKR
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
