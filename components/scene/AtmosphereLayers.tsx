"use client";

import React, { useState, useEffect } from "react";
import { NightSkyEffects } from "./NightSkyEffects";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => { 
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export function DayAtmosphere() {
  return null;
}

export function SunriseAtmosphere() {
  return null;
}

export function SunsetAtmosphere() {
  const isMobile = useIsMobile();
  const particleOpacity = isMobile ? 0.04 : 0.07;

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none select-none z-10">
      {/* Floating Dust / Pollen Particles */}
      <div className="absolute inset-0 h-[200vh] w-full pointer-events-none select-none will-change-transform animate-float-particles-sunset">
        <div 
          className="h-[100vh] w-full bg-[length:150%_150%] bg-center bg-repeat-x transition-opacity duration-300"
          style={{ opacity: particleOpacity, backgroundImage: "url('/scenes/day/particles.avif')" }}
        />
        <div 
          className="h-[100vh] w-full bg-[length:150%_150%] bg-center bg-repeat-x transition-opacity duration-300"
          style={{ opacity: particleOpacity, backgroundImage: "url('/scenes/day/particles.avif')" }}
        />
      </div>
    </div>
  );
}

export function NightAtmosphere() {
  const isMobile = useIsMobile();
  const particleOpacity = isMobile ? 0.02 : 0.04;

  const STARS = [
    { top: "12%", left: "15%", size: "1.5px", duration: "8s", delay: "0s" },
    { top: "8%", left: "42%", size: "2px", duration: "11s", delay: "2.5s" },
    { top: "25%", left: "28%", size: "1px", duration: "7s", delay: "1.2s" },
    { top: "18%", left: "73%", size: "2px", duration: "14s", delay: "4s" },
    { top: "32%", left: "55%", size: "1.5px", duration: "9s", delay: "3.2s" },
    { top: "6%", left: "88%", size: "1px", duration: "12s", delay: "1.8s" },
  ];

  const visibleStars = isMobile ? STARS.slice(0, 3) : STARS;

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none select-none z-10">
      {/* Sparse Drifting Night Particles */}
      <div className="absolute inset-0 h-[200vh] w-full pointer-events-none select-none will-change-transform animate-float-particles-night">
        <div 
          className="h-[100vh] w-full bg-[length:180%_180%] bg-center bg-repeat-x transition-opacity duration-300"
          style={{ opacity: particleOpacity, backgroundImage: "url('/scenes/day/particles.avif')" }}
        />
        <div 
          className="h-[100vh] w-full bg-[length:180%_180%] bg-center bg-repeat-x transition-opacity duration-300"
          style={{ opacity: particleOpacity, backgroundImage: "url('/scenes/day/particles.avif')" }}
        />
      </div>

      {/* Shooting stars + future night effects (fireflies, northern lights, etc.) */}
      <NightSkyEffects />

      {/* Subtle Twinkling Stars */}
      {visibleStars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-star-twinkle pointer-events-none select-none"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            boxShadow: "0 0 3px rgba(255, 255, 255, 0.4)",
            "--twinkle-duration": star.duration,
            "--twinkle-delay": star.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
