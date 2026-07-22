import { error } from "@sveltejs/kit";
import { postsOf, type Section } from "$lib/content";
import { generateRssFeed } from "$lib/feed";
import { getDictionary, type Language } from "$lib/dictionaries";
import type { RequestHandler } from "./$types";

// Feeds keep their extensionless URLs (/feed, /feed/zh/tech, ...), so they
// are served by the worker instead of being prerendered — a static file
// without an extension would lose its XML content type. Responses are cached
// at the edge with the Cloudflare Cache API (see below).
export const prerender = false;

const FEED_DESCRIPTIONS: Record<Language, Record<string, string>> = {
  en: {
    all: "All posts from luojiahai: tech articles and life essays.",
    tech: "Tech articles and development insights from luojiahai.",
    life: "Life essays and personal writing from luojiahai.",
  },
  zh: {
    all: "罗嘉海的全部文章：技术与生活。",
    tech: "罗嘉海的技术文章。",
    life: "罗嘉海的生活随笔。",
  },
};

function parsePath(
  path: string,
): { lang: Language; section?: Section } | undefined {
  const segments = path.split("/").filter(Boolean);
  const lang: Language = segments[0] === "zh" ? "zh" : "en";
  if (segments[0] === "zh") segments.shift();

  if (segments.length === 0) return { lang };
  if (segments.length > 1) return undefined;
  if (segments[0] === "tech") return { lang, section: "posts" };
  if (segments[0] === "life") return { lang, section: "life" };
  return undefined;
}

export const GET: RequestHandler = async ({ params, request, platform, url }) => {
  const parsed = parsePath(params.path);
  if (!parsed) error(404, "Unknown feed");

  // Serve from the Cloudflare edge cache when possible.
  const cache = platform?.caches?.default;
  const cached = await cache?.match(request.url);
  if (cached) return cached;

  const { lang, section } = parsed;
  const dictionary = getDictionary(lang);
  const kind = section === "posts" ? "tech" : section === "life" ? "life" : "all";
  const suffix =
    kind === "all" ? "" : ` - ${dictionary.labels[section as Section]}`;

  const xml = generateRssFeed({
    title: `${dictionary.meta.websiteName}${suffix}`,
    description: FEED_DESCRIPTIONS[lang][kind],
    link: url.pathname,
    language: lang,
    items: postsOf(lang, section).map((post) => ({
      title: post.title,
      description: post.description,
      link: post.permalink,
      date: post.date,
      categories: post.categories,
      author: "ljiahai@hotmail.com (Luo, Jiahai)",
    })),
  });

  const response = new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });

  if (cache) {
    platform?.context?.waitUntil(cache.put(request.url, response.clone()));
  }

  return response;
};
