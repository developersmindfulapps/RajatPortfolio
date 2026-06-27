import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const analytics = await getCollection("analytics_events");

    const totalEvents = await analytics.countDocuments({});

    // 1. Popular Pages (route hits where eventType is portfolio_visit)
    const popularPages = await analytics
      .aggregate([
        { $match: { eventType: "portfolio_visit" } },
        { $group: { _id: "$route", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
      .toArray();

    // 2. Project Clicks (grouped by project field)
    const projectClicks = await analytics
      .aggregate([
        { $match: { eventType: "project_click" } },
        { $group: { _id: "$project", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
      .toArray();

    // 3. Asset Downloads / Views
    const resumeViews = await analytics.countDocuments({ eventType: "resume_view" });
    const cvDownloads = await analytics.countDocuments({ eventType: "cv_download" });

    // 4. Detailed Event log (last 50 events)
    const eventsLog = await analytics
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({
      success: true,
      data: {
        totalEvents,
        popularPages: popularPages.map(item => ({
          page: item._id || "/",
          count: item.count
        })),
        projectClicks: projectClicks.map(item => ({
          project: item._id || "unknown",
          count: item.count
        })),
        assets: [
          { name: "Resume View (New Tab)", count: resumeViews },
          { name: "CV Download", count: cvDownloads }
        ],
        eventsLog
      }
    });
  } catch (error) {
    console.error("[admin-analytics-api] Failed to gather analytics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load analytics statistics." },
      { status: 500 }
    );
  }
}
