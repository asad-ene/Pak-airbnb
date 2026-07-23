// Updated page.tsx - Added interactive destination image gallery with hover transitions
"use client";

import { useEffect, useState } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { LiveQuoteWidget } from "@/components/home/LiveQuoteWidget";
import { PopularHomesRow } from "@/components/home/PopularHomesRow";
import { DestinationHighlights } from "@/components/home/DestinationHighlights";
import { Navbar } from "@/components/layout/Navbar";
import { Reveal } from "@/components/ui/Reveal";
import { useLiveQuote } from "@/hooks/useLiveQuote";
import { DESTINATIONS } from "@/lib/destinations";
import { heroImages } from "@/lib/heroImages";
import { naranListings, hunzaListings, skurduListings } from "@/lib/listings";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  const { search, updateSearch, quote, loading, error } = useLiveQuote();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredDest, setHoveredDest] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const activeDest = hoveredDest || search.destinationSlug;
  const images =
    activeDest && heroImages[activeDest]
      ? heroImages[activeDest]
      : heroImages.naran;

  // Reset to the first photo whenever the active destination changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [activeDest]);

  // Auto-advance every 3 seconds; pause while hovered
  useEffect(() => {
    if (isPaused || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images, isPaused]);

  return (
    <>
      <Navbar />

      <main>
        {/* Hero with Image Gallery */}
        <section className="relative overflow-hidden bg-white pb-16 pt-10 sm:pb-20 sm:pt-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,#f0fdf4_0%,#ffffff_50%)]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-3 text-sm font-medium text-[#10b981]">
                Pakistan-wide · book online in 60 seconds
              </p>
              <h1 className="font-[family-name:var(--font-plus-jakarta)] text-4xl font-bold tracking-tight text-[#222] sm:text-5xl lg:text-6xl">
                Vacation stays across{" "}
                <span className="text-[#10b981]">Northern Pakistan</span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base text-[#717171] sm:text-lg">
                Choose your destination, see your price instantly, and book
                guest houses, cottages, and homestays in Naran, Hunza, Skardu,
                and beyond.
              </p>
            </div>

            {/* Interactive Image Gallery */}
            <Reveal>
              <div
                className="relative mx-auto mt-10 max-w-5xl overflow-hidden rounded-3xl shadow-xl"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="relative h-[420px] w-full">
                  {images.map((src, index) => (
                    <img
                      key={src}
                      src={src}
                      alt="Northern Pakistan Landscape"
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                        index === currentImageIndex ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}
                </div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

                <div className="absolute bottom-8 left-8 text-white">
                  <p className="text-sm uppercase tracking-widest opacity-75">Discover</p>
                  <p className="text-3xl font-bold">Northern Wonders</p>
                </div>

                {/* Progress dots */}
                <div className="absolute bottom-8 right-8 flex gap-1.5">
                  {images.map((_, index) => (
                    <span
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentImageIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Search bar */}
            <Reveal delay={120}>
              <div className="relative mx-auto -mt-8 max-w-4xl z-10">
                <SearchBar
                  search={search}
                  onChange={updateSearch}
                  variant="hero"
                />
              </div>
            </Reveal>

            {/* Quick destination chips with hover effect */}
            <Reveal delay={220}>
              <div className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-2">
                <span className="text-xs text-[#717171]">Popular:</span>
                {DESTINATIONS.slice(0, 5).map((dest) => (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() =>
                      updateSearch({
                        destinationSlug: dest.slug,
                        destinationName: dest.name,
                      })
                    }
                    onMouseEnter={() => setHoveredDest(dest.slug)}
                    onMouseLeave={() => setHoveredDest(null)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                      search.destinationSlug === dest.slug
                        ? "border-[#10b981] bg-[#10b981]/5 text-[#10b981]"
                        : "border-[#dddddd] text-[#222] hover:border-[#10b981] hover:text-[#10b981]"
                    }`}
                  >
                    {dest.name}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Live quote widget */}
        <section className="bg-[#fafafa] py-12 sm:py-16">
          <Reveal>
            <div className="mx-auto mb-8 max-w-5xl px-4 text-center sm:px-6">
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold text-[#222] sm:text-3xl">
                See your price in seconds
              </h2>
              <p className="mt-2 text-sm text-[#717171] sm:text-base">
                Pick a destination and dates above. We&apos;ll show a live price
                straight from our pricing engine — no forms, no callbacks.
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <LiveQuoteWidget
              search={search}
              quote={quote}
              loading={loading}
              error={error}
            />
          </Reveal>
        </section>

        {/* Popular homes */}
        <Reveal>
          <PopularHomesRow location="Naran" listings={naranListings} />
        </Reveal>
        <Reveal>
          <PopularHomesRow location="Hunza" listings={hunzaListings} />
        </Reveal>
        <Reveal>
          <PopularHomesRow location="Skurdu" listings={skurduListings} />
        </Reveal>

        {/* Destination highlights */}
        <Reveal>
          <DestinationHighlights />
        </Reveal>
      </main>

      <Footer />
    </>
  );
}