"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { QuoteResponse } from "@/lib/quote";
import {
  defaultSearchParams,
  isSearchComplete,
  type SearchParams,
} from "@/types/search";

export function useLiveQuote() {
  const [search, setSearch] = useState<SearchParams>(defaultSearchParams);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const updateSearch = useCallback((patch: Partial<SearchParams>) => {
    setSearch((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    if (!isSearchComplete(search)) {
      setQuote(null);
      setError(null);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          destination: search.destinationSlug,
          checkIn: search.checkIn,
          checkOut: search.checkOut,
          guests: String(search.guests),
        });

        const res = await fetch(`/api/quote?${params}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Failed to get quote");
        }

        const data: QuoteResponse = await res.json();
        setQuote(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setQuote(null);
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [search]);

  return { search, updateSearch, quote, loading, error };
}
