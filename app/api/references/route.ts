import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { isRateLimited } from "@/lib/rateLimit";
import { Reference } from "@/types/reference";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// HTML escaping helper to prevent XSS injection
function sanitizeInput(val: string): string {
  if (typeof val !== "string") return "";
  return val
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Basic URL validation
function isValidUrl(val: string): boolean {
  if (!val) return false;
  try {
    const parsed = new URL(val);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_) {
    return false;
  }
}

/**
 * GET /api/references
 * Returns a list of only approved recommendations
 */
export async function GET() {
  try {
    const collection = await getCollection<Reference>("references");
    
    // Fetch only recommendations with status 'approved'
    // Do not include the internal MongoDB _id in the returned array to protect details
    const approvedList = await collection
      .find({ status: "approved" })
      .project({ _id: 0 })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(approvedList);
  } catch (error: any) {
    console.error("GET References Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve recommendations." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/references
 * Submits a new recommendation (initially pending moderation)
 */
export async function POST(request: Request) {
  try {
    // 1. Resolve client IP and run rate limiting checks
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const rateResult = isRateLimited(ip);
    if (rateResult.limited) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Too many submissions. Please try again in 24 hours." 
        },
        { 
          status: 429,
          headers: {
            "Retry-After": Math.ceil((rateResult.resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }

    // 2. Parse request body
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request payload." },
        { status: 400 }
      );
    }

    // 3. Validation & Sanitization
    const name = sanitizeInput(body.name);
    const relationship = body.relationship;
    const comment = sanitizeInput(body.comment);
    const company = body.company ? sanitizeInput(body.company) : undefined;
    const linkedin = body.linkedin ? body.linkedin.trim() : undefined;
    const sourceToken = body.sourceToken ? sanitizeInput(body.sourceToken) : undefined;

    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required." }, { status: 400 });
    }

    const validRelationships = ["coworker", "client", "manager"];
    if (!relationship || !validRelationships.includes(relationship)) {
      return NextResponse.json(
        { success: false, error: "Valid relationship is required (coworker, client, manager)." },
        { status: 400 }
      );
    }

    if (!comment) {
      return NextResponse.json({ success: false, error: "Comment is required." }, { status: 400 });
    }

    if (comment.length > 1200) {
      return NextResponse.json(
        { success: false, error: "Comment cannot exceed 1200 characters." },
        { status: 400 }
      );
    }

    if (linkedin && !isValidUrl(linkedin)) {
      return NextResponse.json(
        { success: false, error: "Invalid LinkedIn URL format." },
        { status: 400 }
      );
    }

    // 4. Create and Save Document
    const collection = await getCollection<Reference>("references");

    const newRecommendation: Reference = {
      publicId: crypto.randomUUID(), // Stable identifier for public/admin lookup
      name,
      relationship: relationship as "coworker" | "client" | "manager",
      comment,
      company,
      linkedin,
      approved: false, // Moderation flag (backwards compatibility)
      status: "pending", // Primary moderation status
      sourceToken,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await collection.insertOne(newRecommendation);

    return NextResponse.json(
      { 
        success: true, 
        message: "Recommendation submitted successfully." 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Reference Error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while submitting your recommendation." },
      { status: 500 }
    );
  }
}
