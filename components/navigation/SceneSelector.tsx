"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type EnvironmentTheme = "day" | "night" | "sunset" | "sunrise";

const THEME_OPTIONS: { value: EnvironmentTheme; label: string; icon: string }[] = [
  { value: "day", label: "Day", icon: "☀" },
  { value: "night", label: "Night", icon: "🌙" },
  { value: "sunset", label: "Sunset", icon: "🌅" },
  { value: "sunrise", label: "Sunrise", icon: "🌄" },
];

export function SceneSelector() {
  const [mounted, setMounted] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<EnvironmentTheme>("day");

  useEffect(() => {
    setMounted(true);
    const rootTheme = document.documentElement.getAttribute("data-theme") as EnvironmentTheme;
    if (rootTheme && ["day", "night", "sunset", "sunrise"].includes(rootTheme)) {
      setSelectedTheme(rootTheme);
    } else {
      // Fallback calculation if not set on document root
      const hour = new Date().getHours();
      let theme: EnvironmentTheme = "night";
      if (hour >= 5 && hour < 7) theme = "sunrise";
      else if (hour >= 7 && hour < 18) theme = "day";
      else if (hour >= 18 && hour < 20) theme = "sunset";
      
      setSelectedTheme(theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, []);

  const handleThemeChange = (theme: EnvironmentTheme) => {
    setSelectedTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
  };

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className="fixed top-6 right-6 z-50">
      <div 
        className="flex items-center gap-1 rounded-xl border border-env-border bg-env-surface p-1 shadow-xs transition-env duration-[700ms]"
        style={{
          backdropFilter: "blur(var(--env-blur))",
        }}
      >
        {THEME_OPTIONS.map((option) => {
          const isActive = selectedTheme === option.value;
          return (
            <button
              key={option.value}
              onClick={() => handleThemeChange(option.value)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer select-none transition-all duration-[250ms] ease-in-out border",
                isActive
                  ? "bg-env-text text-env-surface border-env-border shadow-xs opacity-100 scale-102"
                  : "text-env-muted hover:text-env-text border-transparent opacity-65 hover:opacity-100"
              )}
            >
              <span>{option.icon}</span>
              <span className="hidden md:inline">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
