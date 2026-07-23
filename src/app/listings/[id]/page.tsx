"use client";

import {
  ArrowLeft,
  Award,
  Flag,
  Images,
  Star,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Reveal } from "@/components/ui/Reveal";
import { ReservationModal } from "@/components/listing/ReservationModal";
import { useGuestAuth } from "@/hooks/useGuestAuth";
import { getListingById } from "@/lib/listings";
import {
  clearPendingReservation,
  getPendingReservation,
  setPendingReservation,
} from "@/lib/reservations";

type PageProps = {
  params: Promise<{ id: string }>;
};

function cycleImages(images: string[], count: number): string[] {
  if (images.length === 0) return [];
  return Array.from({ length: count }, (_, i) => images[i % images.length]);
}

export default function ListingDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const listing = getListingById(id);
  const { guest, ready } = useGuestAuth();

  // All hooks stay above the "listing not found" early return so hook order
  // never changes between renders.
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [dateError, setDateError] = useState<string | null>(null);
  const [reservationOpen, setReservationOpen] = useState(false);

  // If the guest was sent to /login mid-reservation, restore their picks
  // and jump straight into the review step once they're back and logged in.
  useEffect(() => {
    if (!ready || !guest || !listing) return;
    const pending = getPendingReservation();
    if (pending && pending.listingId === listing.id) {
      setCheckIn(pending.checkIn);
      setCheckOut(pending.checkOut);
      setGuestCount(pending.guests);
      clearPendingReservation();
      setReservationOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, guest, listing?.id]);

  if (!listing) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
          <p className="text-xl font-semibold text-[#222]">
            We couldn&apos;t find that listing
          </p>
          <p className="mt-2 text-sm text-[#717171]">
            It may have been removed, or the link might be incorrect.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-[#10b981] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0ea371]"
          >
            Back to homepage
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const galleryImages = cycleImages(listing.images, 5);
  const allImages = cycleImages(listing.images, 8);
  const guests = listing.guests ?? 2; // room capacity, distinct from guestCount (the picked count)
  const bedrooms = listing.bedrooms ?? 1;
  const beds = listing.beds ?? 1;
  const baths = listing.baths ?? 1;

  function handleReserveClick() {
    setDateError(null);

    if (!checkIn || !checkOut) {
      setDateError("Please select your check-in and checkout dates.");
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setDateError("Checkout must be after check-in.");
      return;
    }
    if (!ready) return;

    if (!guest) {
      setPendingReservation({
        listingId: listing!.id,
        checkIn,
        checkOut,
        guests: guestCount,
      });
      router.push(`/login?redirect=${encodeURIComponent(`/listings/${listing!.id}`)}`);
      return;
    }

    setReservationOpen(true);
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-1.5 text-sm font-medium text-[#222] transition hover:text-[#10b981]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Photo gallery */}
        <Reveal>
          {!showAllPhotos ? (
            <div className="grid h-[280px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl sm:h-[420px]">
              <div className="relative col-span-2 row-span-2">
                <Image
                  src={galleryImages[0]}
                  alt={listing.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {galleryImages.slice(1).map((img, i, arr) => (
                <div key={i} className="relative">
                  <Image
                    src={img}
                    alt={listing.title}
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                  {i === arr.length - 1 && (
                    <button
                      type="button"
                      onClick={() => setShowAllPhotos(true)}
                      className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#222] shadow-md transition hover:bg-[#f5f5f5]"
                    >
                      <Images className="h-3.5 w-3.5" />
                      Show all photos
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => setShowAllPhotos(false)}
                className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-[#222] underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to overview
              </button>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {allImages.map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <Image src={img} alt={listing.title} fill sizes="33vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Reveal>

        {/* Title + meta */}
        <Reveal delay={80}>
          <div className="mt-6 border-b border-[#eeeeee] pb-6">
            <h1 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold text-[#222] sm:text-3xl">
              {listing.title}
            </h1>
            <p className="mt-1 text-[#717171]">{listing.location}</p>
            <p className="mt-2 text-sm text-[#717171]">
              {guests} guest{guests !== 1 ? "s" : ""} · {bedrooms} bedroom
              {bedrooms !== 1 ? "s" : ""} · {beds} bed{beds !== 1 ? "s" : ""} ·{" "}
              {baths} bath{baths !== 1 ? "s" : ""}
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {listing.guestFavorite && (
              <Reveal delay={120}>
                <div className="flex flex-col gap-4 rounded-2xl border border-[#dddddd] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="h-8 w-8 flex-shrink-0 text-[#222]" />
                    <div>
                      <p className="text-sm font-semibold text-[#222]">Guest favorite</p>
                      <p className="text-xs text-[#717171]">
                        One of the most loved homes on PakStays, according to guests
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 font-semibold text-[#222]">
                      <Star className="h-3.5 w-3.5 fill-[#222] text-[#222]" />
                      {listing.rating.toFixed(2)}
                    </span>
                    <span className="h-8 w-px bg-[#dddddd]" />
                    <span className="font-semibold text-[#222] underline">
                      {listing.reviewsCount} reviews
                    </span>
                  </div>
                </div>
              </Reveal>
            )}

            <Reveal delay={160}>
              <div className="flex items-center gap-4 border-b border-[#eeeeee] pb-6">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#10b981]/10 text-lg font-semibold text-[#10b981]">
                  {listing.hostName?.[0] ?? "H"}
                </div>
                <div>
                  <p className="font-semibold text-[#222]">Hosted by {listing.hostName}</p>
                  <p className="text-sm text-[#717171]">
                    {listing.superhost ? "Superhost · " : ""}
                    {listing.hostSince}
                  </p>
                </div>
              </div>
            </Reveal>

            {listing.highlights && (
              <Reveal delay={200}>
                <div className="space-y-5">
                  {listing.highlights.map((h) => {
                    const Icon = h.icon;
                    return (
                      <div key={h.title} className="flex items-start gap-4">
                        <Icon className="mt-0.5 h-6 w-6 flex-shrink-0 text-[#222]" />
                        <div>
                          <p className="text-sm font-semibold text-[#222]">{h.title}</p>
                          <p className="text-sm text-[#717171]">{h.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            )}
          </div>

          {/* Booking card */}
          <div>
            <Reveal delay={120}>
              <div className="lg:sticky lg:top-24">
                <div className="rounded-2xl border border-[#dddddd] p-6 shadow-lg">
                  <div className="mb-4 flex w-fit items-center gap-1.5 rounded-full border border-[#dddddd] px-3 py-1.5 text-xs font-medium text-[#222]">
                    <Tag className="h-3.5 w-3.5" />
                    Prices include all fees
                  </div>

                  <p className="text-2xl font-semibold text-[#222]">
                    Rs {listing.price.toLocaleString("en-PK")}
                    <span className="text-base font-normal text-[#717171]">
                      {" "}
                      for {listing.nights} night{listing.nights !== 1 ? "s" : ""}
                    </span>
                  </p>

                  <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-xl border border-[#dddddd] text-sm">
                    <div className="border-r border-[#dddddd] p-3">
                      <label
                        htmlFor="checkin"
                        className="block text-[10px] font-semibold uppercase tracking-wide text-[#717171]"
                      >
                        Check-in
                      </label>
                      <input
                        id="checkin"
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="mt-0.5 w-full bg-transparent text-sm text-[#222] outline-none"
                      />
                    </div>
                    <div className="p-3">
                      <label
                        htmlFor="checkout"
                        className="block text-[10px] font-semibold uppercase tracking-wide text-[#717171]"
                      >
                        Checkout
                      </label>
                      <input
                        id="checkout"
                        type="date"
                        value={checkOut}
                        min={checkIn || undefined}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="mt-0.5 w-full bg-transparent text-sm text-[#222] outline-none"
                      />
                    </div>
                    <div className="col-span-2 flex items-center justify-between border-t border-[#dddddd] p-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#717171]">
                          Guests
                        </p>
                        <p className="mt-0.5 text-[#222]">
                          {guestCount} guest{guestCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                          disabled={guestCount <= 1}
                          aria-label="Decrease guests"
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-[#dddddd] text-[#222] transition hover:border-[#222] disabled:opacity-30"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          onClick={() => setGuestCount((g) => Math.min(guests, g + 1))}
                          disabled={guestCount >= guests}
                          aria-label="Increase guests"
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-[#dddddd] text-[#222] transition hover:border-[#222] disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {dateError && (
                    <p role="alert" className="mt-2 text-xs text-red-600">
                      {dateError}
                    </p>
                  )}

                  <p className="mt-3 text-xs text-[#717171]">
                    Free cancellation up to 5 days before check-in.
                  </p>

                  <button
                    type="button"
                    onClick={handleReserveClick}
                    className="mt-4 w-full rounded-full bg-[#10b981] py-3 text-sm font-semibold text-white transition hover:bg-[#0ea371]"
                  >
                    Reserve
                  </button>

                  <p className="mt-2 text-center text-xs text-[#717171]">
                    You won&apos;t be charged yet
                  </p>
                  <p className="mt-1 text-center text-[11px] italic text-[#717171]">
                    Reservations are saved on this device for now — payments aren&apos;t
                    connected to a real processor yet.
                  </p>
                </div>

                <a
                  href={`mailto:pakstay@cort.com?subject=${encodeURIComponent(
                    `Reporting listing: ${listing.title}`
                  )}`}
                  className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[#717171] underline transition hover:text-[#222]"
                >
                  <Flag className="h-3 w-3" />
                  Report this listing
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </main>

      <ReservationModal
        isOpen={reservationOpen}
        onClose={() => setReservationOpen(false)}
        listing={listing}
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guestCount}
        onDatesChange={(ci, co) => {
          setCheckIn(ci);
          setCheckOut(co);
        }}
        onGuestsChange={setGuestCount}
      />

      <Footer />
    </>
  );
}
