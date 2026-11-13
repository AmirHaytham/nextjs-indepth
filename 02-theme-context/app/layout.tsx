import type { Metadata } from "next";
import Link from "next/link";
import { ThemeProvider } from "./components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Theme Context",
  description: "Prop drilling versus React Context",
};

// The layout stays a Server Component. Only ThemeProvider is a Client
// Component, and the pages passed in as children stay whatever they were.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <ThemeProvider>
        <body className="min-h-screen bg-slate-100 text-slate-900">
          <nav className="flex gap-4 border-b bg-white p-4 text-sm">
            <Link href="/" className="text-blue-700 hover:underline">Home</Link>
            <Link href="/drilling" className="text-blue-700 hover:underline">/drilling</Link>
            <Link href="/context" className="text-blue-700 hover:underline">/context</Link>
          </nav>
          <main className="mx-auto max-w-2xl p-6">{children}</main>
        </body>
      </ThemeProvider>
    </html>
  );
}
