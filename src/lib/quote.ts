import { LISTINGS, type Destination } from "./destinations";
import { nightsBetween } from "./utils";

export type QuoteRequest = {
  destinationSlug: string;
  checkIn: string;
  checkOut: string;
  guests: number;
};

export type QuoteResponse = {
  destination: Destination;
  nights: number;
  minPricePerNight: number;
  maxPricePerNight: number;
  minTotal: number;
  maxTotal: number;
  serviceFee: number;
  availableCount: number;
  sampleListing?: {
    title: string;
    pricePerNight: number;
    rating: number;
  };
};

const SERVICE_FEE_RATE = 0.1;

export function calculateQuote(
  destination: Destination,
  checkIn: Date,
  checkOut: Date,
  guests: number
): QuoteResponse | null {
  const nights = nightsBetween(checkIn, checkOut);
  if (nights <= 0) return null;

  const matchingListings = LISTINGS.filter(
    (l) =>
      l.destinationId === destination.id &&
      l.maxGuests >= guests &&
      l.pricePerNight >= destination.minPrice * 0.8 &&
      l.pricePerNight <= destination.maxPrice * 1.2
  );

  const prices =
    matchingListings.length > 0
      ? matchingListings.map((l) => l.pricePerNight)
      : [destination.minPrice, destination.maxPrice];

  const minPricePerNight = Math.min(...prices);
  const maxPricePerNight = Math.max(...prices);

  const minSubtotal = minPricePerNight * nights;
  const maxSubtotal = maxPricePerNight * nights;
  const minServiceFee = Math.round(minSubtotal * SERVICE_FEE_RATE);
  const maxServiceFee = Math.round(maxSubtotal * SERVICE_FEE_RATE);

  const cheapest = matchingListings.sort(
    (a, b) => a.pricePerNight - b.pricePerNight
  )[0];

  return {
    destination,
    nights,
    minPricePerNight,
    maxPricePerNight,
    minTotal: minSubtotal + minServiceFee,
    maxTotal: maxSubtotal + maxServiceFee,
    serviceFee: minServiceFee,
    availableCount: Math.max(
      matchingListings.length,
      Math.floor(destination.listingCount * 0.6)
    ),
    sampleListing: cheapest
      ? {
          title: cheapest.title,
          pricePerNight: cheapest.pricePerNight,
          rating: cheapest.rating,
        }
      : undefined,
  };
}

export function parseQuoteRequest(body: QuoteRequest) {
  const checkIn = new Date(body.checkIn);
  const checkOut = new Date(body.checkOut);

  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
    return { error: "Invalid dates" as const };
  }

  if (checkOut <= checkIn) {
    return { error: "Check-out must be after check-in" as const };
  }

  const guests = Math.min(16, Math.max(1, body.guests || 1));

  return { checkIn, checkOut, guests };
}
