import React from "react";
import Link from "next/link";
import { PROJECTS } from "@/lib/projects";
import { SKILL_GROUPS } from "@/lib/skills";
import { PORTFOLIO_CONTEXT } from "@/lib/ai/portfolio-context";

export function SemanticPortfolioContent() {
  return (
    <section 
      aria-label="Portfolio Summary and Indexable Content" 
      className="sr-only focus-within:not-sr-only focus-within:relative focus-within:z-50 focus-within:p-6 focus-within:bg-env-surface/95 focus-within:text-env-text focus-within:rounded-xl focus-within:border focus-within:border-env-border focus-within:max-w-4xl focus-within:mx-auto focus-within:my-4"
    >
      {/* 1. Professional Overview & About */}
      <article id="about-section" className="space-y-3">
        <h2 className="text-lg font-bold">About Rajat Deep Singh</h2>
        <p>
          Rajat Deep Singh is a Senior Frontend Engineer with 8+ years of experience building enterprise-scale web applications, independently deployable microfrontends, data-intensive interfaces, and developer tooling. Strong expertise in Angular (including Signals and RxJS), React, Next.js, TypeScript, JavaScript, component architecture, and frontend performance optimization across telecommunications, banking, finance, recruitment, and developer platforms.
        </p>
        <p>
          Based in Gurgaon (Delhi-NCR), India, Rajat works on large-scale production platforms for global technology leaders and provides high-performance web consulting services worldwide.
        </p>
      </article>

      {/* 2. Enterprise Experience Summary */}
      <article id="experience-section" className="space-y-3 mt-6">
        <h2 className="text-lg font-bold">Enterprise Frontend Experience &amp; Track Record</h2>
        <p>
          Rajat has delivered high-impact engineering solutions across Fortune 500 enterprises and technology leaders:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          {PORTFOLIO_CONTEXT.experiences.map((exp) => (
            <li key={exp.id}>
              <strong>{exp.company}</strong> — {exp.role} ({exp.period}, {exp.location}):
              <span> {exp.scope}. {exp.summaryHighlights.join(" ")}</span>
            </li>
          ))}
        </ul>
        <div className="pt-2">
          <Link href="/experience" className="underline font-semibold">
            View full career timeline, architectural breakdowns, and metrics on the Experience page &rarr;
          </Link>
        </div>
      </article>

      {/* 3. Core Technical Skills */}
      <article id="skills-section" className="space-y-3 mt-6">
        <h2 className="text-lg font-bold">Technical Skills &amp; Architectural Capabilities</h2>
        <p>
          Comprehensive frontend engineering proficiencies and tools:
        </p>
        <div className="space-y-2">
          {SKILL_GROUPS.map((group) => (
            <div key={group.id}>
              <h3 className="font-semibold text-sm">{group.title}</h3>
              <p>{group.skills.join(" • ")}</p>
            </div>
          ))}
        </div>
      </article>

      {/* 4. Featured Projects & Case Studies */}
      <article id="projects-section" className="space-y-3 mt-6">
        <h2 className="text-lg font-bold">Featured Projects &amp; Case Studies</h2>
        <ul className="space-y-3">
          {PROJECTS.map((project) => (
            <li key={project.id} className="border-b border-env-border/20 pb-2">
              <h3 className="font-semibold text-base">{project.title}</h3>
              <p>{project.description}</p>
              <p className="text-xs">
                <strong>Technologies:</strong> {project.tags.join(", ")}
              </p>
              {project.link && (
                <div className="mt-1">
                  {project.link.startsWith("/") ? (
                    <Link href={project.link} className="underline font-medium text-xs">
                      {project.ctaText || "View Details"} &rarr;
                    </Link>
                  ) : (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="underline font-medium text-xs">
                      {project.ctaText || "Visit Project"} &rarr;
                    </a>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="pt-2">
          <Link href="/case-study" className="underline font-semibold">
            Read the comprehensive Personal Portfolio Case Study &rarr;
          </Link>
        </div>
      </article>

      {/* 5. Professional Services */}
      <article id="services-section" className="space-y-3 mt-6">
        <h2 className="text-lg font-bold">Frontend Engineering &amp; Web Consulting Services</h2>
        <p>
          Rajat collaborates with startups, enterprises, and creators to deliver high-performance web products:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          {PORTFOLIO_CONTEXT.services.map((service, index) => (
            <li key={index}>
              <strong>{service.title}:</strong> {service.description}
            </li>
          ))}
        </ul>
      </article>

      {/* 6. Contact & Verified Profiles */}
      <article id="contact-section" className="space-y-3 mt-6">
        <h2 className="text-lg font-bold">Contact &amp; Verified Professional Profiles</h2>
        <p>
          Connect directly for full-time engineering roles, technical consulting, or architectural discussions:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${PORTFOLIO_CONTEXT.personal.email}`} className="underline">
              {PORTFOLIO_CONTEXT.personal.email}
            </a>
          </li>
          <li>
            <strong>LinkedIn:</strong>{" "}
            <a href={PORTFOLIO_CONTEXT.personal.linkedin} target="_blank" rel="noopener noreferrer" className="underline">
              {PORTFOLIO_CONTEXT.personal.linkedin}
            </a>
          </li>
          <li>
            <strong>GitHub:</strong>{" "}
            <a href={PORTFOLIO_CONTEXT.personal.github} target="_blank" rel="noopener noreferrer" className="underline">
              {PORTFOLIO_CONTEXT.personal.github}
            </a>
          </li>
          <li>
            <strong>Location:</strong> Gurgaon (Delhi-NCR), Haryana, India — Available for remote worldwide &amp; hybrid on-site engagements.
          </li>
        </ul>
      </article>
    </section>
  );
}
