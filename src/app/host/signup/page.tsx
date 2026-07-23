"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { HostShell } from "@/components/host/HostShell";
import { useHostAuth } from "@/hooks/useHostAuth";

export default function HostSignupPage() {
  const router = useRouter();
  const { host, ready, signup } = useHostAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && host) router.replace("/host/dashboard");
  }, [ready, host, router]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    const result = signup(name, email, password);

    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    router.push("/host/dashboard");
  }

  return (
    <HostShell>
      <Reveal>
        <div className="mx-auto max-w-md">
          <div className="rounded-3xl border border-[#eeeeee] bg-white p-8 shadow-sm">
            <h1 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold text-[#222]">
              Become a host
            </h1>
            <p className="mt-1.5 text-sm text-[#717171]">
              Create an account to list your place and manage bookings.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-[#222]">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#dddddd] px-3.5 py-2.5 text-sm text-[#222] outline-none transition focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
                  placeholder="Ayesha Khan"
                />
              </div>

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
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#dddddd] px-3.5 py-2.5 text-sm text-[#222] outline-none transition focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-[#222]">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#dddddd] px-3.5 py-2.5 text-sm text-[#222] outline-none transition focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-[#10b981] py-2.5 text-sm font-semibold text-white transition hover:bg-[#0ea371] disabled:opacity-60"
              >
                {submitting ? "Creating account…" : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#717171]">
              Already a host?{" "}
              <Link href="/host/login" className="font-medium text-[#10b981] hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </Reveal>
    </HostShell>
  );
}
