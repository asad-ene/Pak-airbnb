/**
 * MOCK HOST AUTH — localStorage-backed, for local development only.
 *
 * There is no real backend behind this yet. Credentials are stored
 * in plain text in the browser's localStorage, which is fine for
 * building out the UI but is NOT secure and must not ship as-is.
 *
 * To swap in a real backend later: replace the bodies of `signupHost`,
 * `loginHost`, `logoutHost`, and `getSession` with calls to your API
 * (or NextAuth / Supabase Auth / etc). The function signatures below
 * are the contract the rest of the app (useHostAuth, login/signup
 * pages) relies on — keep them the same and nothing else has to change.
 */

export type Host = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type StoredHost = Host & { password: string };

type AuthResult =
  | { ok: true; host: Host }
  | { ok: false; error: string };

const HOSTS_KEY = "pak-airbnb:hosts";
const SESSION_KEY = "pak-airbnb:host-session";

function isBrowser() {
  return typeof window !== "undefined";
}

function readHosts(): StoredHost[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(HOSTS_KEY);
    return raw ? (JSON.parse(raw) as StoredHost[]) : [];
  } catch {
    return [];
  }
}

function writeHosts(hosts: StoredHost[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(HOSTS_KEY, JSON.stringify(hosts));
}

function toPublicHost(host: StoredHost): Host {
  const { password, ...publicHost } = host;
  return publicHost;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function signupHost(input: {
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

  const hosts = readHosts();
  if (hosts.some((h) => h.email === email)) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const newHost: StoredHost = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  writeHosts([...hosts, newHost]);
  setSession(newHost.id, remember);

  return { ok: true, host: toPublicHost(newHost) };
}

export function loginHost(input: { email: string; password: string; remember?: boolean }): AuthResult {
  const email = input.email.trim().toLowerCase();
  const hosts = readHosts();
  const match = hosts.find((h) => h.email === email);

  if (!match || match.password !== input.password) {
    return { ok: false, error: "Incorrect email or password." };
  }

  setSession(match.id, input.remember ?? true);
  return { ok: true, host: toPublicHost(match) };
}

export function logoutHost() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SESSION_KEY);
  window.sessionStorage.removeItem(SESSION_KEY);
}

function setSession(hostId: string, remember = true) {
  if (!isBrowser()) return;
  if (remember) {
    window.localStorage.setItem(SESSION_KEY, hostId);
    window.sessionStorage.removeItem(SESSION_KEY);
  } else {
    window.sessionStorage.setItem(SESSION_KEY, hostId);
    window.localStorage.removeItem(SESSION_KEY);
  }
}

function readSessionId(): string | null {
  if (!isBrowser()) return null;
  return window.sessionStorage.getItem(SESSION_KEY) ?? window.localStorage.getItem(SESSION_KEY);
}

export function getSession(): Host | null {
  if (!isBrowser()) return null;
  const hostId = readSessionId();
  if (!hostId) return null;

  const hosts = readHosts();
  const match = hosts.find((h) => h.id === hostId);
  return match ? toPublicHost(match) : null;
}
