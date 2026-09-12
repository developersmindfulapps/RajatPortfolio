import type { NextRequest } from "next/server";

interface RateLimitEntry {
  shortTimestamps: number[];
  longTimestamps: number[];
}

const ipStore = new Map<string, RateLimitEntry>();

const SHORT_WINDOW_MS = 60 * 1000; // 1 minute
const SHORT_MAX_REQUESTS = 15; // 15 requests per minute

const LONG_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const LONG_MAX_REQUESTS = 60; // 60 requests per hour

/**
 * Extracts client IP from standard Next.js request headers.
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Validates whether the client IP has exceeded the rolling rate limits.
 */
export function isAiRateLimited(ip: string): { limited: boolean; retryAfterSeconds?: number; reason?: string } {
  const now = Date.now();
  let entry = ipStore.get(ip);

  if (!entry) {
    entry = { shortTimestamps: [], longTimestamps: [] };
    ipStore.set(ip, entry);
  }

  // Purge expired timestamps
  entry.shortTimestamps = entry.shortTimestamps.filter((t) => now - t < SHORT_WINDOW_MS);
  entry.longTimestamps = entry.longTimestamps.filter((t) => now - t < LONG_WINDOW_MS);

  if (entry.shortTimestamps.length >= SHORT_MAX_REQUESTS) {
    const oldest = entry.shortTimestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + SHORT_WINDOW_MS - now) / 1000);
    return {
      limited: true,
      retryAfterSeconds: Math.max(retryAfterSeconds, 1),
      reason: "Too many messages in a short period. Please wait a moment before sending another message.",
    };
  }

  if (entry.longTimestamps.length >= LONG_MAX_REQUESTS) {
    const oldest = entry.longTimestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + LONG_WINDOW_MS - now) / 1000);
    return {
      limited: true,
      retryAfterSeconds: Math.max(retryAfterSeconds, 1),
      reason: "Hourly conversational rate limit reached. Please try again later or reach Rajat directly via email.",
    };
  }

  // Record this request
  entry.shortTimestamps.push(now);
  entry.longTimestamps.push(now);

  return { limited: false };
}

export interface ChatMessagePayload {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Validates conversation payload structure and lengths.
 */
export function validateChatPayload(body: unknown): { valid: boolean; error?: string; messages?: ChatMessagePayload[] } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request payload." };
  }

  const { messages } = body as { messages?: unknown };

  if (!Array.isArray(messages) || messages.length === 0) {
    return { valid: false, error: "Messages must be a non-empty array." };
  }

  if (messages.length > 20) {
    return { valid: false, error: "Conversation history exceeds the maximum limit (20 messages)." };
  }

  const sanitized: ChatMessagePayload[] = [];
  let totalChars = 0;

  for (let i = 0; i < messages.length; i++) {
    const item = messages[i];
    if (!item || typeof item !== "object") {
      return { valid: false, error: `Invalid message format at position ${i}.` };
    }

    const { role, content } = item as { role?: unknown; content?: unknown };

    if (role !== "user" && role !== "assistant" && role !== "system") {
      return { valid: false, error: `Invalid message role '${String(role)}' at position ${i}.` };
    }

    if (typeof content !== "string") {
      return { valid: false, error: `Message content must be a string at position ${i}.` };
    }

    const trimmed = content.trim();
    if (i === messages.length - 1 && role === "user" && trimmed.length === 0) {
      return { valid: false, error: "User message cannot be empty." };
    }

    if (trimmed.length > 1500) {
      return { valid: false, error: "Individual message length exceeds 1500 characters." };
    }

    totalChars += trimmed.length;
    sanitized.push({ role, content: trimmed });
  }

  if (totalChars > 10000) {
    return { valid: false, error: "Total conversation payload exceeds length limit." };
  }

  return { valid: true, messages: sanitized };
}
