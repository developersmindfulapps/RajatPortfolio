"use client";

/**
 * NightSkyEffects
 * ─────────────────────────────────────────────────────────────────────────────
 * Container for all night-specific atmosphere effects.
 * Currently: ShootingStars (SVG quadratic-bezier path, gradient stroke, glow)
 * Future slots: Fireflies, NorthernLights, DriftingParticles, etc.
 *
 * PERFORMANCE CONTRACT
 * - Zero React re-renders during any animation.
 * - Stars injected/removed via direct DOM mutation (useRef + SVG).
 * - Only CSS `translate` + `opacity` animated (GPU-composited).
 * - `transform: rotate()` applied statically — never touched by keyframe.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from "react";

const rand = (min: number, max: number) => min + Math.random() * (max - min);

// ─── Shooting Stars (SVG) ─────────────────────────────────────────────────────

/**
 * Spawns a shooting star as a tiny glowing dot — no trail, just the point.
 * A small bright circle with a soft blue-white box-shadow, swept diagonally.
 */
function spawnShootingStar(container: HTMLDivElement): void {
  const el = document.createElement("div");

  const startX  = rand(3, 65);      // % across viewport
  const startY  = rand(2, 22);      // % — upper 25 %
  const duration = rand(1.4, 2.2);  // seconds

  el.style.cssText = `
    position: absolute;
    top: ${startY}%;
    left: ${startX}%;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: white;
    box-shadow:
      0 0  4px 2px rgba(200, 230, 255, 0.9),
      0 0 10px 4px rgba(160, 210, 255, 0.5),
      0 0 18px 6px rgba(130, 190, 255, 0.2);
    pointer-events: none;
    user-select: none;
    will-change: translate, opacity;
    animation: shooting-star-fly ${duration}s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
    z-index: 2;
  `;

  el.addEventListener("animationend", () => el.remove(), { once: true });
  container.appendChild(el);
}

function useShootingStars(containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const schedule = () => {
      const delay = rand(15_000, 40_000);
      timeoutId = setTimeout(() => {
        if (containerRef.current) spawnShootingStar(containerRef.current);
        schedule();
      }, delay);
    };

    // First star within 3–7 s so the effect is immediately discoverable
    timeoutId = setTimeout(() => {
      if (containerRef.current) spawnShootingStar(containerRef.current);
      schedule();
    }, rand(3_000, 7_000));

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

// ─── NightSkyEffects (public) ─────────────────────────────────────────────────

/**
 * Mount inside NightAtmosphere.
 * Add future night effects as sibling hooks / child components:
 *
 *   useFireflies(containerRef)
 *   useNorthernLights(containerRef)
 */
export function NightSkyEffects() {
  const containerRef = useRef<HTMLDivElement>(null);
  useShootingStars(containerRef);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none"
      style={{ zIndex: 3 }}
    />
  );
}
