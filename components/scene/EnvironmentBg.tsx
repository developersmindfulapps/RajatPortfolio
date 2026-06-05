"use client";

import React, { useEffect, useState } from "react";

type EnvironmentTheme = "day" | "night" | "sunset" | "sunrise";

export function EnvironmentBg({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<EnvironmentTheme>("day");

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

  const themes: EnvironmentTheme[] = ["day", "night", "sunset", "sunrise"];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Absolute background fader stack */}
      <div className="fixed inset-0 -z-20 pointer-events-none h-full w-full overflow-hidden bg-zinc-950">
        {themes.map((t) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={t}
            src={`/scenes/${t}/bg.png`}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              activeTheme === t ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transform: "translate3d(0,0,0)", // hardware acceleration
            }}
          />
        ))}
      </div>

      {/* Main content wrapper */}
      <div className="relative z-10 min-h-screen w-full flex flex-col">
        {children}
      </div>
    </div>
  );
}
