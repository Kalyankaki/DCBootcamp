"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Read persisted theme on mount
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("dc-theme") : null;
    const preferred = stored === "light" || stored === "dark" ? stored : "dark";
    setThemeState(preferred);
    setMounted(true);
  }, []);

  // Apply theme to document root
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.classList.remove("theme-light", "theme-dark");
    root.classList.add(`theme-${theme}`);
    try { localStorage.setItem("dc-theme", theme); } catch {}
  }, [theme, mounted]);

  const toggleTheme = () => setThemeState((t) => (t === "dark" ? "light" : "dark"));
  const setTheme = (t: Theme) => setThemeState(t);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // During SSR or if provider is missing, return dark default
    return { theme: "dark", toggleTheme: () => {}, setTheme: () => {} };
  }
  return ctx;
}
