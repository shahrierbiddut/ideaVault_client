"use client";

import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="icon-btn rounded-full"
      aria-label="Toggle theme"
      type="button"
    >
      <FiSun className="theme-icon-sun" />
      <FiMoon className="theme-icon-moon" />
    </button>
  );
}
