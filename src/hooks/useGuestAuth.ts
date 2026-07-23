"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type Guest,
  getGuestSession,
  loginGuest,
  logoutGuest,
  signupGuest,
} from "@/lib/guestAuth";

export function useGuestAuth() {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setGuest(getGuestSession());
    setReady(true);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const result = loginGuest({ email, password });
    if (result.ok) setGuest(result.guest);
    return result;
  }, []);

  const signup = useCallback((name: string, email: string, password: string) => {
    const result = signupGuest({ name, email, password });
    if (result.ok) setGuest(result.guest);
    return result;
  }, []);

  const logout = useCallback(() => {
    logoutGuest();
    setGuest(null);
  }, []);

  return { guest, ready, login, signup, logout };
}
