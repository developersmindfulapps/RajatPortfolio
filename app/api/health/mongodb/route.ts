import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB_NAME || "PersonalPortfolio");
    
    // Run a ping command to verify the connection health
    await db.command({ ping: 1 });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("MongoDB health check failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to establish a connection to MongoDB Atlas" 
      },
      { status: 500 }
    );
  }
}
