"use client";

import React from "react";
import { Section } from "@/components/shared/Section";
import { scenesData } from "@/data/case-study";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { Card } from "@/components/shared/Card";
import { Sunrise, Sunset, Sun, Moon } from "lucide-react";

export default function SceneShowcase() {
  const getSceneIcon = (id: string) => {
    switch (id) {
      case "day": return Sun;
      case "sunset": return Sunset;
      case "night": return Moon;
      case "sunrise": return Sunrise;
      default: return Sun;
    }
  };

  return (
    <Section
      title="User's Time Based Scenes"
      subtitle="Nobody likes staring at the same background. Enjoy dynamic scene transitions loaded automatically according to your timezone."
    >
      {/* 
        Responsive Layout Grid:
        - Mobile: horizontal scroll snap carousel
        - Tablet: 2x2 grid
        - Desktop: 4 columns
      */}
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory pb-4 md:pb-0 scroll-smooth custom-scrollbar select-none">
        {scenesData.map((scene) => (
          <Card
            key={scene.id}
            hoverEffect={true}
            className="min-w-[80vw] sm:min-w-[45vw] md:min-w-0 snap-center bg-env-surface/30 border-env-border/20 p-4.5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <ImagePlaceholder
                src={scene.imagePath}
                alt={`${scene.title} Atmosphere Screenshot`}
                aspectRatioClass="aspect-video"
                title={scene.title}
                subtitle={scene.placementLabel}
                icon={getSceneIcon(scene.id)}
                className="border-env-border/30 shadow-md"
              />
              <div className="px-1.5 space-y-1">
                <h4 className="font-heading text-xs font-bold tracking-wide text-env-text flex items-center gap-1.5 uppercase">
                  <span>{scene.title}</span>
                </h4>
                <p className="font-body text-[10px] text-env-muted tracking-wider uppercase font-semibold">
                  {scene.subtitle}
                </p>
                <p className="font-body text-xs text-env-muted leading-relaxed pt-1.5">
                  {scene.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
