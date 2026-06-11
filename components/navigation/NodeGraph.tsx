"use client";

import React, { useEffect, useState } from "react";
import { User, FolderGit, Wrench, Briefcase, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONSTELLATION_NODES, CONSTELLATION_CONNECTIONS } from "@/lib/constellation";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  User,
  FolderGit,
  Wrench,
  Briefcase,
  Mail,
};

// Symmetrical and balanced mobile-specific coordinate mapping
const MOBILE_NODES = [
  { id: "identity", label: "Explore", iconName: "User", x: 0, y: 0 },
  { id: "projects", label: "Projects", iconName: "FolderGit", x: 0, y: -125 },
  { id: "about", label: "About", iconName: "User", x: -110, y: -20 },
  { id: "skills", label: "Skills", iconName: "Wrench", x: 110, y: -20 },
  { id: "work-with-me", label: "Work With Me", iconName: "Briefcase", x: -70, y: 90 },
  { id: "contact", label: "Contact", iconName: "Mail", x: 0, y: 145 },
];

interface NodeGraphProps {
  activeNodeId: string | null;
  onNodeClick: (nodeId: string) => void;
}

export function NodeGraph({ activeNodeId, onNodeClick }: NodeGraphProps) {
  const [scale, setScale] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Responsive scaling to preserve visual composition on all viewports
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setViewportWidth(w);
      if (w < 768) {
        setScale(1.0);  // Mobile coordinates are pre-sized, use scale 1.0
      } else if (w < 1024) {
        setScale(0.8);  // Large Tablet/13" Laptop
      } else if (w < 1536) {
        setScale(0.9);  // Standard Laptops (e.g., 1366x768, 1440x900, 1536x864)
      } else {
        setScale(1.0);  // Desktop & Ultrawides
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const width = 600;
  const height = 450;

  // Cinematic connector growing state
  const [lineGrow, setLineGrow] = useState(false);

  useEffect(() => {
    if (activeNodeId && activeNodeId !== "identity") {
      setLineGrow(false);
      const timer = setTimeout(() => {
        setLineGrow(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setLineGrow(false);
    }
  }, [activeNodeId]);

  const isMobile = viewportWidth < 768;
  const nodesList = isMobile ? MOBILE_NODES : CONSTELLATION_NODES;

  // Viewport-aware horizontal translation calculation
  const translationX = activeNodeId && activeNodeId !== "identity" ? (() => {
    if (viewportWidth < 1024) return 0; // Stacked vertically, keep centered
    const desiredDesktopShift = 176;
    const safeMargin = 40; // 40px safe zone from viewport left border
    const constellationBounds = 260 * scale; // furthest node (work-with-me) boundary
    const panelWidth = Math.min(viewportWidth * 0.38, 540);
    const gap = 64; // lg:gap-16 is 64px
    
    // Exact available space before leftmost node clips
    const availableHorizontalSpace = (viewportWidth / 2) - ((gap + panelWidth) / 2) - constellationBounds - safeMargin;
    
    // Clamp shift between 0 and desiredDesktopShift
    const shift = Math.max(0, Math.min(desiredDesktopShift, availableHorizontalSpace));
    return -shift;
  })() : (() => {
    // When panel is closed: shift slightly to the right (20px to 30px) on 13"-15" screens to balance the fixed left header
    if (viewportWidth >= 1024 && viewportWidth < 1536) {
      return 25; // Shift 25px center-right to balance the fixed left header
    }
    return 0;
  })();

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center transition-all duration-[500ms] ease-in-out z-20"
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: isMobile
          ? "translate(0px, 50px)"
          : `translate(${translationX}px, 0px)`,
      }}
    >


      {/* Scaled wrapper for constellation nodes and lines */}
      <div 
        className="relative w-full h-full flex items-center justify-center transition-transform duration-[500ms] ease-in-out"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        {/* Permanent connector lines SVG */}
        <svg 
          className="absolute inset-0 pointer-events-none w-full h-full overflow-visible"
          viewBox={`-${width / 2} -${height / 2} ${width} ${height}`}
        >
          {CONSTELLATION_CONNECTIONS.map(([fromId, toId], idx) => {
            const fromNode = nodesList.find((n) => n.id === fromId);
            const toNode = nodesList.find((n) => n.id === toId);
            
            if (!fromNode || !toNode) return null;

            const isActive = activeNodeId === toId;
            const isHovered = hoveredNodeId === toId;

            // Calculate approach angle and offset endpoints to terminate on node circumference
            const dx = toNode.x - fromNode.x;
            const dy = toNode.y - fromNode.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let x1 = fromNode.x;
            let y1 = fromNode.y;
            let x2 = toNode.x;
            let y2 = toNode.y;

            if (dist > 0) {
              const ux = dx / dist;
              const uy = dy / dist;

              // Explore central node is w-44 on desktop (radius 88px), w-36 on mobile (radius 72px)
              const rExplore = isMobile ? 72 : 88;

              x1 = fromNode.x + ux * rExplore;
              y1 = fromNode.y + uy * rExplore;
              
              // Start directly from the outer node center (radius is 0)
              x2 = toNode.x;
              y2 = toNode.y;
            }

            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={cn(
                  "stroke-env-text transition-all duration-[250ms] ease-in-out"
                )}
                style={{
                  filter: "var(--env-line-filter)",
                  opacity: isActive 
                    ? 1.0 
                    : isHovered 
                      ? 0.6 
                      : "var(--env-line-opacity-idle)", // Idle opacity loaded from CSS variables
                }}
                strokeDasharray="3 3"
                strokeWidth={isActive ? "2.2" : isHovered ? "1.8" : "1.2"}
              />
            );
          })}
        </svg>

        {/* Nodes Constellation */}
        {nodesList.map((node) => {
          const isAnchor = node.id === "identity";
          const Icon = ICON_MAP[node.iconName] || Mail;
          const isActive = activeNodeId === node.id;
          const isSomeNodeActive = activeNodeId !== null;

          if (isAnchor) {
            // Central visual anchor node (Explore) - w-44 on desktop, w-36 on mobile
            const sizeClass = isMobile ? "h-36 w-36" : "h-44 w-44";
            const radius = isMobile ? 72 : 88;
            return (
              <div
                key={node.id}
                className={cn(
                  "absolute z-30 flex items-center justify-center rounded-full border border-env-center-border bg-env-center-bg p-1.5 shadow-sm transition-env duration-[700ms]",
                  sizeClass
                )}
                style={{
                  left: `calc(50% + ${node.x}px - ${radius}px)`,
                  top: `calc(50% + ${node.y}px - ${radius}px)`,
                  backdropFilter: "blur(var(--env-blur))",
                }}
              >
                <div className="flex flex-col items-center justify-center text-center h-full w-full rounded-full border border-env-center-border/40 p-2 md:p-4 gap-0.5">
                  <span className="text-[13px] font-extrabold uppercase tracking-widest text-env-center-text select-none font-heading antialiased leading-none">
                    Explore
                  </span>
                  <span className="text-[10px] font-medium tracking-wider text-env-center-text/50 select-none font-body antialiased leading-none">
                    Portfolio
                  </span>
                </div>
              </div>
            );
          }

          // Navigation Nodes - w-14 h-14, font weight 600, high contrast crisp rendering
          const labelPosition = isMobile
            ? (node.id === "projects" || node.id === "about" || node.id === "skills")
              ? "bottom-16 left-1/2 -translate-x-1/2 text-center mb-1 w-24"
              : "top-16 left-1/2 -translate-x-1/2 text-center mt-1 w-24"
            : node.id === "contact"
              ? "top-16 left-1/2 -translate-x-1/2 text-center mt-1 w-28"
              : node.x < 0 
                ? "right-16 top-1/2 -translate-y-1/2 text-right mr-3 w-32" 
                : "left-16 top-1/2 -translate-y-1/2 text-left ml-3 w-32";

          return (
            <button
              key={node.id}
              id={`node-${node.id}`}
              onClick={() => onNodeClick(node.id)}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              className={cn(
                "absolute z-20 flex h-14 w-14 items-center justify-center rounded-full border cursor-pointer select-none",
                // Hover: 150ms transition. Active state toggle: 250ms transition
                "transition-all duration-[250ms] hover:duration-[150ms] ease-in-out",
                // Hollow visual configs
                isActive
                  ? "bg-env-text/10 border-env-text scale-110 shadow-xs"
                  : "bg-transparent border-env-border hover:border-env-text hover:shadow-xs",
                // Opacity mute when another node is active
                isSomeNodeActive && !isActive ? "opacity-35 hover:opacity-75" : "opacity-100"
              )}
              style={{
                left: `calc(50% + ${node.x}px - 28px)`,
                top: `calc(50% + ${node.y}px - 28px)`,
                boxShadow: isActive ? "var(--env-glow)" : "none",
              }}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 transition-colors duration-[250ms] ease-in-out antialiased text-env-text"
                )} 
              />
              
              {/* Scene-aware high-contrast text shadow label with weight 600 */}
              <span 
                className={cn(
                  "absolute text-sm font-semibold uppercase tracking-widest text-shadow-env select-none pointer-events-none transition-all duration-[250ms] antialiased text-env-text",
                  labelPosition
                )}
              >
                {node.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
