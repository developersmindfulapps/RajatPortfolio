"use client";

import React, { useEffect, useState } from "react";
import { DayAtmosphere, SunriseAtmosphere, SunsetAtmosphere, NightAtmosphere } from "./AtmosphereLayers";

type EnvironmentTheme = "day" | "night" | "sunset" | "sunrise";

// Module-level cache to track loaded themes and prevent unmounting/re-downloading
const loadedThemeCache = new Set<EnvironmentTheme>();

export function EnvironmentBg({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<EnvironmentTheme>("day");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Check initial theme from html attribute or default to day
    const getInitialTheme = (): EnvironmentTheme => {
      const current = document.documentElement.getAttribute("data-theme") as EnvironmentTheme;
      if (["day", "night", "sunset", "sunrise"].includes(current)) {
        return current;
      }
      return "day";
    };

    setActiveTheme(getInitialTheme());

    // 2. Set up MutationObserver to react to data-theme updates on document root
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          const next = document.documentElement.getAttribute("data-theme") as EnvironmentTheme;
          if (["day", "night", "sunset", "sunrise"].includes(next)) {
            setActiveTheme(next);
          }
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  // Ensure active theme is immediately marked as loaded
  loadedThemeCache.add(activeTheme);

  const themes: EnvironmentTheme[] = ["day", "night", "sunset", "sunrise"];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Absolute background fader stack (only rendered on client after mount to prevent double download) */}
      <div className="fixed inset-0 -z-20 pointer-events-none h-full w-full overflow-hidden bg-zinc-950">
        {mounted && themes.map((t) => {
          const isLoaded = loadedThemeCache.has(t);
          const isActive = activeTheme === t;

          return (
            <div
              key={t}
              className={`absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              {isLoaded && (
                <>
                  <picture>
                    {/* 1. Mobile Portrait (max-width: 640px) */}
                    <source media="(max-width: 640px) and (orientation: portrait)" srcSet={`/scenes/${t}/bg_mobile.avif`} type="image/avif" />
                    {/* 2. Tablet Portrait (max-width: 1024px) */}
                    <source media="(max-width: 1024px) and (orientation: portrait)" srcSet={`/scenes/${t}/bg_tablet_portrait.avif`} type="image/avif" />
                    {/* 3. Tablet Landscape (max-width: 1024px) */}
                    <source media="(max-width: 1024px) and (orientation: landscape)" srcSet={`/scenes/${t}/bg_tablet.avif`} type="image/avif" />
                    {/* 4. Desktop Fallback */}
                    <img
                      src={`/scenes/${t}/bg_desktop.avif`}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      loading={isActive ? "eager" : "lazy"}
                      fetchPriority={isActive ? "high" : "low"}
                      decoding={isActive ? "async" : undefined}
                    />
                  </picture>
                  {/* Atmosphere layers positioned between bg image and UI content */}
                  {t === "day" && <DayAtmosphere />}
                  {t === "sunrise" && <SunriseAtmosphere />}
                  {t === "sunset" && <SunsetAtmosphere />}
                  {t === "night" && <NightAtmosphere />}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Main content wrapper */}
      <div className="relative z-10 min-h-screen w-full flex flex-col">
        {children}
      </div>
    </div>
  );
}

