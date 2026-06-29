"use client";

import React from "react";
import { whyBuiltData } from "@/data/case-study";
import { Card } from "@/components/shared/Card";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { Compass, HelpCircle } from "lucide-react";

export default function WhyBuilt() {
  return (
    <Card 
      hoverEffect={false} 
      className="bg-env-surface/30 border-env-border/20 p-6 sm:p-8 flex flex-col justify-between space-y-6 h-full"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-env-text/5 rounded-xl border border-env-border/40 text-env-text shrink-0">
            <HelpCircle className="h-5 w-5" />
          </div>
          <h3 className="font-heading text-lg sm:text-xl font-bold tracking-wide text-env-text">
            {whyBuiltData.title}
          </h3>
        </div>
        
        <div className="space-y-4 text-xs sm:text-sm text-env-muted leading-relaxed font-body">
          {whyBuiltData.paragraphs.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      <ImagePlaceholder
        src={whyBuiltData.imagePath}
        alt="Why Built Night Camp Illustration"
        aspectRatioClass="aspect-video"
        title={whyBuiltData.placeholderLabel}
        subtitle={whyBuiltData.placeholderSubtitle}
        icon={Compass}
        className="border-env-border/30 shadow-lg mt-4"
      />
    </Card>
  );
}
