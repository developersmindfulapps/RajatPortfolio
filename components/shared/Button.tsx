"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-env-border " +
    "disabled:pointer-events-none disabled:opacity-50 cursor-pointer text-center";
  
  const variants = {
    primary: "bg-env-text text-env-surface hover:opacity-90 shadow-sm",
    secondary: "bg-env-surface text-env-text border border-env-border hover:opacity-90 shadow-xs",
    outline: "border border-env-border bg-transparent text-env-text hover:bg-env-surface hover:opacity-90",
    ghost: "bg-transparent text-env-text hover:bg-env-surface hover:opacity-90",
  };

  const sizes = {
    sm: "h-9 px-3 text-xs md:text-sm",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-11 px-6 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
