export type PropertyType =
  | "guest-house"
  | "cottage"
  | "homestay"
  | "hotel"
  | "camp";

export type Destination = {
  id: string;
  name: string;
  slug: string;
  region: string;
  minPrice: number;
  maxPrice: number;
  listingCount: number;
  tagline: string;
};

export type Listing = {
  id: string;
  title: string;
  destinationId: string;
  type: PropertyType;
  pricePerNight: number;
  maxGuests: number;
  rating: number;
  reviewCount: number;
};

export const DESTINATIONS: Destination[] = [
  {
    id: "naran",
    name: "Naran",
    slug: "naran",
    region: "Kaghan Valley",
    minPrice: 4500,
    maxPrice: 15000,
    listingCount: 42,
    tagline: "Gateway to Lake Saif ul Malook",
  },
  {
    id: "kaghan",
    name: "Kaghan",
    slug: "kaghan",
    region: "Kaghan Valley",
    minPrice: 4000,
    maxPrice: 12000,
    listingCount: 28,
    tagline: "Valley views and riverside stays",
  },
  {
    id: "hunza",
    name: "Hunza",
    slug: "hunza",
    region: "Gilgit-Baltistan",
    minPrice: 5500,
    maxPrice: 18000,
    listingCount: 56,
    tagline: "Passu Cones, forts, and Attabad Lake",
  },
  {
    id: "skardu",
    name: "Skardu",
    slug: "skardu",
    region: "Gilgit-Baltistan",
    minPrice: 5000,
    maxPrice: 20000,
    listingCount: 38,
    tagline: "Deosai, Shangrila, and mountain lakes",
  },
  {
    id: "khunjerab",
    name: "Khunjerab / Sost",
    slug: "khunjerab",
    region: "China Border",
    minPrice: 6000,
    maxPrice: 14000,
    listingCount: 14,
    tagline: "High-altitude stays near the border",
  },
  {
    id: "swat",
    name: "Swat & Kalam",
    slug: "swat",
    region: "Khyber Pakhtunkhwa",
    minPrice: 3500,
    maxPrice: 11000,
    listingCount: 31,
    tagline: "Green valleys and Malam Jabba",
  },
  {
    id: "murree",
    name: "Murree & Galiyat",
    slug: "murree",
    region: "Punjab",
    minPrice: 3000,
    maxPrice: 9000,
    listingCount: 47,
    tagline: "Weekend escapes from Islamabad",
  },
];

export const LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Lake View Cottage",
    destinationId: "naran",
    type: "cottage",
    pricePerNight: 8500,
    maxGuests: 6,
    rating: 4.9,
    reviewCount: 124,
  },
  {
    id: "2",
    title: "Saif ul Malook Guest House",
    destinationId: "naran",
    type: "guest-house",
    pricePerNight: 5500,
    maxGuests: 4,
    rating: 4.7,
    reviewCount: 89,
  },
  {
    id: "3",
    title: "Passu Cones Homestay",
    destinationId: "hunza",
    type: "homestay",
    pricePerNight: 6000,
    maxGuests: 5,
    rating: 4.95,
    reviewCount: 201,
  },
  {
    id: "4",
    title: "Attabad Lake Resort",
    destinationId: "hunza",
    type: "hotel",
    pricePerNight: 12000,
    maxGuests: 4,
    rating: 4.8,
    reviewCount: 156,
  },
  {
    id: "5",
    title: "Deosai Plains Camp",
    destinationId: "skardu",
    type: "camp",
    pricePerNight: 7500,
    maxGuests: 8,
    rating: 4.85,
    reviewCount: 67,
  },
  {
    id: "6",
    title: "Khunjerab Border Lodge",
    destinationId: "khunjerab",
    type: "guest-house",
    pricePerNight: 7000,
    maxGuests: 4,
    rating: 4.6,
    reviewCount: 34,
  },
  {
    id: "7",
    title: "Kalam Riverside Cottage",
    destinationId: "swat",
    type: "cottage",
    pricePerNight: 4800,
    maxGuests: 6,
    rating: 4.75,
    reviewCount: 92,
  },
  {
    id: "8",
    title: "Nathia Gali Family Home",
    destinationId: "murree",
    type: "homestay",
    pricePerNight: 4200,
    maxGuests: 8,
    rating: 4.65,
    reviewCount: 118,
  },
  {
    id: "9",
    title: "Kaghan Valley Retreat",
    destinationId: "kaghan",
    type: "cottage",
    pricePerNight: 5200,
    maxGuests: 5,
    rating: 4.7,
    reviewCount: 73,
  },
  {
    id: "10",
    title: "Shangrila Resort View",
    destinationId: "skardu",
    type: "hotel",
    pricePerNight: 14500,
    maxGuests: 4,
    rating: 4.9,
    reviewCount: 188,
  },
];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}

export function getDestinationById(id: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.id === id);
}

export function searchDestinations(query: string): Destination[] {
  const q = query.trim().toLowerCase();
  if (!q) return DESTINATIONS;

  return DESTINATIONS.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.region.toLowerCase().includes(q) ||
      d.tagline.toLowerCase().includes(q)
  );
}
