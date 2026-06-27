import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "./lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bypass login API route
  if (pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("admin_session")?.value;
  const isAuthenticated = sessionCookie ? await verifySessionToken(sessionCookie) : null;

  // 2. Handle API routes under /api/admin/*
  if (pathname.startsWith("/api/admin/")) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 3. Handle dashboard subpages (/admin/*)
  if (pathname !== "/admin") {
    if (!isAuthenticated) {
      // Redirect unauthenticated requests to the login screen
      const loginUrl = new URL("/admin", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 4. Handle login page (/admin)
  if (pathname === "/admin") {
    if (isAuthenticated) {
      // Redirect already authenticated users to the overview dashboard
      const overviewUrl = new URL("/admin/overview", request.url);
      return NextResponse.redirect(overviewUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
