"use client";

import React, { useEffect, useState } from "react";
import { User, FolderGit, Wrench, Briefcase, Mail, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONSTELLATION_NODES, CONSTELLATION_CONNECTIONS } from "@/lib/constellation";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  User,
  FolderGit,
  Wrench,
  Briefcase,
  Mail,
  MessageSquare,
};

// Symmetrical and balanced mobile-specific coordinate mapping 
// Coordinates are in SVG units relative to the center of the 600×500 canvas.
// Explore node radius (mobile) = 72px. Outer node radius = 28px.
// Minimum clearance between Explore circumference and outer node edge = ~40px at these values.
const MOBILE_NODES = [
  { id: "identity",     label: "Explore",      iconName: "User",          x:    0, y:    0 },
  { id: "recommendations", label: "Recommendations", iconName: "MessageSquare", x:  -95, y: -125 },
  { id: "projects",    label: "Projects",     iconName: "FolderGit",     x:   95, y: -125 },
  { id: "skills",      label: "Skills",       iconName: "Wrench",        x:  140, y:  -25 },
  { id: "about",       label: "About",        iconName: "User",          x: -140, y:  -25 },
  // Bottom nodes spread horizontally — mirrors About/Skills pattern, avoids vertical stacking
  { id: "work-with-me", label: "Work With Me", iconName: "Briefcase",     x:  -95, y:  125 },
  { id: "contact",     label: "Contact",      iconName: "Mail",          x:   95, y:  125 },
];

type EnvironmentTheme = "day" | "night" | "sunset" | "sunrise";

interface NodeGraphProps {
  activeNodeId: string | null;
  onNodeClick: (nodeId: string) => void;
}

export function NodeGraph({ activeNodeId, onNodeClick }: NodeGraphProps) {
  const [scale, setScale] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const [viewportHeight, setViewportHeight] = useState(800);
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
      const h = window.innerHeight;
      setViewportWidth(w);
      setViewportHeight(h);
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

  // Compute responsive layout translations to prevent collisions with the fixed hero section
  const { transX, transY } = (() => {
    if (isMobile) {
      return { transX: 0, transY: 22 };
    }

    const isPanelOpen = activeNodeId !== null && activeNodeId !== "identity";

    // 1. Base center shift (reverted back to standard centering)
    let baseShiftX = 0;
    if (viewportWidth >= 1024 && viewportWidth < 1536 && !isPanelOpen) {
      baseShiftX = 25; // Shift 25px center-right to balance the fixed left header
    }

    // 2. Adjust X translation when panel is open (shift left to make space)
    let x = baseShiftX;
    let y = 0;

    const panelWidth = Math.min(viewportWidth * 0.38, 540);
    const gap = 64;

    if (isPanelOpen) {
      // Standard shift-left to accommodate the side panel
      if (viewportWidth >= 1024) {
        const desiredShift = 176;
        const safeMargin = 40;
        const constellationBounds = 260 * scale;
        const availableSpace = (viewportWidth / 2) - ((gap + panelWidth) / 2) - constellationBounds - safeMargin;
        const shift = Math.max(0, Math.min(desiredShift, availableSpace));
        
        // We apply the shift-left to our base position
        x = baseShiftX - shift;
      } else {
        // Stacked vertically, keep centered
        x = 0;
      }
    }

    // 3. Collision-safe logic against the fixed hero section
    // Hero occupies top-left region: width ~440px, height ~340px.
    // Calculate the actual center of the constellation relative to the viewport:
    const constellationViewportCenterX = (isPanelOpen && viewportWidth >= 1024)
      ? (viewportWidth - gap - panelWidth) / 2 + x
      : (viewportWidth / 2) + x;

    // Detect actual visual overlap between leftmost/topmost node and the hero section
    // leftmost node is About node at x = -240 * scale; topmost is Recommendations at y = -220 * scale
    const nodeX = constellationViewportCenterX - 240 * scale;
    const nodeY = (viewportHeight / 2) - 220 * scale;

    const heroWidth = 440;
    const heroHeight = 340;

    if (nodeX < heroWidth && nodeY < heroHeight) {
      // Collision detected! Calculate overlaps to clear it
      const overlapX = heroWidth - nodeX;
      const overlapY = heroHeight - nodeY;

      // On tablet-sized widths when panel is closed, keep it centered horizontally and shift down instead
      if (viewportWidth < 1280 && !isPanelOpen) {
        y = Math.min(160, y + overlapY + 30);
      } else {
        // Shift down and right more aggressively to completely clear the hero text/buttons
        y = Math.min(160, y + overlapY + 35);
        x += Math.min(180, overlapX * 0.6);
      }
    }

    // 4. Specific width-based overrides as requested
    if (viewportWidth < 1400) {
      // Gradually shift downward and increase spacing
      const factor = (1400 - viewportWidth) / 400; // e.g., 0 to 1
      y = Math.max(y, 35 + factor * 50);
    }

    if (viewportWidth < 1280) {
      // Move lower and slightly right
      const factor = (1280 - viewportWidth) / 280; // e.g., 0 to 1
      y = Math.max(y, 70 + factor * 60);
      x = Math.max(x, x + 25);
    }

    // 5. Tablet vertical safety (hero is fixed top-left for md: viewport >= 768px)
    if (viewportWidth < 1024 && viewportWidth >= 768) {
      y = Math.max(y, 80);
    }

    return { transX: x, transY: y };
  })();

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center transition-all duration-[500ms] ease-in-out z-20"
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(${transX}px, ${transY}px)`,
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
            ? (node.id === "projects" || node.id === "about" || node.id === "skills" || node.id === "recommendations")
              // Top-side nodes: labels sit ABOVE the icon — reduce gap by shrinking bottom offset
              ? "bottom-14 left-1/2 -translate-x-1/2 text-center w-24"
              // Bottom nodes: labels sit BELOW the icon — reduce gap by shrinking top offset
              : "top-14 left-1/2 -translate-x-1/2 text-center w-24"
            : node.id === "contact"
              ? "top-16 left-1/2 -translate-x-1/2 text-center mt-1 w-28"
              : node.id === "recommendations"
                ? "bottom-16 left-1/2 -translate-x-1/2 text-center w-40"
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
                    "absolute text-sm font-semibold uppercase tracking-widest text-shadow-env select-none pointer-events-auto cursor-pointer transition-all duration-[250ms] antialiased text-env-text constellation-label",
                    // Prevent Work With Me and Recommendations wrapping — they must stay on one line
                    node.id === "work-with-me" || node.id === "recommendations" ? "whitespace-nowrap" : "",
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
