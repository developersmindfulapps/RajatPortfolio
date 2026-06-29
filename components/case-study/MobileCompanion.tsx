"use client";

import React from "react";
import { 
  heroData, 
  scenesData, 
  whyBuiltData, 
  featuresData, 
  techStackData, 
  ctaData 
} from "@/data/case-study";
import * as Icons from "lucide-react";
import { GithubIcon } from "@/components/shared/Icons";
import Image from "next/image";

export default function MobileCompanion() {
  const getIcon = (iconName: string) => {
    const LucideIcon = (Icons as any)[iconName];
    return LucideIcon ? <LucideIcon className="h-3.5 w-3.5 text-env-text opacity-90" /> : null;
  };

  return (
    <div className="w-full flex flex-col select-none pt-2">
      
      {/* Column Title Header */}
      <div className="mb-4 pb-2 border-b border-env-border/10 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-env-muted">
          Mobile View
        </span>
        <Icons.Smartphone className="h-3.5 w-3.5 text-env-muted" />
      </div>

      {/* 
        Clean, Borderless Mobile Mockup Viewport:
        - Representing mobile screen layout directly as shown in the reference image
        - Rounded corners, subtle glass border, slightly darker bg
      */}
      <div 
        className="w-[280px] bg-zinc-950/60 border border-env-border/30 rounded-2xl overflow-hidden flex flex-col text-[11px] shadow-2xl font-body"
        style={{
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
        }}
      >
        
        {/* Mock Mobile Navigation Header */}
        <div className="h-11 px-4 flex items-center justify-between border-b border-env-border/10 bg-env-text/5 text-env-muted">
          <Icons.Menu className="h-4.5 w-4.5" />
          <Icons.Home className="h-4 w-4" />
        </div>

        {/* Scaled-down Mobile Page Flow */}
        <div className="p-4.5 space-y-7 overflow-y-auto max-h-[820px] custom-scrollbar">
          
          {/* 1. Mobile Hero Card */}
          <div className="space-y-3.5">
            <h4 className="font-heading text-[15px] font-extrabold tracking-tight text-env-text leading-tight">
              {heroData.title}
            </h4>
            <p className="text-[11px] text-env-muted leading-relaxed">
              I decided to showcase myself, and here is the product. A full-stack portfolio platform with interactive navigation, dynamic environments, recommendations, and secure controls.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <button className="h-8.5 rounded-lg bg-env-text text-zinc-950 font-bold uppercase tracking-widest text-[9px] flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-[0.98] transition-all">
                <span>Live Platform</span>
                <Icons.ExternalLink className="h-3 w-3" />
              </button>
              <button className="h-8.5 rounded-lg border border-env-border/40 text-env-text font-bold uppercase tracking-widest text-[9px] flex items-center justify-center gap-1.5 hover:bg-env-text/5 active:scale-[0.98] transition-all">
                <span>View Code</span>
                <GithubIcon className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* 2. Mobile Time Based Scenes Carousel */}
          <div className="space-y-3 pt-2 border-t border-env-border/10">
            <div>
              <span className="text-[7.5px] font-bold text-env-muted uppercase tracking-widest">
                User's Time Based Scenes
              </span>
              <p className="text-[9.5px] text-env-muted leading-snug mt-0.5">
                Swipe to explore scenes
              </p>
            </div>
            
            {/* Carousel Mock Card (Sunset scene shown as default flagship slide) */}
            <div className="rounded-xl border border-env-border/20 overflow-hidden bg-env-surface/40 relative">
              <div className="relative aspect-video w-full">
                <Image
                  src="/scenes/sunset/bg_desktop.avif"
                  alt="Mobile Carousel Sunset Mock"
                  fill
                  sizes="260px"
                  className="object-cover"
                />
              </div>
              <div className="p-3 space-y-1">
                <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-env-text">
                  Sunset
                </h5>
                <p className="text-[9.5px] text-env-muted leading-normal">
                  Warm, calm and beautiful hues.
                </p>
              </div>
            </div>

            {/* Slider Dots */}
            <div className="flex justify-center gap-1.5 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-env-muted/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-env-text" />
              <span className="w-1.5 h-1.5 rounded-full bg-env-muted/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-env-muted/40" />
            </div>
          </div>

          {/* 3. Mobile Why Build Card */}
          <div className="space-y-2.5 pt-2 border-t border-env-border/10">
            <h5 className="font-heading text-[10px] font-bold uppercase tracking-wider text-env-text">
              Why did I build this?
            </h5>
            <p className="text-[10px] text-env-muted leading-relaxed">
              I wanted more than a static portfolio. I wanted a platform that represents how I think, build and ship products.
            </p>
          </div>

          {/* 4. Mobile Features List */}
          <div className="space-y-3 pt-2 border-t border-env-border/10">
            <span className="text-[7.5px] font-bold text-env-muted uppercase tracking-widest">
              Features at a glance
            </span>
            <div className="grid grid-cols-2 gap-2">
              {featuresData.slice(0, 6).map((feat) => (
                <div key={feat.id} className="p-2.5 border border-env-border/20 rounded-lg bg-env-text/5 flex flex-col items-center text-center space-y-1">
                  {getIcon(feat.iconName)}
                  <span className="text-[8px] font-bold uppercase tracking-wider text-env-text truncate w-full">
                    {feat.title.split(" ").slice(0, 2).join(" ")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Mobile Tech Stack Tags */}
          <div className="space-y-2.5 pt-2 border-t border-env-border/10">
            <span className="text-[7.5px] font-bold text-env-muted uppercase tracking-widest">
              Tech Stack
            </span>
            <div className="flex flex-wrap gap-1.5">
              {techStackData.slice(0, 7).map((tech) => (
                <span key={tech} className="px-2 py-1 rounded bg-env-text/5 border border-env-border/30 text-[8px] uppercase tracking-wider text-env-text font-semibold">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* 6. Mobile CTA Card */}
          <div className="rounded-xl border border-env-border/20 overflow-hidden bg-env-surface/40 relative p-4 space-y-3 text-center">
            <h5 className="font-heading text-[10.5px] font-bold text-env-text uppercase">
              Always evolving. Always improving.
            </h5>
            <p className="text-[9px] text-env-muted leading-relaxed">
              This platform is a work in progress and will continue to grow.
            </p>
            <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-env-border/30">
              <Image
                src="/scenes/sunset/bg_desktop.avif"
                alt="Mobile Footer Panorama Mock"
                fill
                sizes="230px"
                className="object-cover"
              />
            </div>
          </div>

        </div>

        {/* Dummy Bottom bar */}
        <div className="h-4.5 w-full bg-zinc-950 flex items-center justify-center shrink-0 border-t border-zinc-900">
          <div className="w-20 h-0.5 bg-zinc-700 rounded-full" />
        </div>

      </div>

    </div>
  );
}
