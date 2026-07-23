import { NextRequest, NextResponse } from "next/server";
import { getDestinationBySlug } from "@/lib/destinations";
import { calculateQuote, parseQuoteRequest, type QuoteRequest } from "@/lib/quote";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const destinationSlug = searchParams.get("destination") ?? "";
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const guests = Number(searchParams.get("guests") ?? "2");

  const destination = getDestinationBySlug(destinationSlug);
  if (!destination) {
    return NextResponse.json({ error: "Destination not found" }, { status: 404 });
  }

  const parsed = parseQuoteRequest({ destinationSlug, checkIn, checkOut, guests });
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const quote = calculateQuote(
    destination,
    parsed.checkIn,
    parsed.checkOut,
    parsed.guests
  );

  if (!quote) {
    return NextResponse.json({ error: "Invalid stay duration" }, { status: 400 });
  }

  // Simulate brief pricing engine delay for live feel
  await new Promise((r) => setTimeout(r, 300));

  return NextResponse.json(quote);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as QuoteRequest;
  const destination = getDestinationBySlug(body.destinationSlug);

  if (!destination) {
    return NextResponse.json({ error: "Destination not found" }, { status: 404 });
  }

  const parsed = parseQuoteRequest(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const quote = calculateQuote(
    destination,
    parsed.checkIn,
    parsed.checkOut,
    parsed.guests
  );

  if (!quote) {
    return NextResponse.json({ error: "Invalid stay duration" }, { status: 400 });
  }

  await new Promise((r) => setTimeout(r, 300));

  return NextResponse.json(quote);
}
