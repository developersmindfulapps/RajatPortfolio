"use client";

import React, { useState, useEffect } from "react";

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

interface BirdInstance {
  id: number;
  delay: number;
  startY: number;
  yDiff: number;
  scale: number;
  duration: number;
  opacity: number;
}

export function DayAtmosphere() {
  const [birds, setBirds] = useState<BirdInstance[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const triggerFlock = () => {
      const minCount = isMobile ? 2 : 3;
      const maxCount = isMobile ? 3 : 5;
      const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;

      const newBirds: BirdInstance[] = Array.from({ length: count }).map((_, i) => {
        const duration = isMobile ? (10 + Math.random() * 5) : (8 + Math.random() * 7);
        const delay = Math.random() * 2.5; 
        const startY = 10 + Math.random() * 30; // Upper sky only (10% to 40% height)
        const yDiff = -40 + Math.random() * 80; // Altitude variation (-40px to +40px)
        const scale = isMobile 
          ? (0.35 + Math.random() * 0.15) 
          : (0.55 + Math.random() * 0.25); 
        const opacity = isMobile ? 0.20 : 0.35; 

        return {
          id: Date.now() + i,
          delay,
          startY,
          yDiff,
          scale,
          duration,
          opacity,
        };
      });

      setBirds(newBirds);

      setTimeout(() => {
        setBirds([]);
      }, 20000);

      const nextMin = isMobile ? 60 : 30;
      const nextMax = isMobile ? 90 : 60;
      const nextDelay = (nextMin + Math.random() * (nextMax - nextMin)) * 1000;
      timeoutId = setTimeout(triggerFlock, nextDelay);
    };

    const initialDelay = (isMobile ? 5 : 3) * 1000;
    timeoutId = setTimeout(triggerFlock, initialDelay);

    return () => clearTimeout(timeoutId);
  }, [isMobile]);

  const cloudOpacity = isMobile ? "opacity-12" : "opacity-15";

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none select-none z-10">
      {/* Drifting Clouds (Upper sky only, left-to-right traversal) */}
      <div 
        className={`absolute top-0 left-0 w-[200vw] h-[45vh] flex flex-row pointer-events-none select-none will-change-transform animate-drift-clouds-day transition-opacity duration-300 ${cloudOpacity}`}
      >
        <div className="w-[100vw] h-full bg-cover bg-no-repeat" style={{ backgroundImage: "url('/scenes/day/clouds.png')" }} />
        <div className="w-[100vw] h-full bg-cover bg-no-repeat" style={{ backgroundImage: "url('/scenes/day/clouds.png')" }} />
      </div>

      {/* Bird Flock Layer */}
      {birds.map((bird) => (
        <div
          key={bird.id}
          className="bird-element"
          style={{
            top: `${bird.startY}%`,
            animation: `fly-across-right ${bird.duration}s linear forwards`,
            animationDelay: `${bird.delay}s`,
            backgroundImage: "url('/scenes/day/birds.png')",
            "--bird-scale": bird.scale,
            "--bird-opacity": bird.opacity,
            "--bird-y-diff": `${bird.yDiff}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export function SunriseAtmosphere() {
  const isMobile = useIsMobile();
  const cloudOpacity = isMobile ? "opacity-[0.08]" : "opacity-[0.10]";

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none select-none z-10">
      <div 
        className={`absolute top-0 left-0 w-[200vw] h-[45vh] flex flex-row pointer-events-none select-none will-change-transform animate-drift-clouds-sunrise transition-opacity duration-300 ${cloudOpacity}`}
      >
        <div className="w-[100vw] h-full bg-cover bg-no-repeat" style={{ backgroundImage: "url('/scenes/day/clouds.png')" }} />
        <div className="w-[100vw] h-full bg-cover bg-no-repeat" style={{ backgroundImage: "url('/scenes/day/clouds.png')" }} />
      </div>
    </div>
  );
}

export function SunsetAtmosphere() {
  const isMobile = useIsMobile();
  const particleOpacity = isMobile ? 0.04 : 0.07;

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none select-none z-10">
      {/* Parallax Clouds Layer 1 (Slower, far clouds, lower opacity) */}
      <div 
        className="absolute top-0 left-0 w-[200vw] h-[38vh] flex flex-row pointer-events-none select-none will-change-transform animate-drift-clouds-sunset opacity-[0.07]"
        style={{ animationDuration: "720s" }}
      >
        <div className="w-[100vw] h-full bg-cover bg-no-repeat" style={{ backgroundImage: "url('/scenes/day/clouds.png')" }} />
        <div className="w-[100vw] h-full bg-cover bg-no-repeat" style={{ backgroundImage: "url('/scenes/day/clouds.png')" }} />
      </div>

      {/* Parallax Clouds Layer 2 (Faster, near clouds, slightly higher opacity) */}
      <div 
        className="absolute top-0 left-0 w-[200vw] h-[45vh] flex flex-row pointer-events-none select-none will-change-transform animate-drift-clouds-sunset opacity-[0.12]"
        style={{ animationDuration: "600s" }}
      >
        <div className="w-[100vw] h-full bg-cover bg-no-repeat" style={{ backgroundImage: "url('/scenes/day/clouds.png')" }} />
        <div className="w-[100vw] h-full bg-cover bg-no-repeat" style={{ backgroundImage: "url('/scenes/day/clouds.png')" }} />
      </div>

      {/* Floating Dust / Pollen Particles */}
      <div className="absolute inset-0 h-[200vh] w-full pointer-events-none select-none will-change-transform animate-float-particles-sunset">
        <div 
          className="h-[100vh] w-full bg-[length:150%_150%] bg-center bg-repeat-x transition-opacity duration-300"
          style={{ opacity: particleOpacity, backgroundImage: "url('/scenes/day/particles.png')" }}
        />
        <div 
          className="h-[100vh] w-full bg-[length:150%_150%] bg-center bg-repeat-x transition-opacity duration-300"
          style={{ opacity: particleOpacity, backgroundImage: "url('/scenes/day/particles.png')" }}
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
          style={{ opacity: particleOpacity, backgroundImage: "url('/scenes/day/particles.png')" }}
        />
        <div 
          className="h-[100vh] w-full bg-[length:180%_180%] bg-center bg-repeat-x transition-opacity duration-300"
          style={{ opacity: particleOpacity, backgroundImage: "url('/scenes/day/particles.png')" }}
        />
      </div>

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
