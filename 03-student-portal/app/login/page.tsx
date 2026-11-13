"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const expired = useSearchParams().get("expired");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      await login(String(form.get("email")), String(form.get("password")));
    } catch {
      setError("Wrong email or password");
    } finally {
      // Next.js keeps this page alive after we leave it, so reset it either way.
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-3 rounded-lg bg-white p-6 shadow">
      <h1 className="text-xl font-semibold">Log in</h1>
      {expired && <p className="rounded bg-amber-100 p-2 text-sm">Your session expired. Please log in again.</p>}
      <input name="email" defaultValue="ahmed@giu-uni.de" className="w-full rounded border p-2" />
      <input name="password" type="password" defaultValue="student123" className="w-full rounded border p-2" />
      <button disabled={busy} className="w-full rounded bg-blue-600 p-2 text-white disabled:opacity-50">
        {busy ? "Logging in..." : "Log in"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
