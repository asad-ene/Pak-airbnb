"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  type Guest,
  getGuestSession,
  loginGuest,
  logoutGuest,
  signupGuest,
} from "@/lib/guestAuth";

export function useGuestAuth() {
  const { data: session, status } = useSession();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user?.email) {
      setGuest({
        id: session.user.email,
        name: session.user.name ?? session.user.email,
        email: session.user.email,
        createdAt: new Date().toISOString(),
      });
    } else {
      setGuest(getGuestSession());
    }

    setReady(true);
  }, [session, status]);

  const login = useCallback((email: string, password: string, remember = true) => {
    const result = loginGuest({ email, password, remember });
    if (result.ok) setGuest(result.guest);
    return result;
  }, []);

  const signup = useCallback((name: string, email: string, password: string, remember = true) => {
    const result = signupGuest({ name, email, password, remember });
    if (result.ok) setGuest(result.guest);
    return result;
  }, []);

  const logout = useCallback(() => {
    logoutGuest();
    setGuest(null);
  }, []);

  return { guest, ready, login, signup, logout };
}
