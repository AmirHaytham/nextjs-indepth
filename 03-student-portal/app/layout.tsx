import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "./components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Portal",
  description: "Auth with httpOnly cookies, AuthContext and axios",
};

// The slide 008 pattern: the layout stays a Server Component and wraps the
// app in the AuthProvider Client Component. Suspense is there because the
// provider reads the current URL (usePathname), which Next.js 16 requires.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-900">
        <Suspense fallback={null}>
          <AuthProvider>
            <Navbar />
            <main className="mx-auto max-w-2xl p-6">{children}</main>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
