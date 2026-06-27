import { getCollection } from "./mongodb";

export interface AdminActivity {
  adminEmail: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: Date;
  ip?: string;
}

/**
 * Automatically logs an administrative action in the admin_activity collection.
 */
export async function logAdminActivity(
  adminEmail: string,
  action: string,
  entity: string,
  entityId: string,
  request?: Request
): Promise<void> {
  try {
    let ip = "127.0.0.1";
    if (request) {
      const forwardedFor = request.headers.get("x-forwarded-for");
      ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
    }

    const activity: AdminActivity = {
      adminEmail,
      action,
      entity,
      entityId,
      timestamp: new Date(),
      ip,
    };

    const collection = await getCollection<AdminActivity>("admin_activity");
    await collection.insertOne(activity);
  } catch (error) {
    console.error("[audit] Failed to log admin activity:", error);
  }
}

/**
 * Returns the second-most-recent successful login timestamp for an admin.
 * This represents their "last login" prior to the current active session.
 */
export async function getLastLoginTime(adminEmail: string): Promise<Date | null> {
  try {
    const collection = await getCollection<AdminActivity>("admin_activity");
    const loginLogs = await collection
      .find({ adminEmail, action: "login" })
      .sort({ timestamp: -1 })
      .skip(1) // Skip current login session
      .limit(1)
      .toArray();

    return loginLogs.length > 0 ? loginLogs[0].timestamp : null;
  } catch (error) {
    console.error("[audit] Failed to fetch last login time:", error);
    return null;
  }
}
