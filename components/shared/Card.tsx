"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
  hoverEffect?: boolean;
}

export function Card({
  className,
  children,
  hoverEffect = true,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn(
        "rounded-xl border border-env-border bg-env-surface p-6 shadow-xs",
        hoverEffect && "hover:shadow-sm transition-shadow duration-200",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
