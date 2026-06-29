"use client";

import React from "react";
import { ctaData } from "@/data/case-study";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { Compass, ExternalLink } from "lucide-react";

export default function FinalCTA() {
  return (
    <div className="py-10 md:py-16">
      <Card 
        hoverEffect={false} 
        className="bg-env-surface/40 border-env-border/20 p-8 sm:p-12 md:p-16 text-center space-y-8 relative overflow-hidden backdrop-blur-md"
      >
        {/* Decorative subtle background overlay glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full -z-10 pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-env-text">
            {ctaData.title}
          </h3>
          <p className="font-body text-xs sm:text-sm text-env-muted leading-relaxed">
            {ctaData.description}
          </p>
        </div>

        <div className="pt-2">
          <Button
            onClick={() => window.open("/", "_self")}
            className="inline-flex items-center gap-2 h-11 px-6 text-xs font-bold uppercase tracking-widest mx-auto"
          >
            {ctaData.buttonLabel}
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        {/* Panoramic Landscape Placeholder Beneath */}
        <div className="pt-8">
          <ImagePlaceholder
            src={ctaData.imagePath}
            alt="CTA Panoramic Night Landscape"
            aspectRatioClass="aspect-[21/9] sm:aspect-[2.39/1]"
            title={ctaData.placeholderLabel}
            subtitle={ctaData.placeholderSubtitle}
            icon={Compass}
            className="border-env-border/30 shadow-2xl"
          />
        </div>
      </Card>
    </div>
  );
}
