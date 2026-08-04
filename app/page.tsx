"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { NodeGraph } from "@/components/navigation/NodeGraph";
import { EmergingPanel } from "@/components/navigation/EmergingPanel";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { PROJECTS } from "@/lib/projects";
import { Project, SocialLink } from "@/types/portfolio";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/shared/Icons";
import { ExternalLink, Code2, Server, Database, Palette } from "lucide-react";
import { SceneSelector } from "@/components/navigation/SceneSelector";
import { ContactForm } from "@/components/contact/ContactForm";
import { RecommendationsPanel } from "@/components/panels/RecommendationsPanel";
import { Reference } from "@/types/reference";
import {
  trackResumeView,
  trackCvDownload,
  trackExperienceClick,
  trackProjectClick,
  trackPageView,
  trackRecommendationsPanelOpen,
} from "@/lib/analytics";

/*
TODO: Future project: "UX Design Gallery"
This will later showcase landing page concepts, product flows, mobile screens, and UI explorations hosted within the portfolio itself.
*/

export default function Home() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [nodeCoords, setNodeCoords] = useState<{ x: number; y: number } | null>(null);
  const [panelCoords, setPanelCoords] = useState<{ x: number; y: number } | null>(null);
  const [references, setReferences] = useState<Reference[]>([]);
  const [loadingReferences, setLoadingReferences] = useState(true);

  useEffect(() => {
    async function fetchReferences() {
      try {
        const res = await fetch("/api/references");
        if (res.ok) {
          const data = await res.json();
          setReferences(data);
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setLoadingReferences(false);
      }
    }
    fetchReferences();
    trackPageView("home");
  }, []);

  const handleNodeClick = (nodeId: string) => {
    if (activeNode === nodeId) { 
      setActiveNode(null); // Collapse panels
    } else {
      setActiveNode(nodeId);
      if (nodeId === "recommendations") {
        trackRecommendationsPanelOpen();
      }
    }
  };

  const handleClose = () => {
    setActiveNode(null);
  };

  const updateCoordinates = useCallback(() => {
    if (!activeNode || activeNode === "identity") {
      setNodeCoords(null);
      setPanelCoords(null);
      return;
    }

    const container = document.getElementById("layout-container");
    const nodeEl = document.getElementById(`node-${activeNode}`);
    const anchorEl = document.getElementById("panel-anchor");

    if (container && nodeEl && anchorEl) {
      const containerRect = container.getBoundingClientRect();
      const nodeRect = nodeEl.getBoundingClientRect();
      const anchorRect = anchorEl.getBoundingClientRect();

      setNodeCoords({
        x: nodeRect.left + nodeRect.width - containerRect.left,
        y: nodeRect.top + nodeRect.height / 2 - containerRect.top,
      });

      setPanelCoords({
        x: anchorRect.left + anchorRect.width / 2 - containerRect.left,
        y: anchorRect.top + anchorRect.height / 2 - containerRect.top,
      });
    }
  }, [activeNode]);

  useEffect(() => {
    if (!activeNode || activeNode === "identity") {
      setNodeCoords(null);
      setPanelCoords(null);
      return;
    }

    // Update coordinates immediately
    updateCoordinates();

    // Staggered tracking loop over 800ms to keep the path perfectly attached 
    // as the NodeGraph translates left (500ms transition)
    let animationFrameId: number;
    const startTime = performance.now();
    const duration = 800;

    const tick = (now: number) => {
      updateCoordinates();
      if (now - startTime < duration) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    window.addEventListener("resize", updateCoordinates);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updateCoordinates);
    };
  }, [activeNode, updateCoordinates]);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-6">
      {/* Desktop Scene Selector */}
      <SceneSelector className="hidden md:block fixed top-6 right-6" />

      {/* Top: Title & Branding — centered on mobile, fixed top-left on desktop */}
      <header className="relative md:fixed top-0 left-0 pt-[calc(env(safe-area-inset-top)+2rem)] md:pt-12 lg:pt-16 px-6 md:pl-8 md:pr-0 lg:pl-10 z-40 w-full md:max-w-lg select-none pointer-events-none flex flex-col items-center md:items-start gap-1 md:gap-1.5">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-widest text-env-text uppercase font-heading leading-none pointer-events-auto text-shadow-env text-center md:text-left">
          Rajat Deep Singh
        </h1>
        <p className="text-xs md:text-sm lg:text-base font-extrabold tracking-widest text-env-text uppercase font-heading pointer-events-auto text-shadow-env leading-snug text-center md:text-left">
          Senior Frontend Engineer
        </p>
        <p className="text-xs md:text-sm lg:text-base text-env-text/90 font-bold tracking-wider pointer-events-auto text-shadow-env leading-normal text-center md:text-left">
          Angular • React • Next.js • Node.js • and more
        </p>
        <p className="text-xs md:text-sm text-env-muted font-semibold italic tracking-wider pointer-events-auto text-shadow-env leading-normal text-center md:text-left">
          Space • Airplanes • Poetry • Rock Music
        </p>
        
        {/* Mobile Scene Selector - centered between interests text and action buttons */}
        <div className="md:hidden flex justify-center w-full mt-4 mb-1 pointer-events-auto">
          <SceneSelector className="relative top-auto left-auto translate-x-0" />
        </div>

        {/* Action Buttons
             Mobile:  pyramid layout — [View Resume] [Download CV] on row 1, [View Experience] centered below
             Desktop: unchanged horizontal flex-wrap
        */}
        <div className="mt-2 md:mt-3 pointer-events-auto w-full flex flex-col items-center gap-2 md:flex-row md:flex-wrap md:gap-3">
          {/* Row 1: two buttons side-by-side on mobile */}
          <div className="flex gap-2 md:contents">
            {/* Primary CTA (Filled) */}
            <a
              href="/cv/RajatDeep_Singh_Resume_August.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackResumeView}
              className="inline-flex items-center justify-center rounded-lg bg-env-text px-4 md:px-5 py-2 md:py-2.5 text-xs font-bold uppercase tracking-wider text-env-surface hover:opacity-90 transition-all duration-[250ms] ease-in-out select-none shadow-xs hover:scale-[1.02] focus:ring-2 focus:ring-env-text focus:ring-offset-2 outline-none"
            >
              View Resume
            </a>
            {/* Secondary CTA (Outlined & Frosted) */}
            <a
              href="/cv/RajatDeep_Singh_Resume_August.pdf"
              download="Rajat_Deep_Singh_CV.pdf"
              onClick={trackCvDownload}
              className="inline-flex items-center justify-center rounded-lg border border-env-border bg-env-surface/20 backdrop-blur-xs px-4 md:px-5 py-2 md:py-2.5 text-xs font-bold uppercase tracking-wider text-env-text hover:bg-env-surface/40 hover:border-env-text transition-all duration-[250ms] ease-in-out select-none hover:scale-[1.02] focus:ring-2 focus:ring-env-border focus:ring-offset-2 outline-none"
            >
              Download CV
            </a>
          </div>
          {/* Row 2: View Experience centered below — pyramid apex */}
          <Link
            href="/experience"
            onClick={trackExperienceClick}
            className="inline-flex items-center justify-center rounded-lg border border-env-border bg-env-surface/20 backdrop-blur-xs px-4 md:px-5 py-2 md:py-2.5 text-xs font-bold uppercase tracking-wider text-env-text hover:bg-env-surface/40 hover:border-env-text transition-all duration-[250ms] ease-in-out select-none hover:scale-[1.02] focus:ring-2 focus:ring-env-border focus:ring-offset-2 outline-none"
          >
            View Experience
          </Link>
        </div>
      </header>

      {/* Center Layout: Constellation & Emerging Plaque Panel (Master-Detail) */}
      <div id="layout-container" className="flex-1 flex items-center justify-center pt-8 pb-20 md:py-0 relative">
        
        {/* Architectural Node -> Panel Connector Line */}
        {activeNode && activeNode !== "identity" && nodeCoords && panelCoords && (() => {
          const dx = panelCoords.x - nodeCoords.x;
          // Restrained, elegant single curve entering the panel horizontally
          const controlX1 = nodeCoords.x + dx * 0.4;
          const controlY1 = nodeCoords.y;
          const controlX2 = panelCoords.x - dx * 0.4;
          const controlY2 = panelCoords.y;

          return (
            <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible z-10">
              <motion.path
                d={`M ${nodeCoords.x} ${nodeCoords.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${panelCoords.x} ${panelCoords.y}`}
                fill="none"
                stroke="var(--env-text)"
                strokeWidth="1.5"
                style={{
                  filter: "var(--env-line-filter)",
                  opacity: 0.6,
                }}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 0.3,
                  ease: "easeInOut",
                }}
              />
            </svg>
          );
        })()}

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 max-w-6xl w-full px-4 pb-24">
          
          {/* Constellation Star Map Graph */}
          <NodeGraph activeNodeId={activeNode} onNodeClick={handleNodeClick} />
          
          {/* Emerging content panel (sliding in at center-right visual zone) */}
          <EmergingPanel
            isOpen={activeNode !== null && activeNode !== "identity"}
            onClose={handleClose}
            title={activeNode ? activeNode.toUpperCase().replace("-", " ") : ""}
          >
            {activeNode === "about" && (
              <div className="space-y-4">
                <h4 className="font-semibold text-env-text text-base font-heading">
                  About
                </h4>
                <p className="text-env-muted font-body">
                  {"I'm a Frontend Engineer working at a leading global technology company, with experience contributing to products used at enterprise scale. Over the years, I've worked on complex platforms handling large volumes of data, where I was involved in both designing solutions and implementing them from the ground up."}
                </p>
                <p className="text-env-muted font-body">
                  {"Beyond my day job, I've built websites and digital experiences for clients across different parts of the world, helped friends bring their ideas online, and spent countless hours experimenting with new technologies, UI patterns, and side projects."}
                </p>
                <h4 className="font-semibold text-env-text text-base font-heading pt-2">
                  Personal Life
                </h4>
                <p className="text-env-muted font-body">
                  {"Outside of coding, I'm a gloriously average guitarist, an adventure enthusiast, and someone who's always up for a road trip. Whether it's a hiking trail in the mountains or driving through winding roads at 4,000+ meters above sea level, I rarely say no to an adventure."}
                </p>
                <p className="text-env-muted font-body">
                  {"When life slows down, you'll usually find me writing poetry, enjoying cloudy skies, waiting for the rain, or sitting somewhere quiet with a cup of chai."}
                </p>
                <p className="text-env-muted font-body">
                  {"And yes, there's a good chance I'll write code in exchange for one."}
                </p>
              </div>
            )}

            {activeNode === "projects" && (
              <div className="grid gap-4">
                {PROJECTS.map((project) => {
                  const isFlagship = project.id === "project-portfolio";
                  return (
                    <Card 
                      key={project.id} 
                      hoverEffect={true} 
                      className={`p-5 transition-all duration-300 ${
                        isFlagship 
                          ? "bg-env-surface/40 border-indigo-500/35 shadow-[0_0_20px_rgba(99,102,241,0.08)] hover:border-indigo-500/55" 
                          : "bg-env-text/5 border-env-border/50"
                      }`}
                    >
                      <h4 className="font-bold text-env-text text-sm uppercase tracking-wider">{project.title}</h4>
                      <p className="text-xs text-env-muted mt-2">{project.description}</p>
                      
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-env-text/5 text-env-text">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex gap-4 text-xs font-semibold uppercase tracking-wider font-body">
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-env-text transition-colors text-env-muted font-body">
                            <GithubIcon className="h-3.5 w-3.5" />
                            Code
                          </a>
                        )}
                        {project.link && (
                          project.link.startsWith("/") ? (
                            <Link
                              href={project.link}
                              className="inline-flex items-center gap-1 hover:text-env-text transition-colors text-env-muted font-body"
                            >
                              {project.ctaText || "View Experience →"}
                            </Link>
                          ) : (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => trackProjectClick(project.id)}
                              className="inline-flex items-center gap-1 hover:text-env-text transition-colors text-env-muted font-body"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {"Visit Website →"}
                            </a>
                          )
                        )}
                        {project.comingSoon && (
                          <span className="inline-flex items-center text-env-muted select-none">
                            {"Coming Soon"}
                          </span>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {activeNode === "recommendations" && (
              <RecommendationsPanel
                references={references}
                loading={loadingReferences}
              />
            )}

            {activeNode === "skills" && (
              <div className="space-y-4">
                <p className="text-env-muted font-body">
                  A breakdown of core engineering proficiencies developed over 8 years of production development:
                </p>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 mt-4">
                  {/* Frontend */}
                  <div className="rounded-xl border border-env-border bg-env-text/5 p-4">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-env-text" />
                      <h5 className="font-bold text-env-text text-xs uppercase tracking-wider font-heading">Frontend</h5>
                    </div>
                    <ul className="mt-2.5 text-xs text-env-muted space-y-1.5 font-body">
                      <li>Angular</li>
                      <li>React</li>
                      <li>Next.js</li>
                      <li>TypeScript</li>
                      <li>JavaScript</li>
                      <li>HTML5 &amp; CSS3</li>
                    </ul>
                  </div>

                  {/* Backend */}
                  <div className="rounded-xl border border-env-border bg-env-text/5 p-4">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-env-text" />
                      <h5 className="font-bold text-env-text text-xs uppercase tracking-wider font-heading">Backend</h5>
                    </div>
                    <ul className="mt-2.5 text-xs text-env-muted space-y-1.5 font-body">
                      <li>Node.js</li>
                      <li>Express.js</li>
                      <li>Python</li>
                      <li>REST APIs</li>
                    </ul>
                  </div>

                  {/* Databases */}
                  <div className="rounded-xl border border-env-border bg-env-text/5 p-4">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-env-text" />
                      <h5 className="font-bold text-env-text text-xs uppercase tracking-wider font-heading">Databases</h5>
                    </div>
                    <ul className="mt-2.5 text-xs text-env-muted space-y-1.5 font-body">
                      <li>MongoDB</li>
                      <li>PostgreSQL</li>
                      <li>SQL</li>
                    </ul>
                  </div>

                  {/* Design & Engineering */}
                  <div className="rounded-xl border border-env-border bg-env-text/5 p-4">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-env-text" />
                      <h5 className="font-bold text-env-text text-xs uppercase tracking-wider font-heading">Design &amp; Engineering</h5>
                    </div>
                    <ul className="mt-2.5 text-xs text-env-muted space-y-1.5 font-body">
                      <li>Figma</li>
                      <li>Responsive UI/UX</li>
                      <li>Performance Optimization</li>
                      <li>Git &amp; CI/CD</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeNode === "work-with-me" && (
              <div className="space-y-4">
                <h4 className="font-semibold text-env-text text-base font-heading">
                  {"Let's build something great together"}
                </h4>
                <p className="text-env-muted font-body">
                  {"Whether you're launching a new idea, improving an existing product, or growing your business online, I'd be happy to help."}
                </p>
                <p className="text-env-muted font-body">
                  {"I work with businesses, startups, entrepreneurs, and creators to build fast, modern, and reliable web experiences. From planning and design discussions to development and launch, I can help turn ideas into products people enjoy using."}
                </p>
                
                <h5 className="font-bold text-env-text text-xs uppercase tracking-wider font-heading pt-2">
                  {"Things I can help with"}
                </h5>
                <ul className="text-xs text-env-muted space-y-4 font-body pl-1">
                  <li>• Business websites that are designed to convert visitors into customers</li>
                  <li>• SEO-friendly, mobile-responsive websites</li>
                  <li>• Product reviews, planning, and consultation before development begins</li>
                  <li>• UI/UX discussions and guidance on how your product should look and feel</li>
                  <li>• Analytics integration and insights to help understand user behavior</li>
                  <li>• Complex and large-scale web applications</li>
                  <li>• Frontend architecture and performance optimization</li>
                  <li>• Premium-quality implementations with attention to detail</li>
                </ul>

                <p className="text-env-muted font-body pt-2">
                  {"Not sure where to start? That's completely fine. We can begin with a conversation, discuss your goals, answer questions, and figure out the best path forward together."}
                </p>
              </div>
            )}

            {activeNode === "contact" && (
              <div className="space-y-4">
                <ContactForm />

                {/* Centered separator spacing */}
                <div className="flex items-center justify-center gap-4 pt-2 pb-2">
                  <div className="h-[1px] flex-1 bg-env-border/30" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-env-muted select-none">
                    Or send me a message
                  </span>
                  <div className="h-[1px] flex-1 bg-env-border/30" />
                </div>

                {/* Centered social icons */}
                <div className="flex items-center justify-center gap-6 py-1">
                  <a
                    href="https://www.linkedin.com/in/rajatdeepsingh2417/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-env-muted hover:text-env-text transition-colors duration-200"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                  >
                    <LinkedinIcon className="h-5 w-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/hereismyrhyme/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-env-muted hover:text-env-text transition-colors duration-200"
                    aria-label="Instagram"
                    title="Instagram"
                  >
                    <InstagramIcon className="h-5 w-5" />
                  </a>
                </div>
              </div>
            )}
          </EmergingPanel>
        </div>
      </div>

      {/* Bottom Center: Floating Footer Pill (GitHub • LinkedIn • Email) */}
      <footer className={`fixed bottom-[6px] left-1/2 -translate-x-1/2 z-40 flex items-center justify-center select-none pb-safe transition-all duration-300 ${activeNode && activeNode !== "identity" ? "hidden md:flex" : "flex"}`}>
        <div 
          className="flex items-center gap-2 md:gap-3 rounded-full border border-env-border/40 bg-env-surface/80 px-4 md:px-6 py-1.5 md:py-2.5 shadow-sm transition-env duration-[700ms]"
          style={{
            backdropFilter: "blur(24px)",
            boxShadow: "0 0 16px var(--env-border), var(--env-shadow)",
          }}
        >
          <a 
            href="https://github.com/developersmindfulapps" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] font-semibold uppercase tracking-[0.04em] text-env-text hover:opacity-80 transition-opacity"
          >
            GitHub
          </a>
          <span className="text-[10px] text-env-border font-bold select-none">•</span>
          <a 
            href="https://www.linkedin.com/in/rajatdeepsingh2417/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] font-semibold uppercase tracking-[0.04em] text-env-text hover:opacity-80 transition-opacity"
          >
            LinkedIn
          </a>
          <span className="text-[10px] text-env-border font-bold select-none">•</span>
          <a 
            href="https://www.instagram.com/hereismyrhyme/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] font-semibold uppercase tracking-[0.04em] text-env-text hover:opacity-80 transition-opacity"
          >
            Instagram
          </a>
          <span className="text-[10px] text-env-border font-bold select-none">•</span>
        </div>
      </footer>
    </div>
  );
}
