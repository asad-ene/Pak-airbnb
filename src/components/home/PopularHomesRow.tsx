"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

export type ListingHighlight = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type Listing = {
  id: string;
  title: string;
  price: number;
  nights: number;
  rating: number;
  guestFavorite?: boolean;
  images: string[]; // at least one image URL/path; first is used as the cover photo

  // Optional richer fields, used on the /listings/[id] detail page once present.
  location?: string;
  guests?: number;
  bedrooms?: number;
  beds?: number;
  baths?: number;
  hostName?: string;
  hostSince?: string;
  superhost?: boolean;
  reviewsCount?: number;
  highlights?: ListingHighlight[];
};

type PopularHomesRowProps = {
  location: string;
  listings: Listing[];
  className?: string;
};

export function PopularHomesRow({
  location,
  listings,
  className,
}: PopularHomesRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }

  function scroll(direction: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 16 : 280;
    el.scrollBy({ left: direction * step * 2, behavior: "smooth" });
  }

  return (
    <section className={cn("mx-auto max-w-7xl px-4 py-8 sm:px-6", className)}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-[#222] sm:text-2xl">
            Popular homes in {location}
          </h3>
          <button
            type="button"
            aria-label={`See all homes in ${location}`}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#dddddd] text-[#222] transition hover:border-[#222]"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            aria-label="Scroll left"
            disabled={atStart}
            onClick={() => scroll(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dddddd] text-[#222] shadow-sm transition hover:shadow-md disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            disabled={atEnd}
            onClick={() => scroll(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dddddd] text-[#222] shadow-sm transition hover:shadow-md disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Card rail */}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {listings.map((listing, index) => (
          <Reveal
            key={listing.id}
            delay={index * 80}
            y={16}
            className="shrink-0 snap-start"
          >
            <Link
              href={`/listings/${listing.id}`}
              data-card
              className="group block w-[220px] sm:w-[250px]"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#eeeeee]">
                {/* Gradient shows instantly, image sits on top once loaded */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#e9e9e9] to-[#dcdcdc]" />

                <Image
                  src={listing.images[0]}
                  alt={listing.title}
                  fill
                  sizes="(max-width: 640px) 220px, 250px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {listing.guestFavorite && (
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-[#222] shadow-sm">
                    Guest favorite
                  </span>
                )}

                <button
                  type="button"
                  aria-label="Save listing"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center text-white transition hover:scale-110"
                >
                  <Heart className="h-5 w-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]" />
                </button>
              </div>

              <div className="mt-2.5 space-y-0.5">
                <p className="truncate text-[15px] font-medium text-[#222]">
                  {listing.title}
                </p>
                <p className="flex items-center gap-1 text-sm text-[#717171]">
                  <span>
                    Rs {listing.price.toLocaleString("en-PK")} for {listing.nights} night
                    {listing.nights !== 1 ? "s" : ""}
                  </span>
                  <span aria-hidden>·</span>
                  <Star className="h-3 w-3 fill-[#222] text-[#222]" />
                  <span>{listing.rating.toFixed(2)}</span>
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
