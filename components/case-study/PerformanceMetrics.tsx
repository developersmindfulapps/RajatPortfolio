"use client";

import React from "react";
import { Section } from "@/components/shared/Section";
import { metricsData } from "@/data/case-study";
import { Card } from "@/components/shared/Card";
import { Award } from "lucide-react";

export default function PerformanceMetrics() {
  return (
    <Section
      title="Performance & Engineering"
      subtitle="Strict audit validations, edge routing speeds, and data metrics."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        {metricsData.map((metric) => {
          const isLighthouse100 = metric.value === "100" || metric.value === "98+";
          return (
            <Card
              key={metric.id}
              hoverEffect={true}
              className={`p-5 bg-env-surface/30 flex flex-col justify-between min-h-[125px] transition-all duration-300
                ${isLighthouse100 
                  ? "border-green-500/15 shadow-[0_0_16px_rgba(34,197,94,0.06)]" 
                  : "border-env-border/20"}
              `}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold uppercase tracking-wider text-env-muted">
                  {metric.label}
                </span>
                <Award className={`h-4 w-4 ${isLighthouse100 ? "text-green-400" : "text-env-muted"}`} />
              </div>
              
              <div className="mt-4 space-y-1">
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight 
                    ${isLighthouse100 ? "text-green-400" : "text-env-text"}`}
                  >
                    {metric.value}
                  </span>
                </div>
                <p className="font-body text-[10px] text-env-muted uppercase tracking-wider font-semibold">
                  {metric.subtitle}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
