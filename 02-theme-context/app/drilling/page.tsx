"use client";

import { useState } from "react";

type Colors = { primary: string; background: string };

const light: Colors = { primary: "#0070f3", background: "#ffffff" };
const dark: Colors = { primary: "#60a5fa", background: "#1c1c1e" };

// Slide 007's problem. Page, Dashboard and Sidebar never use the colors,
// they only carry them down to the Button at the bottom.
export default function DrillingPage() {
  const [colors, setColors] = useState(light);
  const toggle = () => setColors(colors === light ? dark : light);

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Prop drilling</h1>
      <Dashboard colors={colors} toggle={toggle} />
    </div>
  );
}

function Dashboard({ colors, toggle }: { colors: Colors; toggle: () => void }) {
  return (
    <Level name="Dashboard (only passes it on)">
      <Sidebar colors={colors} toggle={toggle} />
    </Level>
  );
}

function Sidebar({ colors, toggle }: { colors: Colors; toggle: () => void }) {
  return (
    <Level name="Sidebar (only passes it on)">
      <Button colors={colors} toggle={toggle} />
    </Level>
  );
}

function Button({ colors, toggle }: { colors: Colors; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      style={{ background: colors.background, color: colors.primary }}
      className="rounded border px-4 py-2 font-semibold"
    >
      Button (actually uses it): toggle theme
    </button>
  );
}

function Level({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2 rounded border border-dashed bg-white p-3">
      <p className="text-xs text-slate-500">{name}</p>
      {children}
    </div>
  );
}
