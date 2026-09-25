import { SURPRISE_TIERS_DATA, TierInfo } from "@/data/surpriseTiersData";

export type { TierInfo };
export type FollowerTierId = "all" | "zero" | "low" | "medium" | "high" | "mega";

export const SURPRISE_TIERS = SURPRISE_TIERS_DATA;

const SURPRISE_HISTORY_KEY = "gitpulse_surprise_history_v2";
const MAX_HISTORY_ITEMS = 80;

export interface SurpriseResult {
  username: string;
  tier: "zero" | "low" | "medium" | "high" | "mega";
  badge: string;
}

/**
 * Gets a non-repeating random GitHub developer across follower tiers:
 * Could be 0 followers, 10 followers, 100 followers, 1k followers, or 10k+ followers!
 */
export function getRandomSurpriseUser(
  selectedTier: FollowerTierId = "all",
  currentUsername: string = ""
): SurpriseResult {
  const current = currentUsername.trim().toLowerCase();
  let history: string[] = [];

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(SURPRISE_HISTORY_KEY);
      if (raw) {
        history = JSON.parse(raw);
        if (!Array.isArray(history)) history = [];
      }
    } catch {
      history = [];
    }
  }

  const tierKeys: ("zero" | "low" | "medium" | "high" | "mega")[] = [
    "zero",
    "low",
    "medium",
    "high",
    "mega",
  ];

  // Pick target tier: if 'all', pick uniformly across all tiers for balanced distribution
  let targetTierKey: "zero" | "low" | "medium" | "high" | "mega";
  if (selectedTier === "all") {
    targetTierKey = tierKeys[Math.floor(Math.random() * tierKeys.length)];
  } else {
    targetTierKey = selectedTier;
  }

  const targetTier = SURPRISE_TIERS[targetTierKey];

  // 1. Filter out currently displayed user and recently viewed history
  let candidates = targetTier.users.filter(
    (u) => u.toLowerCase() !== current && !history.includes(u.toLowerCase())
  );

  // 2. If history exhausted this tier, reset history check for this tier
  if (candidates.length === 0) {
    candidates = targetTier.users.filter((u) => u.toLowerCase() !== current);
  }

  // 3. Fallback to all tiers if still empty
  if (candidates.length === 0) {
    const allUsers = tierKeys.flatMap((key) => SURPRISE_TIERS[key].users);
    candidates = allUsers.filter((u) => u.toLowerCase() !== current);
  }

  // Pick random user from candidate pool
  const chosen = candidates[Math.floor(Math.random() * candidates.length)] || "RokithS";

  // Record into history
  if (typeof window !== "undefined") {
    try {
      const updatedHistory = [chosen.toLowerCase(), ...history.filter((u) => u !== chosen.toLowerCase())].slice(
        0,
        MAX_HISTORY_ITEMS
      );
      localStorage.setItem(SURPRISE_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch {
      // ignore
    }
  }

  return {
    username: chosen,
    tier: targetTierKey,
    badge: targetTier.badge,
  };
}
