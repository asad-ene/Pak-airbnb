/**
 * MOCK GUEST AUTH — localStorage-backed, for local development only.
 * Same caveats as src/lib/hostAuth.ts: no real backend yet, plain-text
 * storage, not secure. This is a SEPARATE store from hostAuth.ts —
 * a person can have a guest account and a host account with the same
 * email without collision, since they're stored under different keys.
 *
 * Swap the bodies of these four functions for real API calls once you
 * have a backend; keep the signatures the same and nothing else changes.
 */

export type Guest = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type StoredGuest = Guest & { password: string };

type AuthResult =
  | { ok: true; guest: Guest }
  | { ok: false; error: string };

const GUESTS_KEY = "pak-airbnb:guests";
const SESSION_KEY = "pak-airbnb:guest-session";

function isBrowser() {
  return typeof window !== "undefined";
}

function readGuests(): StoredGuest[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(GUESTS_KEY);
    return raw ? (JSON.parse(raw) as StoredGuest[]) : [];
  } catch {
    return [];
  }
}

function writeGuests(guests: StoredGuest[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(GUESTS_KEY, JSON.stringify(guests));
}

function toPublicGuest(guest: StoredGuest): Guest {
  const { password, ...publicGuest } = guest;
  return publicGuest;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function signupGuest(input: {
  name: string;
  email: string;
  password: string;
  remember?: boolean;
}): AuthResult {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const { password, remember = true } = input;

  if (!name) return { ok: false, error: "Enter your name." };
  if (!isValidEmail(email)) return { ok: false, error: "Enter a valid email address." };
  if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };

  const guests = readGuests();
  if (guests.some((g) => g.email === email)) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const newGuest: StoredGuest = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  writeGuests([...guests, newGuest]);
  setSession(newGuest.id, remember);

  return { ok: true, guest: toPublicGuest(newGuest) };
}

export function loginGuest(input: { email: string; password: string; remember?: boolean }): AuthResult {
  const email = input.email.trim().toLowerCase();
  const guests = readGuests();
  const match = guests.find((g) => g.email === email);

  if (!match || match.password !== input.password) {
    return { ok: false, error: "Incorrect email or password." };
  }

  setSession(match.id, input.remember ?? true);
  return { ok: true, guest: toPublicGuest(match) };
}

export function logoutGuest() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SESSION_KEY);
  window.sessionStorage.removeItem(SESSION_KEY);
}

function setSession(guestId: string, remember = true) {
  if (!isBrowser()) return;
  if (remember) {
    window.localStorage.setItem(SESSION_KEY, guestId);
    window.sessionStorage.removeItem(SESSION_KEY);
  } else {
    window.sessionStorage.setItem(SESSION_KEY, guestId);
    window.localStorage.removeItem(SESSION_KEY);
  }
}

function readSessionId(): string | null {
  if (!isBrowser()) return null;
  return window.sessionStorage.getItem(SESSION_KEY) ?? window.localStorage.getItem(SESSION_KEY);
}

export function getGuestSession(): Guest | null {
  if (!isBrowser()) return null;
  const guestId = readSessionId();
  if (!guestId) return null;

  const guests = readGuests();
  const match = guests.find((g) => g.id === guestId);
  return match ? toPublicGuest(match) : null;
}
