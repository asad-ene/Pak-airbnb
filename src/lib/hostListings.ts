/**
 * MOCK HOST LISTINGS STORE — localStorage-backed, for local development only.
 * Same caveat as hostAuth.ts: swap these functions for real API calls
 * once a backend exists. Signatures are the contract the dashboard relies on.
 */

export type HostListing = {
  id: string;
  hostId: string;
  title: string;
  location: string;
  price: number;
  image: string;
  status: "draft" | "published";
  createdAt: string;
};

export type HostListingInput = {
  title: string;
  location: string;
  price: number;
  image: string;
  publishImmediately: boolean;
};

const LISTINGS_KEY = "pak-airbnb:host-listings";

function isBrowser() {
  return typeof window !== "undefined";
}

function readAll(): HostListing[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(LISTINGS_KEY);
    return raw ? (JSON.parse(raw) as HostListing[]) : [];
  } catch {
    return [];
  }
}

function writeAll(listings: HostListing[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
}

export function getListingsForHost(hostId: string): HostListing[] {
  return readAll()
    .filter((l) => l.hostId === hostId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addListing(hostId: string, input: HostListingInput): HostListing {
  const listing: HostListing = {
    id: crypto.randomUUID(),
    hostId,
    title: input.title.trim(),
    location: input.location.trim(),
    price: input.price,
    image: input.image.trim(),
    status: input.publishImmediately ? "published" : "draft",
    createdAt: new Date().toISOString(),
  };

  writeAll([...readAll(), listing]);
  return listing;
}

export function updateListing(
  id: string,
  patch: Partial<Omit<HostListing, "id" | "hostId" | "createdAt">>
): void {
  writeAll(readAll().map((l) => (l.id === id ? { ...l, ...patch } : l)));
}

export function deleteListing(id: string): void {
  writeAll(readAll().filter((l) => l.id !== id));
}

export function toggleListingStatus(id: string): void {
  writeAll(
    readAll().map((l) =>
      l.id === id
        ? { ...l, status: l.status === "published" ? "draft" : "published" }
        : l
    )
  );
}
