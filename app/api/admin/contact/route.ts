import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { verifySessionToken } from "@/lib/session";
import { isCsrfValid } from "@/lib/csrf";
import { logAdminActivity } from "@/lib/audit";
import { ObjectId } from "mongodb";

// GET: Fetch all active messages (excluding soft-deleted ones)
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() ?? "";

    const contacts = await getCollection("contact_submissions");

    // Base filter: exclude soft-deleted messages
    const filter: any = { status: { $ne: "deleted" } };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    // Unread messages should appear first, followed by others, sorted newest first
    const unreadMessages = await contacts
      .find({ ...filter, status: "unread" })
      .sort({ createdAt: -1 })
      .toArray();

    const otherMessages = await contacts
      .find({ ...filter, status: { $ne: "unread" } })
      .sort({ createdAt: -1 })
      .toArray();

    const allMessages = [...unreadMessages, ...otherMessages];

    return NextResponse.json({
      success: true,
      messages: allMessages
    });
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
  const sessionCookie = req.cookies.get("admin_session")?.value;
  const session = sessionCookie ? await verifySessionToken(sessionCookie) : null;
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

    if (!["unread", "read", "archived", "deleted"].includes(status)) {
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
    else if (status === "deleted") auditAction = "contact_soft_deleted";

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

// DELETE: Soft delete a message (sets status to "deleted")
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  // 1. CSRF Verification
  if (!isCsrfValid(req)) {
    return NextResponse.json(
      { success: false, error: "Forbidden. CSRF origin mismatch." },
      { status: 403 }
    );
  }

  // 2. Authenticate and resolve admin email
  const sessionCookie = req.cookies.get("admin_session")?.value;
  const session = sessionCookie ? await verifySessionToken(sessionCookie) : null;
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

    const contacts = await getCollection("contact_submissions");
    const result = await contacts.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "deleted", updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Message not found." },
        { status: 404 }
      );
    }

    // 3. Log soft delete action to audit trail
    await logAdminActivity(
      session.email,
      "contact_soft_deleted",
      "contact",
      id,
      req
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin-contact-delete] Failed to soft delete message:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete message." },
      { status: 500 }
    );
  }
}
