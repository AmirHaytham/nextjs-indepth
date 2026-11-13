"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

// Slide 021: one navbar, different links per role, all from useAuth().
export function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="flex items-center gap-4 bg-slate-800 p-4 text-sm text-slate-100">
      <Link href="/" className="font-bold">Student Portal</Link>
      {user && (
        <>
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          {/* Same "Courses" link, different page per role. */}
          <Link
            href={user.role === "student" ? `/students/${user.id}/courses` : "/courses"}
            className="hover:underline"
          >
            Courses
          </Link>
          {user.role === "admin" && <span className="rounded bg-amber-500 px-2 text-xs text-black">admin</span>}
        </>
      )}
      <span className="ml-auto">
        {loading ? (
          "checking..."
        ) : user ? (
          <span className="flex items-center gap-3">
            Hi, {user.name}
            <button onClick={logout} className="rounded bg-slate-600 px-2 py-1">Log out</button>
          </span>
        ) : (
          <Link href="/login" className="rounded bg-blue-600 px-3 py-1">Log in</Link>
        )}
      </span>
    </nav>
  );
}
