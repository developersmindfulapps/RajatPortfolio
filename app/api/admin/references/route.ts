import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { verifySessionToken } from "@/lib/session";
import { isCsrfValid } from "@/lib/csrf";
import { logAdminActivity } from "@/lib/audit";
import { ObjectId } from "mongodb";

// GET: Fetch references filtered by status and optional search (name or company)
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") ?? "pending";
    const search = searchParams.get("search")?.trim() ?? "";

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status filter." },
        { status: 400 }
      );
    }

    const references = await getCollection("references");
    const filter: any = { status };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } }
      ];
    }

    const results = await references
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      references: results
    });
  } catch (error) {
    console.error("[admin-references-get] Failed to fetch references:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load recommendations." },
      { status: 500 }
    );
  }
}

// PATCH: Update recommendation status (approved, rejected, pending)
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  // 1. CSRF Verification
  if (!isCsrfValid(req)) {
    return NextResponse.json(
      { success: false, error: "Forbidden. CSRF origin mismatch." },
      { status: 403 }
    );
  }

  // 2. Authenticate
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

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value." },
        { status: 400 }
      );
    }

    const references = await getCollection("references");
    const approvedFlag = status === "approved";

    const result = await references.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status, 
          approved: approvedFlag, 
          updatedAt: new Date() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Recommendation not found." },
        { status: 404 }
      );
    }

    // 3. Log audit action
    const auditAction = status === "approved" 
      ? "recommendation_approved" 
      : status === "rejected" 
      ? "recommendation_rejected" 
      : "recommendation_marked_pending";

    await logAdminActivity(
      session.email,
      auditAction,
      "recommendation",
      id,
      req
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin-references-patch] Failed to update reference:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update recommendation." },
      { status: 500 }
    );
  }
}

// DELETE: Permanently delete a recommendation
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  // 1. CSRF Verification
  if (!isCsrfValid(req)) {
    return NextResponse.json(
      { success: false, error: "Forbidden. CSRF origin mismatch." },
      { status: 403 }
    );
  }

  // 2. Authenticate
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
        { success: false, error: "Recommendation ID is required." },
        { status: 400 }
      );
    }

    const references = await getCollection("references");
    const result = await references.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Recommendation not found." },
        { status: 404 }
      );
    }

    // 3. Log audit action
    await logAdminActivity(
      session.email,
      "recommendation_deleted",
      "recommendation",
      id,
      req
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin-references-delete] Failed to delete reference:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete recommendation." },
      { status: 500 }
    );
  }
}
