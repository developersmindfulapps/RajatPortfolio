import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signSessionToken } from "@/lib/session";
import { isCsrfValid } from "@/lib/csrf";
import { logAdminActivity } from "@/lib/audit";
import { loginRateLimiter } from "@/lib/loginRateLimit";

interface LoginPayload {
  email: string;
  password?: string;
  turnstileToken?: string;
}

interface TurnstileVerifyResponse {
  success: boolean;
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("[admin-login] TURNSTILE_SECRET_KEY is not set.");
    return false;
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }).toString(),
      }
    );
    const data: TurnstileVerifyResponse = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("[admin-login] Turnstile fetch error:", error);
    return false;
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // 1. CSRF Verification
    if (!isCsrfValid(req)) {
      return NextResponse.json(
        { success: false, error: "Forbidden. CSRF origin mismatch." },
        { status: 403 }
      );
    }

    // 2. Resolve Client IP
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // 3. Check Login Rate Limiting
    const rateCheck = await loginRateLimiter.checkLimit(ip);
    if (rateCheck.blocked) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed attempts. Login is temporarily blocked. Try again in ${rateCheck.secondsRemaining} seconds.`
        },
        { status: 429 }
      );
    }

    // 4. Parse Body
    const body: Partial<LoginPayload> = await req.json();
    const email = body.email?.trim() ?? "";
    const password = body.password ?? "";
    const turnstileToken = body.turnstileToken ?? "";

    if (!email || !password || !turnstileToken) {
      return NextResponse.json(
        { success: false, error: "Email, password, and verification are required." },
        { status: 400 }
      );
    }

    // 5. Cloudflare Turnstile Verification
    const turnstileOk = await verifyTurnstile(turnstileToken);
    if (!turnstileOk) {
      return NextResponse.json(
        { success: false, error: "Human verification failed. Please try again." },
        { status: 403 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminPasswordHash) {
      console.error("[admin-login] Admin credentials are not set in environment variables.");
      return NextResponse.json(
        { success: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    // 6. Verify Admin Email & Password
    const emailMatches = email.toLowerCase() === adminEmail.toLowerCase();
    const passwordMatches = emailMatches && bcrypt.compareSync(password, adminPasswordHash);

    if (!passwordMatches) {
      // Record rate limit failure
      await loginRateLimiter.recordFailure(ip);

      // Audit log failed login
      await logAdminActivity(
        email || "unknown",
        "login_failed",
        "auth",
        "login_form",
        req
      );

      return NextResponse.json(
        { success: false, error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // 7. Successful Authentication
    await loginRateLimiter.resetLimit(ip);

    // Create session token (default 8 hours)
    const token = await signSessionToken(adminEmail);

    // Audit log successful login
    await logAdminActivity(adminEmail, "login", "auth", "login_form", req);

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: "admin_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60, // 8 hours in seconds
      path: "/"
    });

    return response;
  } catch (error) {
    console.error("[admin-login-api] Unexpected login error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
