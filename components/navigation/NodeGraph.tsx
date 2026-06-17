"use client";

import React, { useEffect, useState } from "react";
import { User, FolderGit, Wrench, Briefcase, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONSTELLATION_NODES, CONSTELLATION_CONNECTIONS } from "@/lib/constellation";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  User,
  FolderGit,
  Wrench,
  Briefcase,
  Mail,
};

// Symmetrical and balanced mobile-specific coordinate mapping 
// Coordinates are in SVG units relative to the center of the 600×500 canvas.
// Explore node radius (mobile) = 72px. Outer node radius = 28px.
// Minimum clearance between Explore circumference and outer node edge = ~40px at these values.
const MOBILE_NODES = [
  { id: "identity",     label: "Explore",      iconName: "User",      x:    0, y:    0 },
  { id: "projects",    label: "Projects",     iconName: "FolderGit", x:    0, y: -160 },
  { id: "about",       label: "About",        iconName: "User",      x: -140, y:  -25 },
  { id: "skills",      label: "Skills",       iconName: "Wrench",    x:  140, y:  -25 },
  // Bottom nodes spread horizontally — mirrors About/Skills pattern, avoids vertical stacking
  { id: "work-with-me", label: "Work With Me", iconName: "Briefcase", x:  -95, y:  125 },
  { id: "contact",     label: "Contact",      iconName: "Mail",      x:   95, y:  125 },
];

type EnvironmentTheme = "day" | "night" | "sunset" | "sunrise";

interface NodeGraphProps {
  activeNodeId: string | null;
  onNodeClick: (nodeId: string) => void;
}

export function NodeGraph({ activeNodeId, onNodeClick }: NodeGraphProps) {
  const [scale, setScale] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState<EnvironmentTheme>("day");

  useEffect(() => {
    // 1. Read initial theme from document root attribute
    const current = document.documentElement.getAttribute("data-theme") as EnvironmentTheme;
    if (current && ["day", "night", "sunset", "sunrise"].includes(current)) {
      setActiveTheme(current);
    }

    // 2. Set up MutationObserver to react to updates on document root
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          const next = document.documentElement.getAttribute("data-theme") as EnvironmentTheme;
          if (next && ["day", "night", "sunset", "sunrise"].includes(next)) {
            setActiveTheme(next);
          }
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

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
  const height = viewportWidth < 768 ? 520 : 450; // Taller on mobile to contain Contact's label

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
  const isDayOrSunrise = activeTheme === "day" || activeTheme === "sunrise";

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
          ? "translate(0px, 22px)"   // Slightly lower than hero — reduced from 50px
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
        {/* Subtle radial backdrop behind the constellation for Day and Sunrise themes */}
        {isDayOrSunrise && (
          <div
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.06) 35%, rgba(0,0,0,0.00) 70%)",
              pointerEvents: "none",
            }}
          />
        )}
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

            const isLineIdle = !isActive && !isHovered;

            const lineFilter = isDayOrSunrise && isLineIdle
              ? "drop-shadow(0 0 3px rgba(0,0,0,0.45))"
              : "var(--env-line-filter)";

            const lineOpacity = isDayOrSunrise && isLineIdle
              ? 1.0
              : (isActive 
                ? 1.0 
                : isHovered 
                  ? 0.6 
                  : isMobile
                    ? 0.48  // Slightly elevated visibility on mobile for touch clarity
                    : "var(--env-line-opacity-idle)");

            const lineStroke = isDayOrSunrise && isLineIdle
              ? "rgba(255,255,255,0.75)"
              : undefined;

            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={cn(
                  "stroke-env-text transition-all duration-[250ms] ease-in-out constellation-line",
                  isActive && "active",
                  isHovered && "hovered"
                )}
                style={{
                  filter: lineFilter,
                  opacity: lineOpacity,
                  stroke: lineStroke,
                }}
                strokeDasharray="3 3"
                strokeWidth={isActive ? "2.2" : isHovered ? "1.8" : isMobile ? "1.5" : "1.2"}
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
              // Top-side nodes: labels sit ABOVE the icon — reduce gap by shrinking bottom offset
              ? "bottom-14 left-1/2 -translate-x-1/2 text-center w-24"
              // Bottom nodes: labels sit BELOW the icon — reduce gap by shrinking top offset
              : "top-14 left-1/2 -translate-x-1/2 text-center w-24"
            : node.id === "contact"
              ? "top-16 left-1/2 -translate-x-1/2 text-center mt-1 w-28"
              : node.x < 0 
                ? "right-16 top-1/2 -translate-y-1/2 text-right mr-3 w-32" 
                : "left-16 top-1/2 -translate-y-1/2 text-left ml-3 w-32";

            const isNodeIdle = !isActive && hoveredNodeId !== node.id;
            const iconStyle = isDayOrSunrise && isNodeIdle ? {
              color: "rgba(255, 255, 255, 0.95)",
              filter: "drop-shadow(0 1px 3px rgba(0, 0, 0, 0.6))",
            } : undefined;

            const labelStyle = isDayOrSunrise && isNodeIdle ? {
              color: "rgba(255, 255, 255, 0.95)",
              textShadow: "0 1px 3px rgba(0, 0, 0, 0.75), 0 2px 8px rgba(0, 0, 0, 0.45)",
            } : undefined;

            return (
              <button
                key={node.id}
                id={`node-${node.id}`}
                onClick={() => onNodeClick(node.id)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className={cn(
                  "absolute z-20 flex h-14 w-14 items-center justify-center rounded-full border cursor-pointer select-none constellation-node",
                  isActive && "active",
                  hoveredNodeId === node.id && "hovered",
                  // Hover: 150ms transition. Active state toggle: 250ms transition
                  "transition-all duration-[250ms] hover:duration-[150ms] ease-in-out",
                  // Hollow visual configs — mobile gets stronger frosted-glass and border contrast
                  isActive
                    ? "bg-env-text/10 border-env-text scale-110 shadow-xs"
                    : isMobile
                      ? "bg-env-surface/30 border-env-text/30 hover:border-env-text hover:shadow-xs"
                      : "bg-transparent border-env-border hover:border-env-text hover:shadow-xs",
                  // Opacity mute when another node is active
                  isSomeNodeActive && !isActive ? "opacity-35 hover:opacity-75" : "opacity-100"
                )}
                style={{
                  left: `calc(50% + ${node.x}px - 28px)`,
                  top: `calc(50% + ${node.y}px - 28px)`,
                  boxShadow: isActive
                    ? "var(--env-glow)"
                    : isMobile
                      ? "0 2px 8px rgba(0,0,0,0.12), 0 0 0 0.5px var(--env-border)"
                      : "none",
                  backdropFilter: isMobile ? "blur(8px)" : undefined,
                }}
              >
                <Icon 
                  className={cn(
                    "h-5 w-5 transition-colors duration-[250ms] ease-in-out antialiased text-env-text constellation-icon"
                  )} 
                  style={iconStyle}
                />
                
                {/* Scene-aware high-contrast text shadow label with weight 600 */}
                <span 
                  className={cn(
                    "absolute text-sm font-semibold uppercase tracking-widest text-shadow-env select-none pointer-events-none transition-all duration-[250ms] antialiased text-env-text constellation-label",
                    // Prevent Work With Me wrapping on mobile — it must stay on one line
                    isMobile && node.id === "work-with-me" ? "whitespace-nowrap" : "",
                    labelPosition
                  )}
                  style={labelStyle}
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
