"use client";

import { CalendarDays, MapPin, Users, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Reveal } from "@/components/ui/Reveal";
import { getReservations, type Reservation } from "@/lib/reservations";

const PAYMENT_LABELS: Record<Reservation["paymentMethod"], string> = {
  card: "Credit/Debit card",
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
  cash: "Cash on arrival",
};

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-PK", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TripsPage() {
  // Starts null (not []) so we don't flash an empty state before reading
  // localStorage on mount.
  const [reservations, setReservations] = useState<Reservation[] | null>(null);

  useEffect(() => {
    setReservations(getReservations());
  }, []);

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-[60vh] max-w-4xl px-4 py-10 sm:px-6">
        <Reveal>
          <h1 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold text-[#222] sm:text-3xl">
            Your trips
          </h1>
          <p className="mt-1.5 text-sm text-[#717171]">
            A quick look back at everything you&apos;ve reserved.
          </p>
        </Reveal>

        {reservations === null ? null : reservations.length === 0 ? (
          <Reveal delay={100}>
            <div className="mt-10 rounded-2xl border border-dashed border-[#dddddd] p-10 text-center">
              <p className="text-sm font-medium text-[#222]">No reservations yet</p>
              <p className="mt-1 text-sm text-[#717171]">
                Once you reserve a stay, it&apos;ll show up here.
              </p>
              <Link
                href="/"
                className="mt-4 inline-block rounded-full bg-[#10b981] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0ea371]"
              >
                Start exploring
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="mt-8 space-y-4">
            {reservations.map((r, i) => (
              <Reveal key={r.id} delay={i * 60}>
                <Link
                  href={`/listings/${r.listingId}`}
                  className="flex gap-4 rounded-2xl border border-[#eeeeee] p-4 transition hover:shadow-md"
                >
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-[#eeeeee] sm:h-28 sm:w-28">
                    <Image
                      src={r.listingImage}
                      alt={r.listingTitle}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-[#222]">{r.listingTitle}</p>
                    {r.location && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-[#717171]">
                        <MapPin className="h-3 w-3" /> {r.location}
                      </p>
                    )}
                    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#717171]">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(r.checkIn)} – {formatDate(r.checkOut)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {r.guests} guest{r.guests !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Wallet className="h-3.5 w-3.5" />
                        {PAYMENT_LABELS[r.paymentMethod]}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 flex-col items-end justify-center">
                    <p className="font-semibold text-[#222]">
                      Rs {r.total.toLocaleString("en-PK")}
                    </p>
                    <p className="text-xs text-[#717171]">
                      {r.nights} night{r.nights !== 1 ? "s" : ""}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
