import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getCollection } from "@/lib/mongodb";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactPayload {
  name: string;
  email: string;
  message: string;
  turnstileToken: string;
}

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function validatePayload(body: Partial<ContactPayload>): string | null {
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || name.length < 2) {
    return "Name must be at least 2 characters.";
  }
  if (name.length > 100) {
    return "Name cannot exceed 100 characters.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email) || email.length > 254) {
    return "A valid email address is required (max 254 characters).";
  }

  if (!message || message.length < 10) {
    return "Message must be at least 10 characters.";
  }
  if (message.length > 5000) {
    return "Message cannot exceed 5000 characters.";
  }

  if (!body.turnstileToken) {
    return "Verification token is missing. Please complete the CAPTCHA.";
  }

  return null;
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("[contact] TURNSTILE_SECRET_KEY is not set.");
    return false;
  }

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
}

// ─── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: Partial<ContactPayload> = await req.json();

    // 1. Input validation
    const validationError = validatePayload(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const name = body.name!.trim();
    const email = body.email!.trim();
    const message = body.message!.trim();
    const turnstileToken = body.turnstileToken!;

    // 2. Lazy-initialize Resend (avoids module-level errors during build)
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[contact] RESEND_API_KEY is not set.");
      return NextResponse.json(
        { error: "Server configuration error. Please try again later." },
        { status: 500 }
      );
    }
    const resend = new Resend(apiKey);

    // 3. Turnstile verification — reject before touching Resend
    const turnstileOk = await verifyTurnstile(turnstileToken);
    if (!turnstileOk) {
      return NextResponse.json(
        { error: "Human verification failed. Please try again." },
        { status: 403 }
      );
    }

    // 4. Check required env vars
    const contactEmail = process.env.CONTACT_EMAIL;
    if (!contactEmail) {
      console.error("[contact] CONTACT_EMAIL is not set.");
      return NextResponse.json(
        { error: "Server configuration error. Please try again later." },
        { status: 500 }
      );
    }

    // 4.5. Save submission to MongoDB
    try {
      const collection = await getCollection("contact_submissions");
      await collection.insertOne({
        name,
        email,
        message,
        status: "unread",
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (dbErr) {
      console.error("[contact-api] Failed to save contact submission to MongoDB:", dbErr);
    }

    // 5. Send email via Resend with HTML-escaped content
    const timestamp = new Date().toLocaleString("en-GB", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);

    const { error: resendError } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [contactEmail],
      replyTo: email,
      subject: "New Portfolio Contact Request",
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111827; background: #f9fafb; border-radius: 12px;">
          <h2 style="margin-top: 0; font-size: 20px; color: #111827;">📬 New Contact Request</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; width: 80px;">Name</td>
              <td style="padding: 8px 0; font-size: 14px;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Email</td>
              <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${safeEmail}" style="color: #2563eb;">${safeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Sent</td>
              <td style="padding: 8px 0; font-size: 14px;">${timestamp}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <h3 style="margin-top: 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Message</h3>
          <p style="font-size: 15px; line-height: 1.6; white-space: pre-wrap; margin: 0;">${safeMessage}</p>
        </div>
      `,
    });

    if (resendError) {
      console.error("[contact] Resend error:", resendError);
      return NextResponse.json(
        { error: "Failed to send your message. Please try again later." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
