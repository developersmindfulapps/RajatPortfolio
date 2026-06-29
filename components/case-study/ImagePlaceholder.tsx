"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, LucideIcon } from "lucide-react";

interface ImagePlaceholderProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  aspectRatioClass?: string; // e.g. "aspect-video" or "aspect-[9/19]"
  title: string;
  subtitle: string;
  icon?: LucideIcon;
  className?: string;
}

export function ImagePlaceholder({
  src,
  alt,
  width,
  height,
  fill = true,
  priority = false,
  aspectRatioClass = "aspect-video",
  title,
  subtitle,
  icon: Icon = ImageIcon,
  className,
}: ImagePlaceholderProps) {
  
  // Decide whether to show the placeholder or the actual image
  // For safety, we show placeholder if src is empty, undefined, or points to dummy structure
  const showPlaceholder = !src || src.trim() === "" || src.includes(".gitkeep");

  return (
    <div 
      className={cn(
        "w-full relative overflow-hidden rounded-2xl border border-env-border/30 bg-env-surface/20 transition-all duration-300",
        aspectRatioClass,
        className
      )}
    >
      {showPlaceholder ? (
        // Premium skeleton placeholder with shimmer
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none">
          {/* Shimmer background animation overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-env-text/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
          
          <div className="p-3.5 bg-env-text/5 rounded-xl border border-env-border/40 text-env-muted mb-3.5 relative z-10 transition-transform duration-300 group-hover:scale-105">
            <Icon className="h-5 w-5" />
          </div>
          <h5 className="font-heading text-xs font-bold tracking-wide text-env-text relative z-10">
            {title}
          </h5>
          <p className="font-body text-[10px] text-env-muted mt-1 uppercase tracking-wider relative z-10 font-medium">
            {subtitle}
          </p>
        </div>
      ) : (
        // Next.js Optimized Image (zero layout shifts)
        <Image
          src={src}
          alt={alt}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          fill={fill}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-opacity duration-500 ease-in-out"
        />
      )}
    </div>
  );
}
