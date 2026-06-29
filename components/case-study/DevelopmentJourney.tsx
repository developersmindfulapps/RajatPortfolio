"use client";

import React from "react";
import { Section } from "@/components/shared/Section";
import { timelineData } from "@/data/case-study";
import { cn } from "@/lib/utils";

export default function DevelopmentJourney() {
  return (
    <Section
      title="Development Journey"
      subtitle="The roadmap and engineering processes behind the platform's release."
    >
      {/* 
        Timeline Layout Container:
        - Mobile: vertical timeline with left-hand vertical rule
        - Desktop: horizontal layout with middle horizontal rule
      */}
      <div className="relative pt-2 pb-4">
        
        {/* Horizontal line for desktop */}
        <div className="hidden lg:block absolute left-8 right-8 top-12.5 h-0.5 bg-env-border/20 -z-10" />
        
        {/* Vertical line for mobile/tablet */}
        <div className="lg:hidden absolute left-3.5 top-3 bottom-3 w-0.5 bg-env-border/20 -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-4">
          {timelineData.map((node, index) => (
            <div 
              key={node.id} 
              className="flex lg:flex-col items-start gap-4 lg:gap-6 group relative lg:text-center lg:flex-1"
            >
              
              {/* Timeline Marker (Pulse/Circle) */}
              <div 
                className="w-7 h-7 rounded-full border border-env-border/40 bg-env-surface flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-115 group-hover:border-env-text/50 shadow-xs relative z-10 lg:mx-auto"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-env-muted group-hover:bg-env-text transition-colors duration-300" />
              </div>

              {/* Text Info */}
              <div className="space-y-1 lg:px-2 pt-0.5 lg:pt-0">
                <span className="text-[9px] font-bold text-env-muted uppercase tracking-wider select-none">
                  Phase 0{index + 1}
                </span>
                <h4 className="font-heading text-xs font-bold tracking-wide text-env-text uppercase">
                  {node.title}
                </h4>
                <p className="font-body text-xs text-env-muted leading-relaxed max-w-sm lg:max-w-none">
                  {node.description}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
