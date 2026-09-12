"use client";

import React from "react";
import { Section } from "@/components/shared/Section";
import { capabilitiesData } from "@/data/case-study";
import { Card } from "@/components/shared/Card";
import * as Icons from "lucide-react";

export default function KeyCapabilities() {
  const getIcon = (iconName: string) => {
    const LucideIcon = (Icons as any)[iconName];
    return LucideIcon ? <LucideIcon className="h-5 w-5 text-env-text opacity-90" /> : null;
  };

  return (
    <Section
      title="Key Capabilities"
      subtitle="Core architectural components and systems powering the portfolio platform."
    >
      {/* Responsive Grid: 1 col on mobile, 2 on tablet/small monitors, 5 on large desktops */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {capabilitiesData.map((capability) => (
          <Card
            key={capability.id}
            hoverEffect={true}
            className="p-5.5 bg-env-surface/30 border-env-border/20 flex flex-col justify-between min-h-[160px] group transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="p-2.5 bg-env-text/5 rounded-xl border border-env-border/40 text-env-text w-fit shrink-0 transition-transform duration-300 group-hover:scale-105">
                {getIcon(capability.iconName)}
              </div>
              <div className="space-y-1.5">
                <h4 className="font-heading text-xs font-bold tracking-wide text-env-text uppercase">
                  {capability.title}
                </h4>
                <p className="font-body text-xs text-env-muted leading-relaxed">
                  {capability.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
