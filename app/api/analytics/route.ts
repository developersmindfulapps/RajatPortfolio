import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

interface AnalyticsEvent {
  eventType: string;
  timestamp: Date;
  route: string;
  referrer: string;
  deviceType: string;
  browser: string;
  sessionId: string;
  country: string | null;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    const {
      eventType,
      route = "/",
      referrer = "",
      deviceType = "unknown",
      browser = "unknown",
      sessionId = ""
    } = body;

    if (!eventType) {
      return NextResponse.json(
        { success: false, error: "Event type is required." },
        { status: 400 }
      );
    }

    const country = req.headers.get("x-vercel-ip-country") || null;

    const event: AnalyticsEvent = {
      eventType,
      timestamp: new Date(),
      route,
      referrer,
      deviceType,
      browser,
      sessionId,
      country
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
