"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Briefcase, 
  Cpu, 
  Layers, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  MapPin, 
  ArrowRight,
  Code2,
  TrendingUp,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  Bot
} from "lucide-react";
import { Card } from "@/components/shared/Card";
import { Transition } from "@/components/shared/Transition";
import { SceneSelector } from "@/components/navigation/SceneSelector";
import { trackPageView } from "@/lib/analytics";

interface WorkExperience {
  id: string;
  role: string;
  company: string;
  clientNote?: string;
  period: string;
  location: string;
  scope: string;
  summaryHighlights: string[];
  expandedHighlights: string[];
  tags: string[];
}

const EXPERIENCES: WorkExperience[] = [
  {
    id: "netcracker",
    role: "Software Engineer",
    company: "Netcracker",
    period: "12/2024 – 08/2026",
    location: "Gurgaon",
    scope: "Developer Tooling & Low-Code Platform Extension",
    summaryHighlights: [
      "Designed and developed an Angular-based VS Code extension for a commercial low-code platform, enabling developers to create and manage UI and application configurations through YAML and JSON.",
      "Reduced production frontend bundle size by 35% through lazy-loading improvements, dependency cleanup, and optimization of shared library usage.",
      "Built 10–15 reusable Angular components using Signals and shared services, implementing local and shared state management, computed state, and component communication using input(), output(), and model()."
    ],
    expandedHighlights: [
      "Owned 5+ features from requirements through production delivery, including technical design, implementation, debugging, and peer review.",
      "Integrated TypeScript-based Data API and validation modules as reusable npm libraries and worked with VS Code APIs for extension communication and functionality."
    ],
    tags: ["Angular", "Angular Signals", "TypeScript", "VS Code APIs", "YAML/JSON", "npm Libraries", "State Management", "Lazy Loading"]
  },
  {
    id: "capgemini",
    role: "Software Engineer",
    company: "Capgemini — Client: Tata Communications",
    period: "08/2021 – 10/2024",
    location: "Remote, Gurgaon",
    scope: "Enterprise Billing, Analytics & Telecom Operations Platforms",
    summaryHighlights: [
      "Built enterprise billing and analytics applications supporting 5,000+ internal users and 100,000+ monthly page hits, using Angular, RxJS, REST APIs, AG Grid, and Highcharts.",
      "Independently implemented AG Grid for data-intensive workflows, replacing traditional Bootstrap-based tables and integrating server-side filtering, sorting, and offset-based pagination for datasets exceeding 1M records.",
      "Developed a reusable configuration-driven Angular UI where JSON configurations dynamically controlled page structure and behavior."
    ],
    expandedHighlights: [
      "Developed 15+ reusable components and integrated Keycloak for secure authentication and access management.",
      "Contributed to frontend architecture and technical discussions, collaborated with backend teams on data contracts, and independently evaluated and introduced Highcharts for application data visualization.",
      "Contributed substantially to the frontend development of an internal telecom monitoring and troubleshooting tool using React, Material UI, Highcharts, REST APIs, and React Flow.",
      "Mentored 3 developers and supported frontend implementation and technical problem-solving across the team."
    ],
    tags: ["Angular", "React", "AG Grid", "Highcharts", "RxJS", "React Flow", "Keycloak", "Material UI", "REST APIs", "Configuration-Driven UI"]
  },
  {
    id: "infosys",
    role: "System Engineer Trainee → Senior Software Developer",
    company: "Infosys",
    period: "05/2018 – 07/2021",
    location: "Remote, Chandigarh",
    scope: "INTAP (Recruitment & Talent Acquisition) • CSTR (Banking & Finance)",
    summaryHighlights: [
      "Progressed from System Engineer Trainee to Senior Software Developer, taking increasing ownership of frontend features and delivery.",
      "Developed independently deployable microfrontends and owned recruitment workflows from job application through offer release, reducing manual operational work by approximately 40%.",
      "Built custom banking workflows using React, Redux, GraphQL, and Material UI; reduced signup-to-onboarding interactions by approximately 20% and implemented WCAG 2.0 accessibility improvements."
    ],
    expandedHighlights: [
      "Built 5+ reusable UI components and integrated jsPDF to automate offer-letter generation.",
      "Reduced production frontend bundle size from 12 MB to 6.8 MB (43% reduction), while maintaining 90+ Lighthouse scores and clean SonarQube standards.",
      "Integrated GraphQL queries and created custom frontend request objects for backend data operations."
    ],
    tags: ["Microfrontends", "React", "Redux", "GraphQL", "Material UI", "jsPDF", "WCAG 2.0", "SonarQube", "Performance Optimization"]
  }
];

import { SKILL_GROUPS, FAMILIAR_WITH } from "@/lib/skills";

export default function ExperiencePage() {
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    trackPageView("experience");
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedJobs((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="experience-page-container h-[100dvh] overflow-y-auto overflow-x-hidden w-full flex flex-col items-center justify-start p-6 md:p-12 lg:p-16 relative z-10 pt-[calc(env(safe-area-inset-top)+7rem)] custom-scrollbar">
      <SceneSelector className="absolute top-[calc(env(safe-area-inset-top)+1rem)] left-1/2 -translate-x-1/2 md:fixed md:top-6 md:right-6 md:left-auto md:translate-x-0" />
      
      {/* Top Navigation Row */}
      <Transition type="fade" duration={0.6} className="w-full max-w-4xl">
        <div className="flex flex-row items-center justify-between gap-4 w-full mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-exp-card-border bg-exp-card-bg backdrop-blur-xs px-4 py-2 text-xs font-bold uppercase tracking-wider text-exp-heading hover:bg-exp-card-bg/80 hover:border-exp-heading transition-all duration-[250ms] ease-in-out select-none hover:scale-[1.02] focus:ring-2 focus:ring-exp-card-border focus:ring-offset-2 outline-none"
          >
            <ArrowLeft className="h-4 w-4" />
            {"Back to Portfolio"}
          </Link>
          <a
            href="/cv/RajatDeep_Singh_Resume_August.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-exp-btn-bg px-4 py-2 text-xs font-bold uppercase tracking-wider text-exp-btn-text hover:opacity-90 transition-all duration-[250ms] ease-in-out select-none shadow-xs hover:scale-[1.02] focus:ring-2 focus:ring-exp-btn-bg focus:ring-offset-2 outline-none"
          >
            {"View Resume"}
          </a>
        </div>
      </Transition>

      <div className="max-w-4xl w-full space-y-12 pb-16">
        
        {/* Hero Section */}
        <Transition type="slide-up" delay={0.1} duration={0.6} className="space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-exp-secondary">
              Career & Engineering Track Record
            </span>
            <h1 className="text-2xl md:text-5xl font-bold tracking-wide text-exp-heading uppercase font-heading text-shadow-env leading-tight">
              {"Enterprise Frontend Engineering"}
            </h1>
          </div>
          <p className="text-sm md:text-base text-exp-body font-medium tracking-wide text-shadow-env max-w-3xl leading-relaxed">
            {"Senior Frontend Engineer with 8+ years of experience building enterprise-scale applications, microfrontends, data-intensive interfaces, and developer tooling across multiple industries."}
          </p>

          {/* Stats Badges Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
            {[
              "8+ Years Experience",
              "Netcracker • Capgemini • Infosys",
              "Microfrontends & Tooling",
              "Angular • React • TypeScript",
            ].map((stat) => (
              <div
                key={stat}
                className="rounded-xl border border-exp-card-border bg-exp-card-bg backdrop-blur-xs px-3 py-3.5 text-center text-[10px] md:text-xs font-bold uppercase tracking-wider text-exp-heading shadow-xs select-none flex items-center justify-center"
              >
                {stat}
              </div>
            ))}
          </div>

          {/* Tech Recognition Sub-line */}
          <div className="text-center md:text-left text-xs md:text-sm text-exp-secondary font-bold tracking-wider pt-2 select-none">
            {"Angular Signals • React • TypeScript • RxJS • AG Grid • Highcharts • Microfrontends"}
          </div>
        </Transition>

        {/* Core Technical Focus Section */}
        <Transition type="slide-up" delay={0.2} duration={0.6} className="space-y-4">
          <div className="border-b border-exp-card-border pb-2 flex items-center justify-between">
            <h2 className="text-base font-bold tracking-widest text-exp-heading uppercase font-heading">
              {"Core Technical Focus"}
            </h2>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-exp-secondary">
              Architectural Strengths
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card hoverEffect={false} className="p-5 bg-exp-card-bg border-exp-card-border space-y-2">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-exp-heading" />
                <h4 className="font-bold text-exp-heading text-xs uppercase tracking-wider font-heading">
                  {"Developer Tooling & Extensions"}
                </h4>
              </div>
              <p className="text-xs text-exp-body leading-relaxed font-body">
                {"Designed Angular-based VS Code extensions for commercial low-code platforms to manage UI and configurations via YAML/JSON, interfacing with VS Code APIs and reusable npm packages."}
              </p>
            </Card>

            <Card hoverEffect={false} className="p-5 bg-exp-card-bg border-exp-card-border space-y-2">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-exp-heading" />
                <h4 className="font-bold text-exp-heading text-xs uppercase tracking-wider font-heading">
                  {"Data-Intensive Interfaces & Viz"}
                </h4>
              </div>
              <p className="text-xs text-exp-body leading-relaxed font-body">
                {"Implemented AG Grid with server-side filtering, sorting, and offset pagination for 1M+ record datasets, paired with Highcharts and React Flow for complex telecom monitoring."}
              </p>
            </Card>

            <Card hoverEffect={false} className="p-5 bg-exp-card-bg border-exp-card-border space-y-2">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-exp-heading" />
                <h4 className="font-bold text-exp-heading text-xs uppercase tracking-wider font-heading">
                  {"Microfrontends & State Architecture"}
                </h4>
              </div>
              <p className="text-xs text-exp-body leading-relaxed font-body">
                {"Built independently deployable microfrontends, configuration-driven UIs, and modern signal-based state management using input(), output(), and model() primitives."}
              </p>
            </Card>

            <Card hoverEffect={false} className="p-5 bg-exp-card-bg border-exp-card-border space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-exp-heading" />
                <h4 className="font-bold text-exp-heading text-xs uppercase tracking-wider font-heading">
                  {"Performance & Bundle Optimization"}
                </h4>
              </div>
              <p className="text-xs text-exp-body leading-relaxed font-body">
                {"Optimized web runtimes and reduced production bundle sizes by 35%–43% through lazy loading, dependency cleanup, and maintaining 90+ Lighthouse and clean SonarQube standards."}
              </p>
            </Card>
          </div>
        </Transition>

        {/* Professional Experience Timeline */}
        <Transition type="slide-up" delay={0.3} duration={0.6} className="space-y-6">
          <div className="border-b border-exp-card-border pb-2 flex items-center justify-between">
            <h2 className="text-base font-bold tracking-widest text-exp-heading uppercase font-heading">
              {"Professional Experience"}
            </h2>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-exp-secondary">
              Chronological Track Record
            </span>
          </div>

          <div className="space-y-6">
            {EXPERIENCES.map((job) => {
              const isExpanded = expandedJobs[job.id] || false;
              return (
                <Card 
                  key={job.id} 
                  hoverEffect={false} 
                  className="p-6 md:p-7 bg-exp-card-bg border-exp-card-border space-y-5 transition-all duration-300"
                >
                  {/* Job Header */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 border-b border-exp-card-border/40 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-exp-heading shrink-0" />
                        <h3 className="font-bold text-exp-heading text-base uppercase tracking-wider font-heading">
                          {job.company}
                        </h3>
                      </div>
                      <p className="text-xs md:text-sm font-semibold text-exp-heading/90 font-heading">
                        {job.role}
                      </p>
                      <p className="text-[11px] text-exp-secondary font-medium">
                        {job.scope}
                      </p>
                    </div>

                    <div className="flex flex-wrap md:flex-col items-start md:items-end gap-x-4 gap-y-1 text-[11px] text-exp-secondary shrink-0 select-none">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {job.period}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                    </div>
                  </div>

                  {/* Core Highlights (Always Visible) */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-exp-secondary select-none">
                      Key Highlights & Architecture:
                    </span>
                    <ul className="text-xs md:text-sm text-exp-body space-y-2.5 font-body pl-1">
                      {job.summaryHighlights.map((highlight, idx) => (
                        <li key={idx} className="leading-relaxed flex items-start gap-2">
                          <span className="text-exp-heading shrink-0 font-bold">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Expanded Highlights (Collapsible) */}
                  {isExpanded && (
                    <div className="space-y-2.5 pt-2 border-t border-exp-card-border/30 animate-fade-in">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-exp-secondary select-none">
                        Additional Responsibilities & Delivery:
                      </span>
                      <ul className="text-xs md:text-sm text-exp-body space-y-2.5 font-body pl-1">
                        {job.expandedHighlights.map((highlight, idx) => (
                          <li key={idx} className="leading-relaxed flex items-start gap-2">
                            <span className="text-exp-heading shrink-0 font-bold">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Footer Row: Tags + Expand Toggle */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-exp-card-border/30">
                    <div className="flex flex-wrap gap-1.5 max-w-xl">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] md:text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md border border-exp-card-border bg-exp-card-bg text-exp-secondary select-none"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => toggleExpand(job.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-exp-heading hover:text-white transition-colors cursor-pointer select-none self-start sm:self-center shrink-0 py-1"
                    >
                      <span>{isExpanded ? "View Less" : "View More Details"}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </Transition>

        {/* Technical Skills Categorized Grid */}
        <Transition type="slide-up" delay={0.4} duration={0.6} className="space-y-4">
          <div className="border-b border-exp-card-border pb-2 flex items-center justify-between">
            <h2 className="text-base font-bold tracking-widest text-exp-heading uppercase font-heading">
              {"Technical Skills"}
            </h2>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-exp-secondary">
              Categorized Stack
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {SKILL_GROUPS.map((group) => {
              const getIcon = (id: string) => {
                switch (id) {
                  case "frontend-core": return Code2;
                  case "state-architecture": return Layers;
                  case "ui-dataviz": return Sliders;
                  case "apis-backend": return Cpu;
                  case "data-cloud": return Briefcase;
                  case "testing-delivery": return ShieldCheck;
                  case "ai-assisted": return Bot;
                  default: return Code2;
                }
              };
              const Icon = getIcon(group.id);

              return (
                <Card 
                  key={group.id} 
                  hoverEffect={false} 
                  className="p-5 bg-exp-card-bg border-exp-card-border space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-exp-heading" />
                    <h4 className="font-bold text-exp-heading text-xs uppercase tracking-wider font-heading">
                      {group.title}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-md border border-exp-card-border bg-exp-card-bg text-exp-heading select-none"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Also Familiar With (Visually Separate) */}
          <div className="rounded-xl border border-exp-card-border/60 bg-exp-card-bg/40 p-4 space-y-2 select-none">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-exp-secondary" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-exp-secondary">
                Also familiar with
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {FAMILIAR_WITH.map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] font-medium tracking-wider px-2.5 py-1 rounded-md border border-exp-card-border/40 bg-exp-card-bg/30 text-exp-secondary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </Transition>

        {/* Project & Case Study Call-to-Action Card */}
        <Transition type="slide-up" delay={0.5} duration={0.6}>
          <Card hoverEffect={false} className="p-6 md:p-8 bg-exp-card-bg border-exp-card-border text-center space-y-5">
            <div className="max-w-2xl mx-auto space-y-2">
              <h3 className="font-bold text-base md:text-lg uppercase tracking-wider text-exp-heading font-heading">
                {"See Production Architecture in Action"}
              </h3>
              <p className="text-xs md:text-sm text-exp-body font-body leading-relaxed">
                {"Explore the complete product case study of this platform—featuring real-time event analytics, edge session verification, tokenized recommendations, and dynamic environment shaders."}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/case-study"
                className="inline-flex items-center gap-2 rounded-lg bg-exp-btn-bg px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-exp-btn-text hover:opacity-90 transition-all duration-[250ms] ease-in-out select-none shadow-xs hover:scale-[1.02] focus:ring-2 focus:ring-exp-btn-bg outline-none"
              >
                <span>View Portfolio Case Study</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg border border-exp-card-border bg-exp-card-bg px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-exp-heading hover:bg-exp-card-bg/80 transition-all duration-[250ms] ease-in-out select-none hover:scale-[1.02] outline-none"
              >
                <span>Back to Home</span>
              </Link>
            </div>
          </Card>
        </Transition>

      </div>

      {/* Simple Understated Footer */}
      <footer className="mt-8 text-center text-[10px] uppercase tracking-widest text-exp-secondary select-none pb-safe">
        {"Rajat Deep Singh • Senior Frontend Engineer"}
      </footer>
    </div>
  );
}
