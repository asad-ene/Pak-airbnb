"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type Host,
  getSession,
  loginHost,
  logoutHost,
  signupHost,
} from "@/lib/hostAuth";

export function useHostAuth() {
  const [host, setHost] = useState<Host | null>(null);
  // `ready` flips true once we've checked localStorage on the client.
  // Gate any redirect/auth-check logic on this to avoid a flash of
  // "logged out" state during server render / first paint.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setHost(getSession());
    setReady(true);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const result = loginHost({ email, password });
    if (result.ok) setHost(result.host);
    return result;
  }, []);

  const signup = useCallback((name: string, email: string, password: string) => {
    const result = signupHost({ name, email, password });
    if (result.ok) setHost(result.host);
    return result;
  }, []);

  const logout = useCallback(() => {
    logoutHost();
    setHost(null);
  }, []);

  return { host, ready, login, signup, logout };
}
