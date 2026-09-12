"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export type AvatarState = "idle" | "thinking" | "reaction";

interface AvatarFigureProps {
  state?: AvatarState;
  size?: "sm" | "md" | "lg";
  className?: string;
  showIndicator?: boolean;
  indicatorStatus?: "online" | "thinking" | "reaction";
}

const sizeConfig = {
  sm: {
    container: "w-7 h-7 md:w-8 md:h-8",
    imageSize: 32,
    indicator: "h-2 w-2 -bottom-0.5 -right-0.5",
  },
  md: {
    container: "w-9 h-9 md:w-10 md:h-10",
    imageSize: 40,
    indicator: "h-2.5 w-2.5 -bottom-0.5 -right-0.5",
  },
  lg: {
    container: "w-14 h-14 md:w-16 md:h-16",
    imageSize: 64,
    indicator: "h-3.5 w-3.5 bottom-0.5 right-0.5",
  },
};

export function AvatarFigure({
  state = "idle",
  size = "md",
  className = "",
  showIndicator = false,
  indicatorStatus = "online",
}: AvatarFigureProps) {
  const cfg = sizeConfig[size];

  // Motion variants for the 3 distinct states
  const variants = {
    idle: {
      y: [0, -2, 0],
      scale: [1, 1.015, 1],
      transition: {
        duration: 3.6,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
    thinking: {
      y: [0, -3, 0],
      rotate: [-2, 2, -2],
      scale: [1, 1.03, 1],
      transition: {
        duration: 1.4,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
    reaction: {
      y: [0, -6, 0],
      scale: [1, 1.08, 1],
      rotate: [0, -3, 3, 0],
      transition: {
        duration: 0.7,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Subtle Glow Aura behind avatar in thinking or reaction state */}
      {state === "thinking" && (
        <span className="absolute inset-0 rounded-full bg-indigo-500/20 blur-md animate-pulse" />
      )}
      {state === "reaction" && (
        <span className="absolute inset-0 rounded-full bg-amber-400/25 blur-md" />
      )}

      {/* Animated Avatar Container */}
      <motion.div
        animate={state}
        variants={variants}
        className={`relative ${cfg.container} rounded-full overflow-hidden flex items-center justify-center`}
      >
        <Image
          src="/assets/ai/rajat-ai.webp"
          alt="Rajat AI Assistant Avatar"
          width={cfg.imageSize}
          height={cfg.imageSize}
          priority={size === "lg"}
          className="object-contain w-full h-full drop-shadow-sm pointer-events-none"
        />
      </motion.div>

      {/* Online / Active Indicator Dot */}
      {showIndicator && (
        <span className={`absolute ${cfg.indicator} flex items-center justify-center z-10`}>
          {indicatorStatus === "thinking" ? (
            <span className="relative flex h-full w-full">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-full w-full bg-amber-500 border border-env-surface" />
            </span>
          ) : indicatorStatus === "reaction" ? (
            <span className="relative flex h-full w-full">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-full w-full bg-sky-500 border border-env-surface" />
            </span>
          ) : (
            <span className="relative flex h-full w-full">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500 border border-env-surface" />
            </span>
          )}
        </span>
      )}
    </div>
  );
}
