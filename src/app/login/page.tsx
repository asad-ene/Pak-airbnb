"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { Reveal } from "@/components/ui/Reveal";
import { useGuestAuth } from "@/hooks/useGuestAuth";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const authError = searchParams.get("error");
  const { guest, ready, login, logout } = useGuestAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = login(email, password, remember);

    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    router.push(redirectTo);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#fafafa] px-4 py-14 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-md">
            <div className="rounded-3xl border border-[#eeeeee] bg-white p-8 shadow-sm">
              <h1 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold text-[#222]">
                Log in
              </h1>
              <p className="mt-1.5 text-sm text-[#717171]">
                Welcome back. Log in to book your next stay.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#222]">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#dddddd] px-3.5 py-2.5 text-sm text-[#222] outline-none transition focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#222]">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-[#dddddd] px-3.5 py-2.5 text-sm text-[#222] outline-none transition focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-[#dddddd] text-[#10b981] focus:ring-[#10b981]"
                  />
                  <label htmlFor="remember" className="text-sm text-[#717171]">
                    Keep me signed in
                  </label>
                </div>

                {(error || authError) && (
                  <p role="alert" className="text-sm text-red-600">
                    {error ?? authError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-[#10b981] py-2.5 text-sm font-semibold text-white transition hover:bg-[#0ea371] disabled:opacity-60"
                >
                  {submitting ? "Logging in…" : "Log in"}
                </button>
              </form>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={async () => {
                    setError(null);
                    const result = await signIn("google", {
                      redirect: false,
                      callbackUrl: redirectTo,
                    });

                    if (!result) {
                      // If redirect starts, signIn may return undefined.
                      return;
                    }

                    if (result.error) {
                      setError(result.error);
                      return;
                    }

                    if (result.url) {
                      window.location.href = result.url;
                      return;
                    }

                    setError("Google sign-in failed.");
                  }}
                  className="w-full rounded-full border border-[#dddddd] bg-white py-2.5 text-sm font-semibold text-[#222] transition hover:border-[#10b981] hover:text-[#10b981]"
                >
                  Continue with Google
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-[#717171]">
                New here?{" "}
                <Link href="/signup" className="font-medium text-[#10b981] hover:underline">
                  Create an account
                </Link>
              </p>

              <p className="mt-2 text-center text-sm text-[#717171]">
                Want to list your place instead?{" "}
                <Link href="/host/signup" className="font-medium text-[#10b981] hover:underline">
                  Become a host
                </Link>
              </p>
            </div>
          </div>
        </Reveal>
      </main>
    </>
  );
}
