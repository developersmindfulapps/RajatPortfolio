"use client";

import React from "react";
import { Section } from "@/components/shared/Section";
import { techStackData } from "@/data/case-study";
import { Code2 } from "lucide-react";

export default function TechStack() {
  return (
    <Section
      title="Tech Stack"
      subtitle="Built with modern technologies and industry best practices."
    >
      <div className="flex flex-wrap gap-2.5 max-w-4xl select-none">
        {techStackData.map((tech) => (
          <div
            key={tech}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-env-border/30 bg-env-surface/40 backdrop-blur-xs text-xs font-bold uppercase tracking-wider text-env-text hover:bg-env-surface hover:border-env-text/30 transition-all duration-300"
          >
            <Code2 className="h-3.5 w-3.5 text-env-muted" />
            <span>{tech}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
