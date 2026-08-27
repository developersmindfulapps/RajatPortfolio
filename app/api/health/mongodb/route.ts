import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB_NAME || "PersonalPortfolio");
    
    // Run a ping command to verify the connection health
    await db.command({ ping: 1 });
    
    return NextResponse.json({ success: true, status: "healthy" });
  } catch (error: any) {
    console.error("[health-check] MongoDB health check failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Database service unavailable." 
      },
      { status: 503 }
    );
  }
}

