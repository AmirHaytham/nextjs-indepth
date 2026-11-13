"use client";

import { useTheme } from "./theme-provider";

// Slide 010's consumer. It has to be a Client Component: useTheme() reads
// React Context, and Server Components cannot.
export function ThemedTitle() {
  const theme = useTheme();
  return (
    <h1 className="text-2xl font-semibold" style={{ color: theme.Colors.primary }}>
      Context (current theme: {theme.name})
    </h1>
  );
}

export function ThemedBox({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <div className="rounded p-4" style={{ background: theme.Colors.background, color: theme.Colors.secondary }}>
      {children}
    </div>
  );
}

export function ThemedButton() {
  const theme = useTheme();
  return (
    <button
      onClick={theme.toggle}
      style={{ background: theme.Colors.background, color: theme.Colors.primary }}
      className="rounded border px-4 py-2 font-semibold"
    >
      Button (reads the theme itself): toggle theme
    </button>
  );
}
