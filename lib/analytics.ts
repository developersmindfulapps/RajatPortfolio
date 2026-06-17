/**
 * Analytics helper — wraps @vercel/analytics/react `track()`.
 *
 * All functions are fire-and-forget: errors are silently caught so
 * a tracking failure never interrupts user interactions.
 */
import { track } from "@vercel/analytics";

function safeTrack(event: string, properties?: Record<string, string>): void {
  try {
    track(event, properties);
  } catch {
    // Never let analytics failures surface to the user
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

/**
 * Fired when the recruiter clicks a project's external "Visit Website" link.
 * @param projectName - slug used as the `project` property in Vercel Analytics.
 *   Examples: "law-practice-platform", "eventually", "future-project"
 */
export function trackProjectClick(projectName: string): void {
  safeTrack("project_click", { project: projectName });
}

/** Fired only after a successful contact form submission (never on errors). */
export function trackContactSubmission(): void {
  safeTrack("contact_submission");
}
