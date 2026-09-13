/**
 * Personality & Proactive Comments Layer for Rajat's AI Assistant.
 * Controlled, subtle, witty observations with strict frequency limits.
 */

export interface ProactiveMessage {
  id: string;
  text: string;
  type: "general" | "scene" | "greeting" | "success";
  scene?: "day" | "sunset" | "night" | "sunrise";
}

export const PROACTIVE_MESSAGES: ProactiveMessage[] = [
  // Scene-aware comments
  {
    id: "scene_day",
    type: "scene",
    scene: "day",
    text: "Bright and early. Well... technically the website decides that.",
  },
  {
    id: "scene_sunset",
    type: "scene",
    scene: "sunset",
    text: "Okay, this scene is doing most of the presentation work for me.",
  },
  {
    id: "scene_night",
    type: "scene",
    scene: "night",
    text: "Now we're talking. This is my favorite corner of the portfolio.",
  },
  {
    id: "scene_sunrise",
    type: "scene",
    scene: "sunrise",
    text: "You caught the portfolio waking up.",
  },
  {
    id: "scene_hint",
    type: "general",
    text: "You know you can change the scene, right? 👀",
  },

  // Witty, useful observations
  {
    id: "witty_speed",
    type: "general",
    text: "You could click around... or just ask me. I'm faster.",
  },
  {
    id: "witty_knowledge",
    type: "general",
    text: "Yes, I actually know what Rajat built. Ask me.",
  },
  {
    id: "witty_trust",
    type: "general",
    text: "I can give you what you're looking for. Trust me.",
  },
  {
    id: "witty_secret",
    type: "general",
    text: "Psst... there's more to this portfolio than what you're seeing.",
  },
  {
    id: "witty_commitment",
    type: "general",
    text: "You're still here? I respect the commitment.",
  },
  {
    id: "scenery_camp",
    type: "general",
    text: "I wish I could camp here... 🏕️",
  },
];

export const PROACTIVE_COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes minimum interval

const SHOWN_STORAGE_KEY = "rajat_shown_proactive_ids_v1";
const LAST_SHOWN_STORAGE_KEY = "rajat_last_proactive_timestamp_v1";

/**
 * Retrieves the set of message IDs already shown in this session.
 */
export function getShownMessageIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = sessionStorage.getItem(SHOWN_STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch {
    // Ignore
  }
  return new Set();
}

/**
 * Records a message ID as shown in this session and updates the cooldown timestamp.
 */
export function recordMessageShown(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const shown = getShownMessageIds();
    shown.add(id);
    sessionStorage.setItem(SHOWN_STORAGE_KEY, JSON.stringify(Array.from(shown)));
    sessionStorage.setItem(LAST_SHOWN_STORAGE_KEY, String(Date.now()));
  } catch {
    // Ignore
  }
}

/**
 * Checks if cooldown has passed since the last proactive message.
 */
export function isCooldownActive(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = sessionStorage.getItem(LAST_SHOWN_STORAGE_KEY);
    if (!raw) return false;
    const lastTimestamp = parseInt(raw, 10);
    if (isNaN(lastTimestamp)) return false;
    return Date.now() - lastTimestamp < PROACTIVE_COOLDOWN_MS;
  } catch {
    return false;
  }
}

/**
 * Selects an appropriate proactive message based on current scene and trigger context.
 */
export function getNextProactiveMessage(
  trigger: "scene_change" | "idle_time" | "deep_visit",
  currentScene?: string
): ProactiveMessage | null {
  if (isCooldownActive()) return null;

  const shownIds = getShownMessageIds();

  if (trigger === "scene_change" && currentScene) {
    const sceneMsg = PROACTIVE_MESSAGES.find(
      (m) => m.type === "scene" && m.scene === currentScene && !shownIds.has(m.id)
    );
    if (sceneMsg) return sceneMsg;
  }

  // Filter available general messages
  const available = PROACTIVE_MESSAGES.filter((m) => !shownIds.has(m.id));

  if (available.length === 0) {
    // If all shown, don't spam
    return null;
  }

  // Pick one randomly
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}
