import { Award, Flame, Mountain, Sofa, Trees, Users } from "lucide-react";
import type { Listing, ListingHighlight } from "@/components/home/PopularHomesRow";
import { destinationImages } from "@/lib/destinationImages";

const HOST_NAMES = [
  "Ayesha", "Bilal", "Sana", "Hamza", "Mahnoor", "Usman",
  "Zara", "Fahad", "Iqra", "Ali", "Noor", "Kamran",
];

// A small rotating pool of highlight cards — enough variety that listings
// don't all look identical, without hand-writing dozens of one-off blurbs.
const HIGHLIGHT_POOL: ListingHighlight[] = [
  { icon: Award, title: "Top-rated stay", description: "Ranked highly for cleanliness, accuracy, and communication." },
  { icon: Mountain, title: "Mountain views", description: "Wake up to panoramic views of the surrounding peaks." },
  { icon: Flame, title: "Cozy fireplace", description: "Stay warm on cool mountain nights by the fire." },
  { icon: Trees, title: "Quiet, natural setting", description: "Tucked away from the crowds, close to nature." },
  { icon: Users, title: "Great for families", description: "Spacious rooms and a relaxed pace, ideal for groups." },
  { icon: Sofa, title: "Comfortable interiors", description: "Thoughtfully furnished for a relaxing stay." },
];

function rotate<T>(arr: T[], start: number): T[] {
  if (arr.length === 0) return arr;
  const s = start % arr.length;
  return [...arr.slice(s), ...arr.slice(0, s)];
}

type BaseListing = Pick<Listing, "id" | "title" | "price" | "nights" | "rating" | "guestFavorite">;

function withDetails(base: BaseListing, images: string[], location: string, index: number): Listing {
  return {
    ...base,
    images,
    location,
    guests: 2 + (index % 3),
    bedrooms: 1 + (index % 2),
    beds: 1 + (index % 2),
    baths: 1,
    hostName: HOST_NAMES[index % HOST_NAMES.length],
    hostSince: `${6 + (index % 18)} months hosting`,
    superhost: index % 2 === 0,
    reviewsCount: 18 + index * 7,
    highlights: [
      HIGHLIGHT_POOL[index % HIGHLIGHT_POOL.length],
      HIGHLIGHT_POOL[(index + 1) % HIGHLIGHT_POOL.length],
      HIGHLIGHT_POOL[(index + 2) % HIGHLIGHT_POOL.length],
    ],
  };
}

const naranBase: BaseListing[] = [
  { id: "n1", title: "Cottage in Naran", price: 4500, nights: 2, rating: 4.93, guestFavorite: true },
  { id: "n2", title: "Room in Naran", price: 2200, nights: 2, rating: 4.88, guestFavorite: true },
  { id: "n3", title: "Guest house in Kaghan", price: 3800, nights: 2, rating: 4.96, guestFavorite: true },
  { id: "n4", title: "Cabin near Saif ul Malook", price: 6000, nights: 2, rating: 4.92 },
  { id: "n5", title: "Homestay in Naran", price: 3000, nights: 2, rating: 4.93, guestFavorite: true },
  { id: "n6", title: "Cottage in Kaghan Valley", price: 5200, nights: 2, rating: 4.98, guestFavorite: true },
];

const hunzaBase: BaseListing[] = [
  { id: "h1", title: "Guest house in Hunza", price: 4000, nights: 2, rating: 4.95, guestFavorite: true },
  { id: "h2", title: "Room with Attabad view", price: 3500, nights: 2, rating: 4.90 },
  { id: "h3", title: "Cottage in Karimabad", price: 5500, nights: 2, rating: 4.97, guestFavorite: true },
  { id: "h4", title: "Homestay near Baltit Fort", price: 2800, nights: 2, rating: 4.89, guestFavorite: true },
  { id: "h5", title: "Apartment in Hunza Valley", price: 4800, nights: 2, rating: 4.94 },
  { id: "h6", title: "Guest house in Gulmit", price: 3300, nights: 2, rating: 4.96, guestFavorite: true },
];

const skurduBase: BaseListing[] = [
  { id: "s1", title: "Guest house in Skardu", price: 4000, nights: 2, rating: 4.95, guestFavorite: true },
  { id: "s2", title: "Room with Attabad view", price: 3500, nights: 2, rating: 4.90 },
  { id: "s3", title: "Cottage in Karimabad", price: 5500, nights: 2, rating: 4.97, guestFavorite: true },
  { id: "s4", title: "Homestay near Baltit Fort", price: 2800, nights: 2, rating: 4.89, guestFavorite: true },
  { id: "s5", title: "Apartment in Skardu Valley", price: 4800, nights: 2, rating: 4.94 },
  { id: "s6", title: "Guest house in Gulmit", price: 3300, nights: 2, rating: 4.96, guestFavorite: true },
];

export const naranListings: Listing[] = naranBase.map((base, i) =>
  withDetails(base, rotate(destinationImages.naran, i), "Naran, Khyber Pakhtunkhwa", i)
);

export const hunzaListings: Listing[] = hunzaBase.map((base, i) =>
  withDetails(base, rotate(destinationImages.hunza, i), "Hunza, Gilgit-Baltistan", i + naranBase.length)
);

export const skurduListings: Listing[] = skurduBase.map((base, i) =>
  withDetails(base, rotate(destinationImages.hunza, i), "Skardu, Gilgit-Baltistan", i + naranBase.length)
);

export const ALL_LISTINGS: Listing[] = [...naranListings, ...hunzaListings];

export function getListingById(id: string): Listing | undefined {
  return ALL_LISTINGS.find((l) => l.id === id);
}
