// reservations.ts - Client-side reservation storage.
// No backend yet, so reservations and in-progress ("pending") reservations
// are persisted to localStorage. When a real API exists, only the functions
// in this file need to change — nothing in the components that call them.

export type PaymentMethod = "card" | "jazzcash" | "easypaisa" | "cash";

export type Reservation = {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  location?: string;
  checkIn: string; // ISO date, e.g. "2026-07-30"
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  serviceFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: string; // ISO timestamp
};

export type PendingReservation = {
  listingId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
};

const RESERVATIONS_KEY = "pakstays_reservations";
const PENDING_KEY = "pakstays_pending_reservation";

export function getReservations(): Reservation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RESERVATIONS_KEY);
    return raw ? (JSON.parse(raw) as Reservation[]) : [];
  } catch {
    return [];
  }
}

export function saveReservation(reservation: Reservation): void {
  if (typeof window === "undefined") return;
  const updated = [reservation, ...getReservations()];
  window.localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(updated));
}

// "Pending" reservations hold the user's picks (dates/guests) across the
// redirect to /login, so they land back on the listing with everything
// exactly as they left it instead of starting over.
export function setPendingReservation(pending: PendingReservation): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
}

export function getPendingReservation(): PendingReservation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as PendingReservation) : null;
  } catch {
    return null;
  }
}

export function clearPendingReservation(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PENDING_KEY);
}
