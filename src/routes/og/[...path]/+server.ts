import { error } from "@sveltejs/kit";
import {
  categories,
  findCategory,
  findPage,
  findPost,
  posts,
} from "$lib/content";
import { getDictionary, isLanguage, languages } from "$lib/dictionaries";
import { displayDate } from "$lib/date";
import { generateOgImage, type OgCard, type OgIcon } from "$lib/og/image";
import type { EntryGenerator, RequestHandler } from "./$types";

export const prerender = true;

/** Static pages under each language, marked with the icon each page prints. */
const PAGE_ICONS = {
  posts: "draft",
  projects: "code",
  use: "tools",
  about: "user",
} satisfies Record<string, OgIcon>;

type StaticPage = keyof typeof PAGE_ICONS;

const isStaticPage = (page: string): page is StaticPage => page in PAGE_ICONS;

export const entries: EntryGenerator = () => [
  ...languages.map((lang) => ({ path: `${lang}.png` })),
  ...languages.flatMap((lang) =>
    Object.keys(PAGE_ICONS).map((page) => ({ path: `${lang}/${page}.png` })),
  ),
  ...posts.map((post) => ({ path: `${post.lang}/posts/${post.slug}.png` })),
  ...categories.flatMap((category) =>
    languages.map((lang) => ({
      path: `${lang}/posts/categories/${category.slug}.png`,
    })),
  ),
];

function resolveCard(path: string): OgCard | undefined {
  if (!path.endsWith(".png")) return undefined;

  const segments = path.slice(0, -".png".length).split("/");
  const lang = segments.shift();
  if (!lang || !isLanguage(lang)) return undefined;

  const dictionary = getDictionary(lang);
  const branding = {
    brandName: dictionary.labels.brandName,
    brandTagline: dictionary.labels.brandTagline,
  };
  const page = segments.join("/");

  // Home
  if (page === "") {
    return {
      title: dictionary.meta.name,
      description: dictionary.meta.motto,
      ...branding,
    };
  }

  // Static pages. About's title and subtitle live in its markdown source
  // (content/pages/about), not in the dictionaries.
  if (isStaticPage(page)) {
    const { labels } = dictionary;
    const about = findPage(lang, "about");
    const text: Record<StaticPage, { title?: string; subtitle?: string }> = {
      posts: { title: labels.posts, subtitle: labels.postsSubtitle },
      projects: { title: labels.projects, subtitle: labels.projectsSubtitle },
      use: { title: labels.use, subtitle: labels.useSubtitle },
      about: { title: about?.title, subtitle: about?.description },
    };
    const { title, subtitle } = text[page];
    // No title means the page's markdown source is missing, and an OG image
    // with a blank headline is worse than none.
    if (title === undefined) return undefined;
    return {
      title,
      description: subtitle,
      marker: { kind: "icon", icon: PAGE_ICONS[page] },
      ...branding,
    };
  }

  const [prefix, ...rest] = segments;
  if (prefix !== "posts") return undefined;

  // Category pages
  if (rest.length === 2 && rest[0] === "categories") {
    const category = findCategory(rest[1]);
    if (!category) return undefined;
    return {
      title: category.name[lang],
      description: category.description?.[lang],
      marker: { kind: "icon", icon: "tag" },
      ...branding,
    };
  }

  // Post pages
  if (rest.length === 1) {
    const post = findPost(lang, rest[0]);
    if (!post) return undefined;
    return {
      title: post.title,
      description: post.description,
      marker: {
        kind: "post",
        category: findCategory(post.categories[0])?.name[lang],
        date: displayDate(post.date, lang),
      },
      ...branding,
    };
  }

  return undefined;
}

export const GET: RequestHandler = async ({ params }) => {
  const card = resolveCard(params.path);
  if (!card) error(404, "No OG image for this path");

  const png = await generateOgImage(card);

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
