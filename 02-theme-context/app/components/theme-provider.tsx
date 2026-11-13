"use client";

import { createContext, use, useState } from "react";

// The slide 009 ThemeProvider, plus a toggle so you can see every
// component that reads the context update at once.
type Theme = { name: "light" | "dark"; Colors: { primary: string; secondary: string; background: string } };

const lightTheme: Theme = { name: "light", Colors: { primary: "#0070f3", secondary: "#1c1c1e", background: "#ffffff" } };
const darkTheme: Theme = { name: "dark", Colors: { primary: "#60a5fa", secondary: "#f5f5f5", background: "#1c1c1e" } };

type ThemeValue = Theme & { toggle: () => void };

const ThemeContext = createContext<ThemeValue>({ ...lightTheme, toggle: () => {} });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(lightTheme);
  const toggle = () => setTheme(theme.name === "light" ? darkTheme : lightTheme);

  return <ThemeContext.Provider value={{ ...theme, toggle }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => use(ThemeContext);
