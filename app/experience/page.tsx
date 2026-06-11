"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, Cpu, Users, ClipboardList } from "lucide-react";
import { Card } from "@/components/shared/Card";
import { Transition } from "@/components/shared/Transition";
import { SceneSelector } from "@/components/navigation/SceneSelector";

export default function ExperiencePage() {
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
            href="/cv/RajatCvJune.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-exp-btn-bg px-4 py-2 text-xs font-bold uppercase tracking-wider text-exp-btn-text hover:opacity-90 transition-all duration-[250ms] ease-in-out select-none shadow-xs hover:scale-[1.02] focus:ring-2 focus:ring-exp-btn-bg focus:ring-offset-2 outline-none"
          >
            {"View Resume"}
          </a>
        </div>
      </Transition>

      <div className="max-w-4xl w-full space-y-10 pb-16">
        
        {/* Hero Section */}
        <Transition type="slide-up" delay={0.1} duration={0.6} className="space-y-4">
          <h1 className="text-2xl md:text-5xl font-bold tracking-wide text-exp-heading uppercase font-heading text-shadow-env leading-tight">
            {"Enterprise Frontend Engineering"}
          </h1>
          <p className="text-sm md:text-base text-exp-body font-medium tracking-wide text-shadow-env max-w-3xl leading-relaxed">
            {"Building scalable frontend applications that power enterprise workflows and large-scale business platforms."}
          </p>

          {/* Stats Badges Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
            {[
              "8+ Years Experience",
              "Fortune 500 Projects",
              "Enterprise Platforms",
              "Frontend Specialist",
            ].map((stat) => (
              <div
                key={stat}
                className="rounded-xl border border-exp-card-border bg-exp-card-bg backdrop-blur-xs px-3 py-3.5 text-center text-[10px] md:text-xs font-bold uppercase tracking-wider text-exp-heading shadow-xs select-none"
              >
                {stat}
              </div>
            ))}
          </div>

          {/* Tech Recognition Sub-line */}
          <div className="text-center md:text-left text-xs md:text-sm text-exp-secondary font-bold tracking-wider pt-2 select-none">
            {"Angular • TypeScript • RxJS • Node.js"}
          </div>
        </Transition>

        {/* What I Do Section */}
        <Transition type="slide-up" delay={0.2} duration={0.6} className="space-y-4">
          <h2 className="text-base font-bold tracking-widest text-exp-heading uppercase font-heading border-b border-exp-card-border pb-2">
            {"What I Do"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card hoverEffect={false} className="p-5 bg-exp-card-bg border-exp-card-border space-y-2">
              <h4 className="font-bold text-exp-heading text-xs uppercase tracking-wider font-heading">{"Feature Development"}</h4>
              <p className="text-xs text-exp-body leading-relaxed font-body">
                {"Delivering complex, robust, and end-to-end frontend capabilities from the ground up."}
              </p>
            </Card>
            <Card hoverEffect={false} className="p-5 bg-exp-card-bg border-exp-card-border space-y-2">
              <h4 className="font-bold text-exp-heading text-xs uppercase tracking-wider font-heading">{"Architecture & Design"}</h4>
              <p className="text-xs text-exp-body leading-relaxed font-body">
                {"Designing modular component libraries and scalable software layout architectures."}
              </p>
            </Card>
            <Card hoverEffect={false} className="p-5 bg-exp-card-bg border-exp-card-border space-y-2">
              <h4 className="font-bold text-exp-heading text-xs uppercase tracking-wider font-heading">{"Performance Optimization"}</h4>
              <p className="text-xs text-exp-body leading-relaxed font-body">
                {"Auditing rendering bottlenecks, preloading assets, and tuning web runtime efficiency."}
              </p>
            </Card>
            <Card hoverEffect={false} className="p-5 bg-exp-card-bg border-exp-card-border space-y-2">
              <h4 className="font-bold text-exp-heading text-xs uppercase tracking-wider font-heading">{"Team Collaboration"}</h4>
              <p className="text-xs text-exp-body leading-relaxed font-body">
                {"Conducting code reviews, mentoring developers, and aligning visual designs with business goals."}
              </p>
            </Card>
          </div>
        </Transition>

        {/* Technologies Badges */}
        <Transition type="slide-up" delay={0.3} duration={0.6} className="space-y-4">
          <h2 className="text-base font-bold tracking-widest text-exp-heading uppercase font-heading border-b border-exp-card-border pb-2">
            {"Technologies"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              "Angular", "TypeScript", "RxJS", "JavaScript", "Node.js", "REST APIs", "Git", "CI/CD"
            ].map((tech) => (
              <span
                key={tech}
                className="text-[10px] md:text-xs uppercase font-bold tracking-wider px-3.5 py-1.5 rounded-lg border border-exp-card-border bg-exp-card-bg text-exp-heading shadow-xs select-none"
              >
                {tech}
              </span>
            ))}
          </div>
        </Transition>

        {/* Experience Highlights */}
        <Transition type="slide-up" delay={0.4} duration={0.6} className="space-y-4">
          <h2 className="text-base font-bold tracking-widest text-exp-heading uppercase font-heading border-b border-exp-card-border pb-2">
            {"Experience Highlights"}
          </h2>
          <ul className="text-xs md:text-sm text-exp-body space-y-3 font-body pl-1">
            <li>• {"Designed and implemented enterprise-scale frontend features."}</li>
            <li>• {"Worked on applications supporting large business workflows."}</li>
            <li>• {"Built reusable component systems and shared UI libraries."}</li>
            <li>• {"Optimized application performance and maintainability."}</li>
            <li>• {"Mentored developers and participated in code reviews."}</li>
          </ul>
        </Transition>

        {/* Detailed Experience Overview */}
        <Transition type="slide-up" delay={0.5} duration={0.6} className="space-y-4">
          <h2 className="text-base font-bold tracking-widest text-exp-heading uppercase font-heading border-b border-exp-card-border pb-2">
            {"Detailed Experience Overview"}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Enterprise Experience Card */}
            <Card hoverEffect={false} className="p-6 bg-exp-card-bg border-exp-card-border space-y-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-exp-heading" />
                <h3 className="font-bold text-exp-heading text-xs uppercase tracking-wider font-heading">
                  {"Enterprise Experience"}
                </h3>
              </div>
              <p className="text-xs text-exp-body leading-relaxed font-body">
                {"Worked on enterprise-grade applications serving large organizations and business-critical workflows. Experienced in translating complex business requirements into scalable, robust code architectures that operate under high-availability environments."}
              </p>
            </Card>

            {/* Responsibilities Card */}
            <Card hoverEffect={false} className="p-6 bg-exp-card-bg border-exp-card-border space-y-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-exp-heading" />
                <h3 className="font-bold text-exp-heading text-xs uppercase tracking-wider font-heading">
                  {"Responsibilities"}
                </h3>
              </div>
              <ul className="text-xs text-exp-body space-y-1.5 font-body pl-1">
                <li>• {"Led frontend feature development across multiple development cycles."}</li>
                <li>• {"Mentored junior developers and helped align engineering practices."}</li>
                <li>• {"Conducted thorough code reviews and technical architecture validations."}</li>
                <li>• {"Collaborated with cross-functional teams including product and UX design."}</li>
                <li>• {"Converted business requirements into maintainable, modular software."}</li>
                <li>• {"Improved codebase reliability and overall runtime performance."}</li>
              </ul>
            </Card>

            {/* Technical Focus Card */}
            <Card hoverEffect={false} className="p-6 bg-exp-card-bg border-exp-card-border space-y-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-exp-heading" />
                <h3 className="font-bold text-exp-heading text-xs uppercase tracking-wider font-heading">
                  {"Technical Focus"}
                </h3>
              </div>
              <ul className="text-xs text-exp-body space-y-1.5 font-body pl-1">
                <li>• {"Angular Architecture & Lifecycle Management"}</li>
                <li>• {"TypeScript & Clean Code Development"}</li>
                <li>• {"Component Library Design & Design Systems"}</li>
                <li>• {"Performance Audits & Layout Rendering Optimizations"}</li>
                <li>• {"Scalable Enterprise UI Systems & CSS Layout Architectures"}</li>
                <li>• {"REST API Integrations & State Management Patterns"}</li>
                <li>• {"Scalable, Modular Frontend Software Planning"}</li>
              </ul>
            </Card>

            {/* Working Style Card */}
            <Card hoverEffect={false} className="p-6 bg-exp-card-bg border-exp-card-border space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-exp-heading" />
                <h3 className="font-bold text-exp-heading text-xs uppercase tracking-wider font-heading">
                  {"Working Style"}
                </h3>
              </div>
              <p className="text-xs text-exp-body leading-relaxed font-body">
                {"Focused on building reliable, maintainable, and user-friendly software while balancing technical excellence with business goals. High emphasis on code clarity, documentation, testing, and continuous feedback loop."}
              </p>
            </Card>
          </div>
        </Transition>
      </div>

      {/* Simple Understated Footer */}
      <footer className="mt-8 text-center text-[10px] uppercase tracking-widest text-exp-secondary select-none pb-safe">
        {"Rajat Deep Singh • Enterprise Frontend Engineering Portfolio"}
      </footer>
    </div>
  );
}
