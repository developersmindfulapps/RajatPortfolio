"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { DayAtmosphere, SunriseAtmosphere, SunsetAtmosphere, NightAtmosphere } from "./AtmosphereLayers";

type EnvironmentTheme = "day" | "night" | "sunset" | "sunrise";

// Module-level cache to track loaded themes and prevent unmounting/re-downloading
const loadedThemeCache = new Set<EnvironmentTheme>();

export function EnvironmentBg({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<EnvironmentTheme>("day");
  // SSR-safe: default false (landscape/desktop), corrected on first client paint
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    // 3. Detect portrait orientation — applies to phones AND portrait tablets
    //    (iPad, Surface, etc.) regardless of pixel width.
    const check = () => setIsPortrait(window.innerHeight > window.innerWidth);
    check(); // run immediately on mount
    window.addEventListener("resize", check, { passive: true });
    window.addEventListener("orientationchange", check, { passive: true });
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  // Ensure active theme is immediately marked as loaded
  loadedThemeCache.add(activeTheme);

  const themes: EnvironmentTheme[] = ["day", "night", "sunset", "sunrise"];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Absolute background fader stack */}
      <div className="fixed inset-0 -z-20 pointer-events-none h-full w-full overflow-hidden bg-zinc-950">
        {themes.map((t) => {
          const isLoaded = loadedThemeCache.has(t);
          // Portrait  → mobile artwork  (phones + portrait tablets)
          // Landscape → desktop artwork (landscape tablets + desktops)
          const bgSrc = isPortrait
            ? `/scenes/${t}/bg_mobile.avif`
            : `/scenes/${t}/bg.avif`;

          return (
            <div
              key={t}
              className={`absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-700 ease-in-out ${
                activeTheme === t ? "opacity-100" : "opacity-0"
              }`}
            >
              {isLoaded && (
                <>
                  <Image
                    src={bgSrc}
                    alt=""
                    fill
                    sizes="100vw"
                    priority={activeTheme === t}
                    className="object-cover"
                  />
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
