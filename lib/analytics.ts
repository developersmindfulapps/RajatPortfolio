/**
 * Analytics helper — wraps @vercel/analytics/react `track()` and logs to custom MongoDB endpoint.
 *
 * All functions are fire-and-forget: errors are silently caught so
 * a tracking failure never interrupts user interactions.
 */
import { track } from "@vercel/analytics";

// Helper to generate or retrieve sessionStorage session ID safely
function getSessionId(): string {
  if (typeof window === "undefined" || !window.sessionStorage) return "";
  try {
    let session = sessionStorage.getItem("portfolio_session_id");
    if (!session) {
      session = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("portfolio_session_id", session);
    }
    return session;
  } catch {
    return "session_fallback";
  }
}

// Simple browser detector
function getBrowserName(): string {
  if (typeof window === "undefined" || !navigator) return "unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("SamsungBrowser")) return "Samsung Browser";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  if (ua.includes("Trident")) return "Internet Explorer";
  if (ua.includes("Edge") || ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  return "other";
}

// Simple device type detector
function getDeviceType(): string {
  if (typeof window === "undefined") return "unknown";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function safeTrack(event: string, properties?: Record<string, string>): void {
  // 1. Send to Vercel Analytics (non-blocking)
  try {
    track(event, properties);
  } catch {
    // Ignore Vercel errors
  }

  // 2. Log to MongoDB API route (fire-and-forget, non-blocking)
  if (typeof window !== "undefined") {
    // Run asynchronously in a detached promise context to guarantee no UI blocks
    Promise.resolve().then(async () => {
      try {
        const route = window.location.pathname;
        const referrer = document.referrer || "";
        const browser = getBrowserName();
        const deviceType = getDeviceType();
        const sessionId = getSessionId();

        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType: event,
            route,
            referrer,
            deviceType,
            browser,
            sessionId,
            ...properties
          })
        });
      } catch (error) {
        // Silently catch all DB logging failures so they never propagate to the user
      }
    });
  }
}

/** Fired when the recruiter clicks "View Resume" (opens PDF in new tab). */
export function trackResumeView(): void {
  safeTrack("resume_view");
}

/** Fired when the recruiter clicks "Download CV" (triggers browser download). */
export function trackCvDownload(): void {
  safeTrack("cv_download");
}

/** Fired when the recruiter clicks "View Experience" CTA button. */
export function trackExperienceClick(): void {
  safeTrack("experience_cta_click");
}

/** Fired when the recruiter clicks a project's external "Visit Website" link. */
export function trackProjectClick(projectName: string): void {
  safeTrack("project_click", { project: projectName });
}

/** Fired only after a successful contact form submission (never on errors). */
export function trackContactSubmission(): void {
  safeTrack("contact_submission");
}

/** Fired when the recruiter opens the recommendations panel. */
export function trackRecommendationsPanelOpen(): void {
  safeTrack("recommendations_panel_open");
}

/** Fired when a page view is tracked (mount of main page or experience page). */
export function trackPageView(pageName: string): void {
  safeTrack("portfolio_visit", { page: pageName });
}

/** Fired when a new recommendation is submitted on the client side. */
export function trackRecommendationSubmission(): void {
  safeTrack("recommendation_submission");
}
