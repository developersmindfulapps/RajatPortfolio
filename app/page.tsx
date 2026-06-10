"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { NodeGraph } from "@/components/navigation/NodeGraph";
import { EmergingPanel } from "@/components/navigation/EmergingPanel";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { Project, SocialLink } from "@/types/portfolio";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/shared/Icons";
import { ExternalLink, Code2, Server, Database, Palette } from "lucide-react";

/*
TODO: Future project: "UX Design Gallery"
This will later showcase landing page concepts, product flows, mobile screens, and UI explorations hosted within the portfolio itself.
*/
const PROJECTS: Project[] = [
  {
    id: "project-1",
    title: "Law Practice Platform",
    description: "Built a modern website platform for a well-known legal professional. Beyond a traditional landing page, the platform gives complete control over website content through a secure admin experience, allowing updates without touching code or databases. Integrated consultation workflows using Resend and Twilio, while maintaining strong SEO foundations and mobile responsiveness.",
    tags: ["Next.js", "Node.js", "Resend", "Twilio", "SEO", "Responsive Design"],
    link: "https://altafs-website-6pmd.vercel.app/",
  },
  {
    id: "project-2",
    title: "EventUally",
    description: "A mobile-first event planning platform designed to simplify group coordination. EventUally helps friends, families, and communities organize events, manage RSVPs, coordinate venues, and keep everyone on the same page without endless messaging threads. Built with a strong focus on privacy, usability, and reducing the friction involved in planning group events.",
    tags: ["React Native", "Node.js", "PostgreSQL", "Event Planning", "Mobile App"],
    link: "https://eventuallyapp.in",
  },
];

export default function Home() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [nodeCoords, setNodeCoords] = useState<{ x: number; y: number } | null>(null);
  const [panelCoords, setPanelCoords] = useState<{ x: number; y: number } | null>(null);

  const handleNodeClick = (nodeId: string) => {
    if (activeNode === nodeId) {
      setActiveNode(null); // Collapse panel
    } else {
      setActiveNode(nodeId);
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
        // Capture exact point on right edge of node circumference in container space
        x: nodeRect.left + nodeRect.width - containerRect.left,
        y: nodeRect.top + nodeRect.height / 2 - containerRect.top,
      });

      setPanelCoords({
        // Center of the panel anchor dot in container space
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
      
      {/* Top Left: Title & Branding */}
      <header className="fixed top-0 left-0 pt-10 md:pt-12 lg:pt-16 pl-6 md:pl-8 lg:pl-10 z-40 max-w-[320px] sm:max-w-md md:max-w-lg select-none pointer-events-none flex flex-col gap-1 md:gap-1.5">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-widest text-env-text uppercase font-heading leading-none pointer-events-auto text-shadow-env">
          Rajat Deep Singh
        </h1>
        <p className="text-xs md:text-sm lg:text-base font-extrabold tracking-widest text-env-text uppercase font-heading pointer-events-auto text-shadow-env leading-snug">
          Senior Frontend Engineer
        </p>
        <p className="text-xs md:text-sm lg:text-base text-env-text/90 font-bold tracking-wider pointer-events-auto text-shadow-env leading-normal">
          Angular • React • Next.js • Node.js • and more
        </p>
        <p className="text-xs md:text-sm text-env-muted font-semibold italic tracking-wider pointer-events-auto text-shadow-env leading-normal">
          Space • Airplanes • Poetry • Rock Music
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-row items-center gap-4 mt-3 pointer-events-auto">
          {/* Primary CTA (Filled) */}
          <a
            href="/cv/RajatCvJune.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-env-text px-4 md:px-5 py-2 md:py-2.5 text-xs font-bold uppercase tracking-wider text-env-surface hover:opacity-90 transition-all duration-[250ms] ease-in-out select-none shadow-xs hover:scale-[1.02] focus:ring-2 focus:ring-env-text focus:ring-offset-2 outline-none"
          >
            View Resume
          </a>
          {/* Secondary CTA (Outlined & Frosted) */}
          <a
            href="/cv/RajatCvJune.pdf"
            download="Rajat_Deep_Singh_CV.pdf"
            className="inline-flex items-center justify-center rounded-lg border border-env-border bg-env-surface/20 backdrop-blur-xs px-4 md:px-5 py-2 md:py-2.5 text-xs font-bold uppercase tracking-wider text-env-text hover:bg-env-surface/40 hover:border-env-text transition-all duration-[250ms] ease-in-out select-none hover:scale-[1.02] focus:ring-2 focus:ring-env-border focus:ring-offset-2 outline-none"
          >
            Download CV
          </a>
        </div>

        {/* Constellation Onboarding Guidance Hint */}
        <p className="text-[10px] md:text-xs text-env-muted font-semibold tracking-wide mt-2 md:mt-3 pointer-events-auto text-shadow-env select-none">
          Explore my work through the interactive constellation.
        </p>
      </header>

      {/* Center Layout: Constellation & Emerging Plaque Panel (Master-Detail) */}
      <div id="layout-container" className="flex-1 flex items-center justify-center pt-56 pb-20 md:py-0 relative">
        
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
                {PROJECTS.map((project) => (
                  <Card key={project.id} hoverEffect={false} className="p-5 bg-env-text/5 border-env-border/50">
                    <h4 className="font-bold text-env-text text-sm uppercase tracking-wider">{project.title}</h4>
                    <p className="text-xs text-env-muted mt-2">{project.description}</p>
                    
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-env-text/5 text-env-text">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex gap-4 text-xs font-semibold uppercase tracking-wider">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-env-text transition-colors text-env-muted">
                          <GithubIcon className="h-3.5 w-3.5" />
                          Code
                        </a>
                      )}
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-env-text transition-colors text-env-muted">
                          <ExternalLink className="h-3 w-3" />
                          {"Visit Website →"}
                        </a>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
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
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-env-muted">Name</label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="rounded-lg border border-env-border bg-transparent px-3 py-2 text-xs outline-none focus:border-env-text transition-colors text-env-text font-body"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-env-muted">Email</label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="rounded-lg border border-env-border bg-transparent px-3 py-2 text-xs outline-none focus:border-env-text transition-colors text-env-text font-body"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-env-muted">Message</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    className="rounded-lg border border-env-border bg-transparent px-3 py-2 text-xs outline-none focus:border-env-text transition-colors text-env-text font-body resize-none"
                  />
                </div>

                {/* Cloudflare Turnstile Placeholder (Future Compatibility) */}
                {/* <div id="turnstile-container" className="my-2 flex justify-center" /> */}

                <Button type="submit" className="w-full text-xs font-bold uppercase tracking-widest">
                  Send Message
                </Button>

                {/* Centered separator spacing */}
                <div className="flex items-center justify-center gap-4 pt-4 pb-2">
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
              </form>
            )}
          </EmergingPanel>
        </div>
      </div>

      {/* Bottom Center: Floating Footer Pill (GitHub • LinkedIn • Email) */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center select-none pb-safe">
        <div 
          className="flex items-center gap-3 rounded-full border border-env-border/40 bg-env-surface/80 px-6 py-2.5 shadow-sm transition-env duration-[700ms]"
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
        </div>
      </footer>
    </div>
  );
}
