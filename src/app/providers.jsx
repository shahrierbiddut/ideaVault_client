"use client";

import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2800,
            style: {
              borderRadius: "14px",
              border: "1px solid var(--border-base)",
              background: "var(--surface-2)",
              color: "var(--text-primary)",
              boxShadow: "var(--shadow-1)",
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
