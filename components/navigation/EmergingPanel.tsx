"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmergingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function EmergingPanel({ isOpen, onClose, title, children }: EmergingPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Click outside to collapse panel
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if clicking a constellation button
      const target = event.target as HTMLElement;
      if (target.closest("button") && target.closest("button")?.className.includes("absolute")) {
        return;
      }
      
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div
      ref={panelRef}
      className={cn(
        // Constrained width to 35-40% of viewport width on desktop (38vw)
        "w-full md:w-[38vw] max-w-[540px] border border-env-border bg-env-surface p-8 md:p-10 shadow-xs rounded-3xl z-40 relative",
        // Cinematic Delayed Emergence Animation (700ms transition, 500ms delay when opening)
        "transition-all duration-[700ms] ease-in-out",
        isOpen
          ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-x-12 scale-95 pointer-events-none hidden"
      )}
      style={{
        backdropFilter: "blur(var(--env-blur))",
        boxShadow: "var(--env-shadow)",
        transitionDelay: isOpen ? "500ms" : "0ms", // staggered entry delay
      }}
    >
      {/* Visual Anchor Dot for selected node connector */}
      <div 
        id="panel-anchor"
        className="absolute left-0 top-12 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-env-text border border-env-border transition-all duration-[700ms]"
        style={{
          boxShadow: "var(--env-glow), 0 0 4px var(--env-border)",
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-env-border pb-4 mb-6 select-none">
        <h3 className="text-sm font-bold tracking-widest uppercase text-env-text font-heading">
          {title}
        </h3>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-env-muted hover:text-env-text hover:bg-env-text/5 cursor-pointer transition-colors duration-[150ms] ease-in-out"
          aria-label="Close panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable content container with large breathing room padding */}
      <div className="max-h-[55vh] md:max-h-[60vh] overflow-y-auto overflow-x-hidden pr-1 text-sm leading-relaxed text-env-text font-body">
        {children}
      </div>
    </div>
  );
}
