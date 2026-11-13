import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import apiserver from "@/lib/api-server";
import type { User } from "@/lib/types";
import { CheckAgain } from "./check-again";

// Slide 013: a Server Component that checks auth before rendering anything.
export default function DashboardPage() {
  return (
    <Suspense fallback={<p>Checking your session...</p>}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  if (!token) {
    console.log("No token found, redirecting to login.");
    redirect("/login");
  }

  // The slide stops at "is there a token?". An expired token is still a token,
  // so we also ask the backend, the only one that can really verify it.
  const api = await apiserver();
  const user = await api
    .get<User>("/auth/me")
    .then((res) => res.data)
    .catch(() => null);
  if (!user) redirect("/login?expired=1");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Welcome, {user.name}</h1>
      <p className="rounded bg-white p-3 text-sm">
        This page was built on the server. It read your httpOnly cookie with <code>cookies()</code> and
        sent it to the backend as a Bearer token.
      </p>
      <CheckAgain userId={user.id} />
    </div>
  );
}
