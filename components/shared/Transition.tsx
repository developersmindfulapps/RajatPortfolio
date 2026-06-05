"use client";

import React from "react";
import { motion } from "framer-motion";

type TransitionType = "fade" | "slide-up" | "slide-down" | "scale";

interface TransitionProps {
  children: React.ReactNode;
  className?: string;
  type?: TransitionType;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export function Transition({
  children,
  className,
  type = "slide-up",
  delay = 0,
  duration = 0.5,
  once = true,
}: TransitionProps) {
  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    "slide-up": {
      hidden: { opacity: 0, y: 24 },
      visible: { opacity: 1, y: 0 },
    },
    "slide-down": {
      hidden: { opacity: 0, y: -24 },
      visible: { opacity: 1, y: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={variants[type]}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
