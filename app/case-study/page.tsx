"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Modular Case Study Sections
import Hero from "@/components/case-study/Hero";
import SceneShowcase from "@/components/case-study/SceneShowcase";
import WhyBuilt from "@/components/case-study/WhyBuilt";
import FeatureGrid from "@/components/case-study/FeatureGrid";
import TechStack from "@/components/case-study/TechStack";
import KeyCapabilities from "@/components/case-study/KeyCapabilities";
import DevelopmentJourney from "@/components/case-study/DevelopmentJourney";
import ArchitectureDiagram from "@/components/case-study/ArchitectureDiagram";
import PerformanceMetrics from "@/components/case-study/PerformanceMetrics";
import FinalCTA from "@/components/case-study/FinalCTA";
import MobileCompanion from "@/components/case-study/MobileCompanion";

export default function CaseStudyPage() {
  
  // Force "night" theme background and atmosphere layers on mount, restore on unmount
  useEffect(() => {
    const originalTheme = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", "night");

    return () => {
      if (originalTheme) {
        document.documentElement.setAttribute("data-theme", originalTheme);
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen z-10 pt-[calc(env(safe-area-inset-top)+2rem)] pb-12 bg-gradient-to-b from-[#0a0d1a] via-[#080b15] to-[#05060d] text-env-text overflow-hidden">
      
      {/* Ambient glow blobs backing the frosted cards */}
      <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] left-[25%] w-[600px] h-[600px] bg-indigo-500/5 blur-[180px] rounded-full pointer-events-none -z-10" />
      
      {/* 
        Outer Container:
        - Max width of 1400px for desktop
        - Breathing padding
      */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full">
        
        {/* Understated Header Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-env-muted hover:text-env-text transition-colors select-none group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Portfolio</span>
        </Link>

        {/* 
          Two-Column Grid Structure:
          - Main Content (Left): 9 columns wide on xl
          - Mobile Companion (Right): 3 columns wide on xl, hidden on smaller viewports
        */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start mt-4">
          
          {/* Main Case Study Content column */}
          <div className="xl:col-span-9 space-y-2">
            
            {/* 1. Hero Showcase */}
            <Hero />
            
            {/* 2. Scenes Showcase */}
            <SceneShowcase />
            
            {/* 3. Why Built & Features (side-by-side grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-10 md:py-16 border-b border-env-border/10">
              <WhyBuilt />
              <FeatureGrid />
            </div>
            
            {/* 4. Tech Stack Pills */}
            <TechStack />
            
            {/* 5. Key System Capabilities */}
            <KeyCapabilities />
            
            {/* 6. Timeline Journey */}
            <DevelopmentJourney />
            
            {/* 7. Architecture Diagram */}
            <ArchitectureDiagram />
            
            {/* 8. Performance Scores */}
            <PerformanceMetrics />
            
            {/* 9. Final CTA Footer Section */}
            <FinalCTA />

          </div>

          {/* Right: Sticky Mobile Companion column (Desktop only) */}
          <div className="xl:col-span-3 hidden xl:flex justify-end">
            <MobileCompanion />
          </div>

        </div>

      </div>
    </div>
  );
}
