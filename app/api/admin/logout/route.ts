import { NextRequest, NextResponse } from "next/server";
import { isCsrfValid } from "@/lib/csrf";
import { verifySessionToken } from "@/lib/session";
import { logAdminActivity } from "@/lib/audit";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. CSRF Verification
  if (!isCsrfValid(req)) {
    return NextResponse.json(
      { success: false, error: "Forbidden. CSRF origin mismatch." },
      { status: 403 }
    );
  }

  let adminEmail = "unknown";
  const sessionCookie = req.cookies.get("admin_session")?.value;
  if (sessionCookie) {
    const session = await verifySessionToken(sessionCookie);
    if (session) {
      adminEmail = session.email;
    }
  }

  // Log audit logout activity
  await logAdminActivity(adminEmail, "logout", "auth", "logout_button", req);

  const response = NextResponse.json({ success: true });
  
  // Clear cookie by setting expired cookie parameters
  response.cookies.set({
    name: "admin_session",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    path: "/"
  });

  return response;
}
