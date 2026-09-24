import { categories, posts } from "$lib/content";
import { getDictionary, languages } from "$lib/dictionaries";
import { SITE_URL } from "$lib/site-config";
import { aircraft } from "../../params/aircraft";
import type { RequestHandler } from "./$types";

export const prerender = true;

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  priority: number;
}

// Only posts carry a lastmod. The other pages have no modification date of
// their own, and stamping them with the build time on every deploy teaches
// crawlers to ignore lastmod altogether, the posts' included.
export const GET: RequestHandler = () => {
  const basicUrls: SitemapUrl[] = languages.flatMap((lang) => {
    const dictionary = getDictionary(lang);
    return [
      { loc: dictionary.urls.home, priority: 1 },
      { loc: dictionary.urls.posts, priority: 1 },
      { loc: dictionary.urls.projects, priority: 1 },
      { loc: dictionary.urls.use, priority: 0.8 },
      { loc: dictionary.urls.about, priority: 0.8 },
    ];
  });

  // The sim companions sit outside the /{lang}/ namespace, so they are listed
  // once rather than per language.
  const companionUrls: SitemapUrl[] = aircraft.map((entry) => ({
    loc: `/fly/${entry.slug}`,
    priority: 0.6,
  }));

  const categoryUrls: SitemapUrl[] = categories.flatMap((category) =>
    languages.map((lang) => ({
      loc: category.permalink[lang],
      priority: 0.7,
    })),
  );

  const postUrls: SitemapUrl[] = posts.map((post) => ({
    loc: post.permalink,
    lastmod: post.updated || post.date,
    priority: 1,
  }));

  const urls = [...basicUrls, ...companionUrls, ...categoryUrls, ...postUrls]
    .map(
      (item) => `  <url>
    <loc>${SITE_URL}${item.loc}</loc>${item.lastmod ? `\n    <lastmod>${item.lastmod}</lastmod>` : ""}
    <priority>${item.priority}</priority>
  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
