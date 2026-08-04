import { error } from "@sveltejs/kit";
import { postsOf } from "$lib/content";
import { generateRssFeed } from "$lib/feed";
import { getDictionary, type Language } from "$lib/dictionaries";
import type { RequestHandler } from "./$types";

// Feeds keep their extensionless URLs (/feed, /feed/zh), so they are served
// by the worker instead of being prerendered — a static file without an
// extension would lose its XML content type. Responses are cached at the
// edge with the Cloudflare Cache API (see below).
export const prerender = false;

const FEED_DESCRIPTIONS: Record<Language, string> = {
  en: "All posts from luojiahai.",
  zh: "罗嘉海的全部文章。",
};

function parsePath(path: string): { lang: Language } | undefined {
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return { lang: "en" };
  if (segments.length === 1 && segments[0] === "zh") return { lang: "zh" };
  return undefined;
}

export const GET: RequestHandler = async ({ params, request, platform, url }) => {
  const parsed = parsePath(params.path);
  if (!parsed) error(404, "Unknown feed");

  // Serve from the Cloudflare edge cache when possible.
  const cache = platform?.caches?.default;
  const cached = await cache?.match(request.url);
  if (cached) return cached;

  const { lang } = parsed;
  const dictionary = getDictionary(lang);

  const xml = generateRssFeed({
    title: dictionary.meta.websiteName,
    description: FEED_DESCRIPTIONS[lang],
    link: url.pathname,
    language: lang,
    items: postsOf(lang).map((post) => ({
      title: post.title,
      description: post.description,
      link: post.permalink,
      date: post.date,
      categories: post.categories,
      author: "hi@luojiahai.com (Luo, Jiahai)",
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
