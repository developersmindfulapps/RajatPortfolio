"use client";

import React from "react";
import { heroData } from "@/data/case-study";
import { Button } from "@/components/shared/Button";
import { GithubIcon } from "@/components/shared/Icons";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  // Constellation node coordinates
  const nodes = [
    { label: "RECOMMENDATIONS", x: "50%", y: "15%" },
    { label: "PROJECTS", x: "74%", y: "28%" },
    { label: "SKILLS", x: "72%", y: "65%" },
    { label: "CONTACT", x: "50%", y: "85%" },
    { label: "WORK WITH ME", x: "28%", y: "68%" },
    { label: "ABOUT", x: "26%", y: "30%" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-10 md:py-16 border-b border-env-border/10">
      
      {/* Left: Text Content & CTAs */}
      <div className="lg:col-span-6 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-env-border/40 bg-env-text/5 text-[9px] font-bold uppercase tracking-widest text-env-muted select-none">
          {heroData.label}
        </div>
        
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-env-text leading-[1.1]">
          {heroData.title}
        </h1>
        
        <div className="space-y-4 text-xs sm:text-sm text-env-muted leading-relaxed font-body">
          {heroData.description.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <Button
            onClick={() => window.open(heroData.liveLink, "_self")}
            className="flex items-center gap-2 h-10.5 px-5 text-xs font-bold uppercase tracking-widest"
          >
            Live Platform
            <ExternalLink className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.open(heroData.codeLink, "_blank")}
            className="flex items-center gap-2 h-10.5 px-5 text-xs font-bold uppercase tracking-widest border-env-border/60"
          >
            View Code
            <GithubIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Right: Actual visual constellation representation overlaying the Sunset environment background */}
      <div className="lg:col-span-6 relative group select-none w-full aspect-video rounded-2xl overflow-hidden border border-env-border/30 bg-zinc-950">
        
        {/* Soft environmental backdrop glow */}
        <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full -z-10 scale-95 opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Actual Sunset background image */}
        <Image
          src="/scenes/sunset/bg_desktop.avif"
          alt="Sunset Scene Background"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover opacity-85"
        />

        {/* Dynamic SVG Constellation Overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            {/* Connecting lines from center to outer nodes */}
            <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="50%" y1="50%" x2="74%" y2="28%" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="50%" y1="50%" x2="72%" y2="65%" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="50%" y1="50%" x2="28%" y2="68%" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="50%" y1="50%" x2="26%" y2="30%" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
          </svg>

          {/* Outer Nodes */}
          {nodes.map((node, index) => (
            <div 
              key={index}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5"
              style={{ left: node.x, top: node.y }}
            >
              {/* Outer pulsing node circle */}
              <div className="w-2.5 h-2.5 rounded-full bg-orange-400 border border-white/40 shadow-[0_0_8px_rgba(251,146,60,0.8)] relative animate-pulse" />
              <span className="text-[7px] font-bold text-white/90 bg-black/60 px-1.5 py-0.5 rounded-md backdrop-blur-xs tracking-wider border border-white/10 uppercase">
                {node.label}
              </span>
            </div>
          ))}

          {/* Center Explore Node */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border border-white/20 bg-black/55 backdrop-blur-md flex flex-col items-center justify-center p-2 text-center shadow-lg transition-transform duration-300 hover:scale-105">
              <span className="text-[8px] font-bold text-white tracking-widest uppercase">Explore</span>
              <span className="text-[6px] text-white/50 tracking-wider uppercase font-semibold">Portfolio</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

