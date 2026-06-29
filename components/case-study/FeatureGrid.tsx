"use client";

import React from "react";
import { featuresData } from "@/data/case-study";
import { Card } from "@/components/shared/Card";
import * as Icons from "lucide-react";

export default function FeatureGrid() {
  const getIcon = (iconName: string) => {
    const LucideIcon = (Icons as any)[iconName];
    return LucideIcon ? <LucideIcon className="h-4.5 w-4.5 text-env-text opacity-95" /> : null;
  };

  return (
    <Card 
      hoverEffect={false} 
      className="bg-env-surface/30 border-env-border/20 p-6 sm:p-8 flex flex-col justify-between space-y-6 h-full"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-env-text/5 rounded-xl border border-env-border/40 text-env-text shrink-0">
            <Icons.Layers className="h-5 w-5" />
          </div>
          <h3 className="font-heading text-lg sm:text-xl font-bold tracking-wide text-env-text">
            What's inside?
          </h3>
        </div>
        <p className="font-body text-xs text-env-muted leading-relaxed">
          From immersive UI to powerful backend features, everything is built from scratch with performance and security in mind.
        </p>
      </div>

      {/* Feature Grid: 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {featuresData.map((feature) => (
          <div 
            key={feature.id} 
            className="flex gap-3.5 p-3.5 rounded-xl border border-env-border/25 bg-env-text/5 hover:bg-env-text/10 transition-colors"
          >
            <div className="p-2 bg-env-surface rounded-lg border border-env-border/40 shrink-0 h-fit">
              {getIcon(feature.iconName)}
            </div>
            <div className="space-y-1">
              <h5 className="font-heading text-xs font-bold tracking-wide text-env-text">
                {feature.title}
              </h5>
              <p className="font-body text-[11px] text-env-muted leading-normal">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
