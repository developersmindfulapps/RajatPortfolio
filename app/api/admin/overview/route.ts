import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { verifySessionToken } from "@/lib/session";
import { getLastLoginTime } from "@/lib/audit";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const sessionCookie = req.cookies.get("admin_session")?.value;
  if (!sessionCookie) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Session cookie missing." },
      { status: 401 }
    );
  }

  const session = await verifySessionToken(sessionCookie);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Session invalid." },
      { status: 401 }
    );
  }

  try {
    const analytics = await getCollection("analytics_events");
    const references = await getCollection("references");
    const contacts = await getCollection("contact_submissions");

    // 1. Fetch Counts
    const portfolioVisits = await analytics.countDocuments({ 
      eventType: "portfolio_visit", 
      route: "/" 
    });
    const resumeViews = await analytics.countDocuments({ eventType: "resume_view" });
    const cvDownloads = await analytics.countDocuments({ eventType: "cv_download" });
    const experienceViews = await analytics.countDocuments({ 
      eventType: "portfolio_visit", 
      route: "/experience" 
    });
    const projectClicks = await analytics.countDocuments({ eventType: "project_click" });
    
    const approvedRecs = await references.countDocuments({ status: "approved" });
    const pendingRecs = await references.countDocuments({ status: "pending" });
    
    // Count active messages excluding soft-deleted ones
    const contactMessagesCount = await contacts.countDocuments({ status: { $ne: "deleted" } });

    // 2. Fetch Last Login Time
    const lastLogin = await getLastLoginTime(session.email);

    // 3. Fetch Recent Activity Logs (top 10 newest first)
    const recentActivity = await analytics
      .find({})
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({
      success: true,
      stats: {
        portfolioVisits,
        resumeViews,
        cvDownloads,
        experienceViews,
        projectClicks,
        approvedRecs,
        pendingRecs,
        contactMessagesCount,
      },
      lastLogin,
      recentActivity,
    });
  } catch (error) {
    console.error("[admin-overview-api] Failed to gather overview stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load overview data." },
      { status: 500 }
    );
  }
}
