import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { verifySessionToken } from "@/lib/session";
import { isCsrfValid } from "@/lib/csrf";
import { logAdminActivity } from "@/lib/audit";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

// ─── Security Helpers ─────────────────────────────────────────────────────────

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isValidObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}

async function requireAdminSession(req: NextRequest) {
  const sessionCookie = req.cookies.get("admin_session")?.value;
  return sessionCookie ? await verifySessionToken(sessionCookie) : null;
}

// GET: Fetch all active messages
export async function GET(req: NextRequest): Promise<NextResponse> {
  // 1. Authenticate
  const session = await requireAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() ?? "";

    const contacts = await getCollection("contact_submissions");

    const searchFilter: Record<string, any> = {};

    if (search) {
      const safeSearch = escapeRegex(search.slice(0, 100));
      searchFilter.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { email: { $regex: safeSearch, $options: "i" } }
      ];
    }

    // Unread messages should appear first, followed by others (read/archived), sorted newest first
    const unreadMessages = await contacts
      .find({ ...searchFilter, status: "unread" })
      .sort({ createdAt: -1 })
      .toArray();

    const otherMessages = await contacts
      .find({ ...searchFilter, status: { $in: ["read", "archived"] } })
      .sort({ createdAt: -1 })
      .toArray();

    const allMessages = [...unreadMessages, ...otherMessages];

    return NextResponse.json(
      {
        success: true,
        messages: allMessages
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate"
        }
      }
    );
  } catch (error) {
    console.error("[admin-contact-get] Failed to fetch contacts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load messages." },
      { status: 500 }
    );
  }
}

// PATCH: Update message status (read, archived, unread)
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  // 1. CSRF Verification
  if (!isCsrfValid(req)) {
    return NextResponse.json(
      { success: false, error: "Forbidden. CSRF origin mismatch." },
      { status: 403 }
    );
  }

  // 2. Authenticate and resolve admin email
  const session = await requireAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "ID and status are required." },
        { status: 400 }
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid message ID format." },
        { status: 400 }
      );
    }

    if (!["unread", "read", "archived"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value." },
        { status: 400 }
      );
    }

    const contacts = await getCollection("contact_submissions");
    const result = await contacts.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Message not found." },
        { status: 404 }
      );
    }

    // 3. Log admin action to audit trail
    let auditAction = "contact_status_updated";
    if (status === "read") auditAction = "contact_marked_read";
    else if (status === "archived") auditAction = "contact_archived";
    else if (status === "unread") auditAction = "contact_marked_unread";

    await logAdminActivity(
      session.email,
      auditAction,
      "contact",
      id,
      req
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin-contact-patch] Failed to update message:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update message." },
      { status: 500 }
    );
  }
}

// DELETE: Permanently delete a message
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  // 1. CSRF Verification
  if (!isCsrfValid(req)) {
    return NextResponse.json(
      { success: false, error: "Forbidden. CSRF origin mismatch." },
      { status: 403 }
    );
  }

  // 2. Authenticate and resolve admin email
  const session = await requireAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Message ID is required." },
        { status: 400 }
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid message ID format." },
        { status: 400 }
      );
    }

    const contacts = await getCollection("contact_submissions");
    const result = await contacts.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Message not found." },
        { status: 404 }
      );
    }

    // 3. Log delete action to audit trail
    await logAdminActivity(
      session.email,
      "contact_deleted",
      "contact",
      id,
      req
    );

    return NextResponse.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    console.error("[admin-contact-delete] Failed to delete message:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete message." },
      { status: 500 }
    );
  }
}
