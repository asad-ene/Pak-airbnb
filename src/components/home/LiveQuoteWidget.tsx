"use client";

import {
  ArrowRight,
  Calendar,
  Loader2,
  MapPin,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { QuoteResponse } from "@/lib/quote";
import { cn, formatPKR } from "@/lib/utils";
import { isSearchComplete, type SearchParams } from "@/types/search";

type LiveQuoteWidgetProps = {
  search: SearchParams;
  quote: QuoteResponse | null;
  loading: boolean;
  error: string | null;
};

function AnimatedPrice({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(value);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (display === value) return;

    setPulse(true);
    const start = display;
    const diff = value - start;
    const steps = 12;
    let step = 0;

    const interval = setInterval(() => {
      step += 1;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));

      if (step >= steps) {
        clearInterval(interval);
        setDisplay(value);
        setTimeout(() => setPulse(false), 300);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [value, display]);

  return (
    <span className={cn(pulse && "animate-count-pulse", className)}>
      {formatPKR(display)}
    </span>
  );
}

export function LiveQuoteWidget({
  search,
  quote,
  loading,
  error,
}: LiveQuoteWidgetProps) {
  const ready = isSearchComplete(search);

  return (
    <section className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-[#ebebeb] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-[#ebebeb] bg-[#fafafa] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#10b981]/10">
              <Zap className="h-4 w-4 text-[#10b981]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#222]">
                Live estimate
              </p>
              <p className="text-xs text-[#717171]">
                See your price in seconds — no calls, no waiting
              </p>
            </div>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-[#717171]">
              <Loader2 className="h-4 w-4 animate-spin" />
              Calculating...
            </div>
          )}
        </div>

        <div className="grid gap-0 md:grid-cols-[1fr_1.1fr]">
          {/* Left: current selection summary */}
          <div className="space-y-4 border-b border-[#ebebeb] p-6 md:border-b-0 md:border-r">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
              Your trip
            </p>

            {!ready ? (
              <div className="rounded-2xl border border-dashed border-[#dddddd] bg-[#fafafa] p-6 text-center">
                <Sparkles className="mx-auto h-8 w-8 text-[#dddddd]" />
                <p className="mt-3 text-sm font-medium text-[#222]">
                  Pick a destination to see your price
                </p>
                <p className="mt-1 text-xs text-[#717171]">
                  Select where, when, and how many guests above
                </p>
              </div>
            ) : (
              <div className="space-y-3 animate-fade-in-up">
                <div className="flex items-start gap-3 rounded-xl bg-[#f7f7f7] p-4">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#e63946]" />
                  <div>
                    <p className="text-sm font-semibold text-[#222]">
                      {search.destinationName}
                    </p>
                    <p className="text-xs text-[#717171]">Northern Pakistan</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-[#f7f7f7] p-4">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#e63946]" />
                  <div>
                    <p className="text-sm font-semibold text-[#222]">
                      {new Date(search.checkIn).toLocaleDateString("en-PK", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      →{" "}
                      {new Date(search.checkOut).toLocaleDateString("en-PK", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-[#717171]">
                      {quote ? `${quote.nights} night${quote.nights !== 1 ? "s" : ""}` : "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-[#f7f7f7] p-4">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#e63946]" />
                  <div>
                    <p className="text-sm font-semibold text-[#222]">
                      {search.guests} guest{search.guests !== 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-[#717171]">Adults & children</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: live price */}
          <div className="flex flex-col justify-between p-6">
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {!ready && !error && (
              <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                <p className="text-4xl font-bold tracking-tight text-[#ebebeb]">
                  PKR ———
                </p>
                <p className="mt-2 text-sm text-[#717171]">
                  Instant price appears here
                </p>
              </div>
            )}

            {ready && !quote && loading && (
              <div className="flex flex-1 flex-col items-center justify-center py-8">
                <div className="h-10 w-48 animate-pulse rounded-lg bg-[#f0f0f0]" />
                <div className="mt-4 h-4 w-32 animate-pulse rounded bg-[#f0f0f0]" />
              </div>
            )}

            {ready && quote && (
              <div className="animate-fade-in-up">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#717171]">
                  Estimated total
                </p>

                <div className="mt-2 flex flex-wrap items-end gap-x-2 gap-y-1">
                  <AnimatedPrice
                    value={quote.minTotal}
                    className="text-4xl font-bold tracking-tight text-[#222]"
                  />
                  {quote.minTotal !== quote.maxTotal && (
                    <>
                      <span className="pb-1 text-lg text-[#717171]">–</span>
                      <AnimatedPrice
                        value={quote.maxTotal}
                        className="pb-1 text-2xl font-bold text-[#717171]"
                      />
                    </>
                  )}
                </div>

                <p className="mt-1 text-sm text-[#717171]">
                  {formatPKR(quote.minPricePerNight)}
                  {quote.minPricePerNight !== quote.maxPricePerNight && (
                    <> – {formatPKR(quote.maxPricePerNight)}</>
                  )}{" "}
                  / night · incl. service fee
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#ebebeb] p-3">
                    <p className="text-xs text-[#717171]">Available stays</p>
                    <p className="mt-0.5 text-lg font-semibold text-[#222]">
                      {quote.availableCount}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#ebebeb] p-3">
                    <p className="text-xs text-[#717171]">Service fee</p>
                    <p className="mt-0.5 text-lg font-semibold text-[#222]">
                      {formatPKR(quote.serviceFee)}
                    </p>
                  </div>
                </div>

                {quote.sampleListing && (
                  <div className="mt-4 rounded-xl bg-[#f7f7f7] px-4 py-3">
                    <p className="text-xs text-[#717171]">From as low as</p>
                    <p className="text-sm font-semibold text-[#222]">
                      {quote.sampleListing.title}
                    </p>
                    <p className="text-xs text-[#717171]">
                      {formatPKR(quote.sampleListing.pricePerNight)}/night · ★{" "}
                      {quote.sampleListing.rating}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#222] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#000]"
                >
                  See {quote.availableCount} available stays
                  <ArrowRight className="h-4 w-4" />
                </button>

                <p className="mt-3 text-center text-xs text-[#717171]">
                  Price shown is estimated — final price confirmed at booking
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
