"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/shared/Card";
import { LinkedinIcon } from "@/components/shared/Icons";
import { Reference } from "@/types/reference";
import { cn } from "@/lib/utils";

interface RecommendationsPanelProps {
  references: Reference[];
  loading: boolean;
}

export function RecommendationsPanel({ references, loading }: RecommendationsPanelProps) {
  // Store expanded state per recommendation card
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDate = (dateInput: Date | string) => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3">
        <svg className="animate-spin h-5 w-5 text-env-text/50" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs text-env-muted tracking-wider uppercase font-semibold">
          Loading recommendations...
        </span>
      </div>
    );
  }

  if (references.length === 0) {
    return (
      <div className="text-center py-10 px-6 border border-dashed border-env-border/30 rounded-2xl bg-env-text/5">
        <h4 className="text-sm font-bold text-env-text font-heading uppercase tracking-wider mb-2">
          No recommendations yet
        </h4>
        <p className="text-xs text-env-muted font-body leading-relaxed max-w-sm mx-auto">
          {"I'm grateful to everyone I've had the opportunity to work with."}
        </p>
        <p className="text-xs text-env-muted font-body leading-relaxed max-w-sm mx-auto mt-1">
          {"This space will gradually grow with recommendations from clients, managers, and colleagues."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {references.map((ref) => {
        const isLong = ref.comment.length > 250;
        const isExpanded = !!expandedIds[ref.publicId];

        return (
          <Card
            key={ref.publicId}
            hoverEffect={false}
            className="p-5 bg-env-text/5 border-env-border/50 flex flex-col gap-3.5"
          >
            {/* Rating Stars */}
            <div className="flex items-center">
              <div className="flex gap-0.5 text-amber-500/90 select-none">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current text-amber-500/95" />
                ))}
              </div>
            </div>

            {/* Comment Body with line clamping */}
            <div className="flex flex-col">
              <p
                className={cn(
                  "text-xs text-env-muted leading-relaxed font-body whitespace-pre-line transition-all duration-200",
                  isLong && !isExpanded && "line-clamp-6"
                )}
              >
                {ref.comment}
              </p>
              {isLong && (
                <button
                  onClick={() => toggleExpand(ref.publicId)}
                  className="text-[10px] uppercase font-bold tracking-wider text-env-text/70 hover:text-env-text transition-colors mt-2 self-start cursor-pointer select-none focus:outline-none"
                >
                  {isExpanded ? "Show Less" : "Read More"}
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="h-[1px] w-full bg-env-border/20" />

            {/* Recommender Info and Date */}
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-bold text-env-text text-xs uppercase tracking-wider">
                  {ref.name}
                </span>
                {ref.company && (
                  <span className="text-[10px] text-env-muted uppercase tracking-wider font-semibold">
                    @ {ref.company}
                  </span>
                )}
                <span className="px-1.5 py-0.5 rounded bg-env-text/5 border border-env-border/20 text-[9px] font-bold uppercase tracking-widest text-env-text/60 select-none">
                  {ref.relationship === "coworker" ? "Co-worker" : ref.relationship === "manager" ? "Manager" : "Client"}
                </span>
                {ref.linkedin && (
                  <a
                    href={ref.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-env-muted hover:text-env-text transition-colors duration-200 ml-1 hover:scale-[1.05]"
                    aria-label={`${ref.name}'s LinkedIn profile`}
                    title="LinkedIn Profile"
                  >
                    <LinkedinIcon className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
              
              {/* Submission Month & Year */}
              <span className="text-[9px] uppercase tracking-widest text-env-muted/60 select-none font-semibold">
                {formatDate(ref.createdAt)}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
