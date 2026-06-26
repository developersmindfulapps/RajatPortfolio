type RateLimitRecord = {
  timestamps: number[];
};

// In-memory cache for IP tracking (rolling window)
const ipStore = new Map<string, RateLimitRecord>();

const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_LIMIT = 3; // Maximum 3 submissions per rolling window

/**
 * Checks if a given client IP has exceeded the submission rate limit.
 * Implements a rolling 24-hour window limit per client IP.
 */
export function isRateLimited(ip: string): { limited: boolean; resetTime: number; count: number } {
  const now = Date.now();
  let record = ipStore.get(ip);

  if (!record) {
    record = { timestamps: [] };
    ipStore.set(ip, record);
  }

  // Remove timestamps that have fallen out of the rolling 24-hour window
  record.timestamps = record.timestamps.filter(t => now - t < WINDOW_MS);

  if (record.timestamps.length >= MAX_LIMIT) {
    // The reset time is when the oldest active request in the window expires
    const oldestTimestamp = record.timestamps[0];
    const resetTime = oldestTimestamp + WINDOW_MS;
    return { limited: true, resetTime, count: record.timestamps.length };
  }

  // Record this attempt
  record.timestamps.push(now);

  const resetTime = record.timestamps[0] + WINDOW_MS;
  return { limited: false, resetTime, count: record.timestamps.length };
}
