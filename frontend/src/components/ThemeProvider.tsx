"use client";

import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem("theme") || "light";
    const root = document.documentElement;

    if (savedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
