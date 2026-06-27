/**
 * CSRF Protection Helper.
 * Validates that the request's Origin (or Referer as a fallback) matches the current Host.
 * Prevents Cross-Site Request Forgery for state-changing endpoints (POST, PATCH, PUT, DELETE).
 */
export function isCsrfValid(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");

  if (!host) {
    return false;
  }

  // Browser mutation requests should have an Origin or Referer header
  if (!origin) {
    const referer = request.headers.get("referer");
    if (!referer) {
      return false;
    }
    try {
      const refererUrl = new URL(referer);
      return refererUrl.host === host;
    } catch (_) {
      return false;
    }
  }

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch (_) {
    return false;
  }
}
