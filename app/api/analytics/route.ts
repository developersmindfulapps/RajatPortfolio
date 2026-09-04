import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

const ALLOWED_EVENT_TYPES = new Set([
  "portfolio_visit",
  "project_click",
  "resume_view",
  "cv_download",
  "experience_cta_click",
  "contact_submission",
  "recommendations_panel_open",
  "recommendation_submission"
]);

interface AnalyticsEvent {
  eventType: string;
  timestamp: Date;
  route: string;
  referrer: string;
  deviceType: string;
  browser: string;
  sessionId: string;
  country: string | null;
  project?: string;
  page?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid payload." },
        { status: 400 }
      );
    }

    const {
      eventType,
      route = "/",
      referrer = "",
      deviceType = "unknown",
      browser = "unknown",
      sessionId = "",
      project,
      page
    } = body;

    if (!eventType || typeof eventType !== "string" || !ALLOWED_EVENT_TYPES.has(eventType)) {
      return NextResponse.json(
        { success: false, error: "Invalid or unsupported event type." },
        { status: 400 }
      );
    }

    const country = req.headers.get("x-vercel-ip-country") || null;

    let cleanRoute = "/";
    if (typeof route === "string" && route.trim().length > 0) {
      cleanRoute = route.trim().slice(0, 100);
      if (!cleanRoute.startsWith("/")) {
        cleanRoute = "/" + cleanRoute;
      }
    }

    const event: AnalyticsEvent = {
      eventType,
      timestamp: new Date(),
      route: cleanRoute,
      referrer: String(referrer).slice(0, 300),
      deviceType: String(deviceType).slice(0, 50),
      browser: String(browser).slice(0, 50),
      sessionId: String(sessionId).slice(0, 100),
      country: country ? String(country).slice(0, 10) : null,
      ...(project && typeof project === "string" ? { project: project.trim().slice(0, 100) } : {}),
      ...(page && typeof page === "string" ? { page: page.trim().slice(0, 100) } : {})
    };

    const collection = await getCollection<AnalyticsEvent>("analytics_events");
    await collection.insertOne(event);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[analytics-api] Failed to save event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log event." },
      { status: 500 }
    );
  }
}
