// ReservationModal.tsx - The reservation flow once a logged-in guest clicks
// "Reserve": review & edit trip details -> choose a payment method (mockup,
// no real charge) -> confirmation. Dates/guests stay editable right up until
// the final "Confirm reservation" button.
"use client";

import { useEffect, useState } from "react";
import {
  Banknote,
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  Smartphone,
  X,
} from "lucide-react";
import Link from "next/link";
import type { Listing } from "@/components/home/PopularHomesRow";
import {
  saveReservation,
  type PaymentMethod,
  type Reservation,
} from "@/lib/reservations";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing;
  checkIn: string;
  checkOut: string;
  guests: number;
  onDatesChange: (checkIn: string, checkOut: string) => void;
  onGuestsChange: (guests: number) => void;
}

type Step = "review" | "payment" | "success";

function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const diff = Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return diff > 0 ? diff : 0;
}

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: typeof CreditCard }[] = [
  { id: "card", label: "Credit / Debit card", icon: CreditCard },
  { id: "jazzcash", label: "JazzCash", icon: Smartphone },
  { id: "easypaisa", label: "Easypaisa", icon: Smartphone },
  { id: "cash", label: "Cash on arrival", icon: Banknote },
];

export function ReservationModal({
  isOpen,
  onClose,
  listing,
  checkIn,
  checkOut,
  guests,
  onDatesChange,
  onGuestsChange,
}: ReservationModalProps) {
  const [step, setStep] = useState<Step>("review");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [confirmed, setConfirmed] = useState<Reservation | null>(null);

  // Reset to the first step every time the modal is (re)opened
  useEffect(() => {
    if (isOpen) {
      setStep("review");
      setConfirmed(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const nights = nightsBetween(checkIn, checkOut);
  const pricePerNight =
    listing.nights > 0 ? Math.round(listing.price / listing.nights) : listing.price;
  const subtotal = pricePerNight * nights;
  const serviceFee = Math.round(subtotal * 0.08);
  const total = subtotal + serviceFee;
  const capacity = listing.guests ?? 2;
  const datesValid = nights > 0;

  function handleConfirm() {
    const reservation: Reservation = {
      id: `res_${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: listing.images[0],
      location: listing.location,
      checkIn,
      checkOut,
      guests,
      nights,
      pricePerNight,
      serviceFee,
      total,
      paymentMethod,
      createdAt: new Date().toISOString(),
    };
    saveReservation(reservation);
    setConfirmed(reservation);
    setStep("success");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 rounded-full p-1.5 text-[#717171] transition hover:bg-[#f7f7f7] hover:text-[#222]"
        >
          <X className="h-5 w-5" />
        </button>

        {step === "review" && (
          <>
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold text-[#222]">
              Review your trip
            </h2>

            <div className="mt-5 flex gap-3 border-b border-[#eeeeee] pb-5">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-[#eeeeee]">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#222]">{listing.title}</p>
                {listing.location && (
                  <p className="truncate text-xs text-[#717171]">{listing.location}</p>
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="modal-checkin"
                  className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#717171]"
                >
                  Check-in
                </label>
                <input
                  id="modal-checkin"
                  type="date"
                  value={checkIn}
                  onChange={(e) => onDatesChange(e.target.value, checkOut)}
                  className="w-full rounded-xl border border-[#dddddd] px-3 py-2 text-sm text-[#222] outline-none focus:border-[#10b981]"
                />
              </div>
              <div>
                <label
                  htmlFor="modal-checkout"
                  className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#717171]"
                >
                  Checkout
                </label>
                <input
                  id="modal-checkout"
                  type="date"
                  value={checkOut}
                  min={checkIn || undefined}
                  onChange={(e) => onDatesChange(checkIn, e.target.value)}
                  className="w-full rounded-xl border border-[#dddddd] px-3 py-2 text-sm text-[#222] outline-none focus:border-[#10b981]"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-[#dddddd] px-4 py-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#717171]">Guests</p>
                <p className="text-sm text-[#222]">
                  {guests} guest{guests !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onGuestsChange(Math.max(1, guests - 1))}
                  disabled={guests <= 1}
                  aria-label="Decrease guests"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dddddd] text-[#222] transition hover:border-[#222] disabled:opacity-30"
                >
                  −
                </button>
                <span className="w-4 text-center text-sm font-medium text-[#222]">{guests}</span>
                <button
                  type="button"
                  onClick={() => onGuestsChange(Math.min(capacity, guests + 1))}
                  disabled={guests >= capacity}
                  aria-label="Increase guests"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dddddd] text-[#222] transition hover:border-[#222] disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            {!datesValid ? (
              <p className="mt-4 text-sm text-red-600">
                Pick a check-in and checkout date to see your total.
              </p>
            ) : (
              <div className="mt-5 space-y-2 border-t border-[#eeeeee] pt-4 text-sm">
                <div className="flex justify-between text-[#717171]">
                  <span>
                    Rs {pricePerNight.toLocaleString("en-PK")} × {nights} night
                    {nights !== 1 ? "s" : ""}
                  </span>
                  <span>Rs {subtotal.toLocaleString("en-PK")}</span>
                </div>
                <div className="flex justify-between text-[#717171]">
                  <span>Service fee</span>
                  <span>Rs {serviceFee.toLocaleString("en-PK")}</span>
                </div>
                <div className="flex justify-between border-t border-[#eeeeee] pt-2 font-semibold text-[#222]">
                  <span>Total</span>
                  <span>Rs {total.toLocaleString("en-PK")}</span>
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={!datesValid}
              onClick={() => setStep("payment")}
              className="mt-6 w-full rounded-full bg-[#10b981] py-3 text-sm font-semibold text-white transition hover:bg-[#0ea371] disabled:opacity-40"
            >
              Continue to payment
            </button>
          </>
        )}

        {step === "payment" && (
          <>
            <button
              type="button"
              onClick={() => setStep("review")}
              className="mb-2 flex items-center gap-1 text-sm font-medium text-[#222] transition hover:text-[#10b981]"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold text-[#222]">
              Choose how to pay
            </h2>

            <div className="mt-5 space-y-2">
              {PAYMENT_OPTIONS.map((option) => {
                const Icon = option.icon;
                const selected = paymentMethod === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPaymentMethod(option.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                      selected
                        ? "border-[#10b981] bg-[#10b981]/5"
                        : "border-[#dddddd] hover:border-[#222]"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${selected ? "text-[#10b981]" : "text-[#717171]"}`} />
                    <span
                      className={`text-sm font-medium ${
                        selected ? "text-[#10b981]" : "text-[#222]"
                      }`}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {paymentMethod === "card" && (
              <div className="mt-4 space-y-3 rounded-xl border border-[#eeeeee] p-4">
                <input
                  type="text"
                  placeholder="Card number"
                  className="w-full rounded-xl border border-[#dddddd] px-3.5 py-2.5 text-sm text-[#222] outline-none focus:border-[#10b981]"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-full rounded-xl border border-[#dddddd] px-3.5 py-2.5 text-sm text-[#222] outline-none focus:border-[#10b981]"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="w-full rounded-xl border border-[#dddddd] px-3.5 py-2.5 text-sm text-[#222] outline-none focus:border-[#10b981]"
                  />
                </div>
              </div>
            )}

            <div className="mt-5 flex justify-between border-t border-[#eeeeee] pt-4 text-sm font-semibold text-[#222]">
              <span>Total due</span>
              <span>Rs {total.toLocaleString("en-PK")}</span>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="mt-5 w-full rounded-full bg-[#10b981] py-3 text-sm font-semibold text-white transition hover:bg-[#0ea371]"
            >
              Confirm reservation
            </button>
            <p className="mt-2 text-center text-[11px] italic text-[#717171]">
              Preview only — no real payment is processed yet.
            </p>
          </>
        )}

        {step === "success" && confirmed && (
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#10b981]/10">
              <CheckCircle2 className="h-7 w-7 text-[#10b981]" />
            </div>
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold text-[#222]">
              Reservation confirmed
            </h2>
            <p className="mt-1.5 text-sm text-[#717171]">
              {confirmed.nights} night{confirmed.nights !== 1 ? "s" : ""} at {listing.title}
            </p>
            <p className="mt-4 text-2xl font-semibold text-[#222]">
              Rs {confirmed.total.toLocaleString("en-PK")}
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/trips"
                className="w-full rounded-full bg-[#10b981] py-3 text-center text-sm font-semibold text-white transition hover:bg-[#0ea371]"
              >
                View your trips
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-full border border-[#dddddd] py-3 text-sm font-semibold text-[#222] transition hover:bg-[#f7f7f7]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
