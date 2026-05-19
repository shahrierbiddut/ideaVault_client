"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "ideavault_theme";

function getSystemTheme() {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialState() {
  if (typeof window === "undefined") {
    return { theme: "dark", explicit: false };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") {
    return { theme: stored, explicit: true };
  }

  try {
    const parsed = stored ? JSON.parse(stored) : null;
    if (parsed?.theme === "dark" || parsed?.theme === "light") {
      return { theme: parsed.theme, explicit: Boolean(parsed.explicit) };
    }
  } catch {
    // Ignore malformed historical values and continue with system fallback.
  }

  return { theme: getSystemTheme(), explicit: false };
}

export function ThemeProvider({ children }) {
  const initialState = getInitialState();
  const [theme, setTheme] = useState(initialState.theme);
  const [hasExplicitPreference, setHasExplicitPreference] = useState(initialState.explicit);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        theme,
        explicit: hasExplicitPreference,
      }),
    );
  }, [theme, hasExplicitPreference]);

  useEffect(() => {
    if (hasExplicitPreference || typeof window === "undefined") return undefined;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onThemeChange = (event) => {
      setTheme(event.matches ? "dark" : "light");
    };

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onThemeChange);
      return () => media.removeEventListener("change", onThemeChange);
    }

    media.addListener(onThemeChange);
    return () => media.removeListener(onThemeChange);
  }, [hasExplicitPreference]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => {
        setHasExplicitPreference(true);
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
      },
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
