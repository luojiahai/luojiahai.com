import { json } from "@sveltejs/kit";
import {
  socialFallback,
  type GitHubStats,
  type InstagramStats,
  type SocialStats,
  type TelegramStats,
  type XStats,
} from "$lib/social";
import type { RequestHandler } from "./$types";

// Live profile stats for the social hover cards. Served by the worker so
// numbers stay fresh without rebuilding the prerendered site. Layered
// caching keeps upstream traffic near zero: Cloudflare edge cache (per
// colo) -> KV last-good snapshot (global) -> bundled fallback snapshot.
export const prerender = false;

const GITHUB_HANDLE = "luojiahai";
const X_HANDLE = "luojiahai";
const TELEGRAM_HANDLE = "luojiahai";
const INSTAGRAM_HANDLE = "luojiahai";
const KV_KEY = "social-stats:v1";
/** Days of contribution history to expose (18 weeks). */
const HEATMAP_DAYS = 126;

const USER_AGENT = "luojiahai.com-social-card (+https://luojiahai.com)";

type GitHubProfile = Pick<
  GitHubStats,
  "handle" | "name" | "followers" | "following" | "publicRepos"
>;
type GitHubContributions = Pick<
  GitHubStats,
  "totalContributions" | "levels" | "endDate"
>;

function assertNumber(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`unexpected ${label}: ${value}`);
  }
  return value;
}

async function fetchGitHubProfile(): Promise<GitHubProfile> {
  const res = await fetch(`https://api.github.com/users/${GITHUB_HANDLE}`, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/vnd.github+json",
    },
  });
  if (!res.ok) throw new Error(`github profile ${res.status}`);
  const data = (await res.json()) as Record<string, unknown>;
  return {
    handle: GITHUB_HANDLE,
    name: typeof data.name === "string" ? data.name : GITHUB_HANDLE,
    followers: assertNumber(data.followers, "github followers"),
    following: assertNumber(data.following, "github following"),
    publicRepos: assertNumber(data.public_repos, "github public_repos"),
  };
}

function toContributions(
  days: { date: string; level: number }[],
  total: number,
): GitHubContributions {
  const recent = days
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-HEATMAP_DAYS);
  if (recent.length === 0) throw new Error("no contribution days");
  return {
    totalContributions: total,
    levels: recent.map((day) => String(Math.min(4, Math.max(0, day.level)))).join(""),
    endDate: recent[recent.length - 1].date,
  };
}

/** Parse GitHub's own contribution-calendar HTML fragment. */
async function fetchContributionsFromGitHub(): Promise<GitHubContributions> {
  const res = await fetch(
    `https://github.com/users/${GITHUB_HANDLE}/contributions`,
    { headers: { "User-Agent": USER_AGENT, Accept: "text/html" } },
  );
  if (!res.ok) throw new Error(`github contributions ${res.status}`);
  const html = await res.text();

  const days: { date: string; level: number }[] = [];
  const cell =
    /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"|data-level="(\d)"[^>]*data-date="(\d{4}-\d{2}-\d{2})"/g;
  for (const match of html.matchAll(cell)) {
    const date = match[1] ?? match[4];
    const level = Number(match[2] ?? match[3]);
    if (date) days.push({ date, level });
  }

  const totalMatch = /([\d,]+)\s+contributions?/.exec(html);
  const total = totalMatch
    ? Number(totalMatch[1].replaceAll(",", ""))
    : socialFallback.github.totalContributions;

  return toContributions(days, total);
}

/** Public mirror of the contribution calendar, used when GitHub's HTML
 * endpoint is unreachable or its markup changes. */
async function fetchContributionsFromMirror(): Promise<GitHubContributions> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${GITHUB_HANDLE}?y=last`,
    { headers: { "User-Agent": USER_AGENT, Accept: "application/json" } },
  );
  if (!res.ok) throw new Error(`contributions mirror ${res.status}`);
  const data = (await res.json()) as {
    total?: { lastYear?: number };
    contributions?: { date: string; level: number }[];
  };
  if (!Array.isArray(data.contributions)) {
    throw new Error("contributions mirror shape");
  }
  return toContributions(
    data.contributions,
    assertNumber(data.total?.lastYear, "contributions total"),
  );
}

async function fetchGitHubContributions(): Promise<GitHubContributions> {
  try {
    return await fetchContributionsFromGitHub();
  } catch {
    return await fetchContributionsFromMirror();
  }
}

async function fetchXProfile(): Promise<XStats> {
  const res = await fetch(`https://api.fxtwitter.com/${X_HANDLE}`, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`x profile ${res.status}`);
  const data = (await res.json()) as {
    user?: Record<string, unknown>;
  };
  const user = data.user;
  if (!user) throw new Error("x profile shape");
  const joined =
    typeof user.joined === "string" && !Number.isNaN(Date.parse(user.joined))
      ? String(new Date(user.joined).getUTCFullYear())
      : socialFallback.x.joined;
  return {
    handle: typeof user.screen_name === "string" ? user.screen_name : X_HANDLE,
    name: typeof user.name === "string" ? user.name : socialFallback.x.name,
    bio: typeof user.description === "string" ? user.description : "",
    location: typeof user.location === "string" ? user.location : "",
    followers: assertNumber(user.followers, "x followers"),
    following: assertNumber(user.following, "x following"),
    posts: assertNumber(user.tweets, "x tweets"),
    joined,
  };
}

function decodeEntities(value: string): string {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

/** Telegram has no public profile API; the t.me page exposes the profile
 * name and bio via OpenGraph tags. */
async function fetchTelegramProfile(): Promise<TelegramStats> {
  const res = await fetch(`https://t.me/${TELEGRAM_HANDLE}`, {
    headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
  });
  if (!res.ok) throw new Error(`telegram profile ${res.status}`);
  const html = await res.text();
  const name = /<meta property="og:title" content="([^"]*)"/.exec(html)?.[1];
  const bio = /<meta property="og:description" content="([^"]*)"/.exec(
    html,
  )?.[1];
  if (!name) throw new Error("telegram profile shape");
  return {
    handle: TELEGRAM_HANDLE,
    name: decodeEntities(name),
    bio: bio ? decodeEntities(bio) : "",
  };
}

/** Instagram's anonymous web-profile API. It rejects non-browser user
 * agents and blocks some datacenter IPs, so failures are expected and
 * fall back to the last-good snapshot. */
async function fetchInstagramProfile(): Promise<InstagramStats> {
  const res = await fetch(
    `https://i.instagram.com/api/v1/users/web_profile_info/?username=${INSTAGRAM_HANDLE}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
        Accept: "application/json",
        "x-ig-app-id": "936619743392459",
      },
    },
  );
  if (!res.ok) throw new Error(`instagram profile ${res.status}`);
  const data = (await res.json()) as {
    data?: { user?: Record<string, unknown> };
  };
  const user = data.data?.user;
  if (!user) throw new Error("instagram profile shape");
  const counts = user as {
    edge_followed_by?: { count?: unknown };
    edge_follow?: { count?: unknown };
    edge_owner_to_timeline_media?: { count?: unknown };
  };
  return {
    handle:
      typeof user.username === "string" ? user.username : INSTAGRAM_HANDLE,
    name:
      typeof user.full_name === "string" && user.full_name
        ? user.full_name
        : socialFallback.instagram.name,
    bio: typeof user.biography === "string" ? user.biography : "",
    followers: assertNumber(
      counts.edge_followed_by?.count,
      "instagram followers",
    ),
    following: assertNumber(counts.edge_follow?.count, "instagram following"),
    posts: assertNumber(
      counts.edge_owner_to_timeline_media?.count,
      "instagram posts",
    ),
  };
}

export const GET: RequestHandler = async ({ request, platform }) => {
  const cache = platform?.caches?.default;
  const cached = await cache?.match(request.url);
  if (cached) return cached;

  const kv = platform?.env?.SOCIAL_CACHE;
  const lastGood = (await kv
    ?.get(KV_KEY, "json")
    .catch(() => null)) as SocialStats | null;
  const base = lastGood ?? socialFallback;

  const [profile, contributions, x, telegram, instagram] =
    await Promise.allSettled([
      fetchGitHubProfile(),
      fetchGitHubContributions(),
      fetchXProfile(),
      fetchTelegramProfile(),
      fetchInstagramProfile(),
    ]);
  const anyFresh = [profile, contributions, x, telegram, instagram].some(
    (result) => result.status === "fulfilled",
  );

  const stats: SocialStats = {
    fetchedAt: anyFresh ? new Date().toISOString() : base.fetchedAt,
    github: {
      ...base.github,
      ...(profile.status === "fulfilled" ? profile.value : {}),
      ...(contributions.status === "fulfilled" ? contributions.value : {}),
    },
    x: x.status === "fulfilled" ? x.value : base.x,
    // `base` may predate newer fields (old KV snapshots).
    telegram:
      telegram.status === "fulfilled"
        ? telegram.value
        : (base.telegram ?? socialFallback.telegram),
    // LinkedIn sits behind an authwall with no anonymous endpoint, so its
    // numbers always come from the committed snapshot (edit
    // social-fallback.json to update them).
    linkedin: socialFallback.linkedin,
    instagram:
      instagram.status === "fulfilled"
        ? instagram.value
        : base.instagram?.posts != null
          ? base.instagram
          : socialFallback.instagram,
  };

  if (anyFresh && kv) {
    platform?.context?.waitUntil(kv.put(KV_KEY, JSON.stringify(stats)));
  }

  // Short client cache; the edge holds it longer. Upstream failures get a
  // brief TTL so the next request retries soon.
  const response = json(stats, {
    headers: {
      "Cache-Control": anyFresh
        ? "public, max-age=3600, s-maxage=14400"
        : "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  });

  if (anyFresh && cache) {
    platform?.context?.waitUntil(cache.put(request.url, response.clone()));
  }

  return response;
};
