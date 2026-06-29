"use client";

import React from "react";
import { Section } from "@/components/shared/Section";
import { Card } from "@/components/shared/Card";
import { 
  ArrowRight, 
  ArrowDown, 
  Monitor, 
  Server, 
  Cpu, 
  Database, 
  ShieldAlert, 
  MailCheck, 
  Globe 
} from "lucide-react";

export default function ArchitectureDiagram() {
  const steps = [
    { title: "Browser", subtitle: "Client Interface", icon: Monitor, color: "text-blue-400 bg-blue-500/5 border-blue-500/20" },
    { title: "Next.js", subtitle: "Edge Proxy / SSR", icon: Server, color: "text-purple-400 bg-purple-500/5 border-purple-500/20" },
    { title: "API Routes", subtitle: "Serverless Endpoints", icon: Cpu, color: "text-orange-400 bg-orange-500/5 border-orange-500/20" },
    { title: "MongoDB", subtitle: "Database Store", icon: Database, color: "text-green-400 bg-green-500/5 border-green-500/20" },
    { title: "Admin Portal", subtitle: "Activity Auditing", icon: ShieldAlert, color: "text-red-400 bg-red-500/5 border-red-500/20" },
    { title: "Resend", subtitle: "Mail Dispatcher", icon: MailCheck, color: "text-teal-400 bg-teal-500/5 border-teal-500/20" },
    { title: "Turnstile", subtitle: "CAPTCHA Shield", icon: Globe, color: "text-pink-400 bg-pink-500/5 border-pink-500/20" }
  ];

  return (
    <Section
      title="Architecture Flow"
      subtitle="Visual representation of request lifecycle, database interactions, and integration layers."
    >
      <Card hoverEffect={false} className="p-8 bg-env-surface/30 border-env-border/20 select-none">
        
        {/* Horizontal flow on desktop, vertical on mobile */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;
            return (
              <React.Fragment key={idx}>
                {/* Node Box */}
                <div className="flex-1 flex flex-col items-center p-4.5 rounded-xl border border-env-border/40 bg-env-surface/50 backdrop-blur-xs text-center transition-all duration-300 hover:border-env-text/30 group">
                  <div className={`p-2.5 rounded-lg border mb-3 transition-transform duration-300 group-hover:scale-105 ${step.color}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h5 className="font-heading text-xs font-bold tracking-wide text-env-text">
                    {step.title}
                  </h5>
                  <p className="font-body text-[10px] text-env-muted mt-0.5 uppercase tracking-wider font-semibold">
                    {step.subtitle}
                  </p>
                </div>

                {/* Arrow Connector */}
                {!isLast && (
                  <div className="flex items-center justify-center p-1 text-env-muted/40 shrink-0">
                    {/* Desktop Right Arrow */}
                    <ArrowRight className="hidden lg:block h-4 w-4" />
                    {/* Mobile Down Arrow */}
                    <ArrowDown className="lg:hidden h-4 w-4 my-1" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

      </Card>
    </Section>
  );
}
