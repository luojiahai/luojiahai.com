const BASE_URL = "https://luojiahai.com";

interface FeedItem {
  title: string;
  description?: string;
  link: string;
  date: string;
  categories?: string[];
  author?: string;
}

interface FeedOptions {
  title: string;
  description: string;
  link: string;
  language?: string;
  items: FeedItem[];
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function generateRssFeed(options: FeedOptions): string {
  const { title, description, link, language = "en", items } = options;
  const feedUrl = `${BASE_URL}${link}`;
  const pubDate =
    items.length > 0
      ? new Date(items[0].date).toUTCString()
      : new Date().toUTCString();

  const itemsXml = items
    .map((item) => {
      const itemUrl = `${BASE_URL}${item.link}`;
      const categories = (item.categories ?? [])
        .map((cat) => `      <category>${escapeXml(cat)}</category>`)
        .join("\n");

      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${itemUrl}</link>
      <guid isPermaLink="true">${itemUrl}</guid>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>${item.description ? `\n      <description>${escapeXml(item.description)}</description>` : ""}${categories ? `\n${categories}` : ""}${item.author ? `\n      <author>${escapeXml(item.author)}</author>` : ""}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${BASE_URL}</link>
    <description>${escapeXml(description)}</description>
    <language>${language}</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;
}
