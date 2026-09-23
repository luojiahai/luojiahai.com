import fallback from "./social-fallback.json";

/**
 * Live social profile stats shown in the hover cards. Served by
 * /api/social at runtime; `socialFallback` is a committed snapshot used
 * whenever the live data hasn't loaded (prerendered HTML, network
 * failures, upstream outages).
 */

export interface GitHubStats {
  handle: string;
  name: string;
  followers: number;
  following: number;
  publicRepos: number;
  /** Contributions over the last year. */
  totalContributions: number;
  /** One digit (0-4) per day, oldest first, ending at `endDate`. */
  levels: string;
  /** Date of the last digit in `levels` (YYYY-MM-DD). */
  endDate: string;
}

export interface XStats {
  handle: string;
  name: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  /** Year the account joined. */
  joined: string;
}

export interface TelegramStats {
  handle: string;
  name: string;
  bio: string;
}

export interface InstagramStats {
  handle: string;
  name: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
}

export interface SocialStats {
  fetchedAt: string;
  github: GitHubStats;
  x: XStats;
  telegram: TelegramStats;
  instagram: InstagramStats;
}

/** Card variants supported by SocialHoverCard. */
export type SocialCardKind = Exclude<keyof SocialStats, "fetchedAt"> | "email";

export const socialFallback: SocialStats = fallback;

/**
 * The version of the SocialStats shape. The client puts it in the request URL
 * and the server keys its edge cache by it, so after a shape change neither
 * the browser nor the edge serves a payload written for the old one.
 */
export const SOCIAL_STATS_VERSION = 4;

/**
 * Whether a payload read back from a cache or the network has the current
 * shape. Anything that doesn't is dropped in favor of the snapshot.
 */
export function isSocialStats(value: unknown): value is SocialStats {
  const stats = value as Partial<SocialStats> | null;
  return (
    typeof stats?.github?.levels === "string" &&
    stats.x != null &&
    stats.telegram != null &&
    typeof stats.instagram?.posts === "number"
  );
}
