import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { Reference } from "@/types/reference";
import { ObjectId } from "mongodb";

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

function isAuthorized(request: Request): boolean {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    return false;
  }

  // 1. Check custom X-Admin-Secret header
  const customHeader = request.headers.get("x-admin-secret");
  if (customHeader && customHeader.trim() === adminSecret) {
    return true;
  }

  // 2. Check standard Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    const token = authHeader.replace(/^bearer\s+/i, "").trim();
    if (token === adminSecret) {
      return true;
    }
  }

  // 3. Placeholder for future session-based authentication via HTTP-only cookie
  // Checks for the presence of an admin_session cookie
  const cookieHeader = request.headers.get("cookie") || "";
  const hasAdminSession = cookieHeader.includes("admin_session=");
  if (hasAdminSession) {
    // TODO: Verify session signature in future session-based admin dashboard integrations.
    // For now, presence of cookie acts as placeholder without bypassing bearer/secret check.
  }

  return false;
}

/**
 * PATCH /api/references/[id]
 * Updates approved/status, comment, company, or linkedin properties
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin secret required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request payload." },
        { status: 400 }
      );
    }

    // Resilience check: support lookup by both MongoDB ObjectId or stable UUID publicId
    const filter: any = {};
    if (ObjectId.isValid(id)) {
      filter._id = new ObjectId(id);
    } else {
      filter.publicId = id;
    }

    const updates: any = {};

    // 1. Sync moderation fields (status vs approved)
    if (body.status !== undefined) {
      if (!["pending", "approved", "rejected"].includes(body.status)) {
        return NextResponse.json(
          { success: false, error: "Invalid status value. Must be pending, approved, or rejected." },
          { status: 400 }
        );
      }
      updates.status = body.status;
      updates.approved = body.status === "approved";
    } else if (body.approved !== undefined) {
      updates.approved = !!body.approved;
      updates.status = updates.approved ? "approved" : "pending";
    }

    // 2. Validate optional update properties
    if (body.comment !== undefined) {
      const comment = sanitizeInput(body.comment);
      if (!comment) {
        return NextResponse.json({ success: false, error: "Comment cannot be empty." }, { status: 400 });
      }
      if (comment.length > 1200) {
        return NextResponse.json({ success: false, error: "Comment cannot exceed 1200 characters." }, { status: 400 });
      }
      updates.comment = comment;
    }

    if (body.company !== undefined) {
      updates.company = sanitizeInput(body.company) || null;
    }

    if (body.linkedin !== undefined) {
      const linkedin = body.linkedin.trim();
      if (linkedin && !isValidUrl(linkedin)) {
        return NextResponse.json({ success: false, error: "Invalid LinkedIn URL format." }, { status: 400 });
      }
      updates.linkedin = linkedin || null;
    }

    // Always record update timing
    updates.updatedAt = new Date();

    const collection = await getCollection<Reference>("references");
    const result = await collection.updateOne(filter, { $set: updates });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Recommendation not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Recommendation updated successfully."
    });
  } catch (error: any) {
    console.error("PATCH Reference Error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while updating the recommendation." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/references/[id]
 * Deletes a recommendation from the database
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin secret required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    // Support lookup by both MongoDB ObjectId or stable UUID publicId
    const filter: any = {};
    if (ObjectId.isValid(id)) {
      filter._id = new ObjectId(id);
    } else {
      filter.publicId = id;
    }

    const collection = await getCollection<Reference>("references");
    const result = await collection.deleteOne(filter);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Recommendation not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Recommendation deleted successfully."
    });
  } catch (error: any) {
    console.error("DELETE Reference Error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while deleting the recommendation." },
      { status: 500 }
    );
  }
}
