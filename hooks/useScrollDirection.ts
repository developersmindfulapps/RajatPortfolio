"use client";

import { useState, useEffect } from "react";

export type ScrollDirection = "up" | "down" | null;

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      // Threshold to avoid jitter
      if (Math.abs(scrollY - lastScrollY) < 10) {
        return;
      }
      
      const direction = scrollY > lastScrollY ? "down" : "up";
      setScrollDirection(direction);
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDirection, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, []);

  return scrollDirection;
}
