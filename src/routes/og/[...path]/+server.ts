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
import { generateOgImage, type OgImageOptions } from "$lib/og/image";
import type { EntryGenerator, RequestHandler } from "./$types";

export const prerender = true;

/** Static pages under each language, with their page-layout OG options. */
const PAGE_EMOJIS: Record<string, string> = {
  posts: "📝",
  projects: "🛠",
  use: "🧰",
  about: "👋",
};

export const entries: EntryGenerator = () => [
  ...languages.map((lang) => ({ path: `${lang}.png` })),
  ...languages.flatMap((lang) =>
    Object.keys(PAGE_EMOJIS).map((page) => ({ path: `${lang}/${page}.png` })),
  ),
  ...posts.map((post) => ({ path: `${post.lang}/posts/${post.slug}.png` })),
  ...categories.flatMap((category) =>
    languages.map((lang) => ({
      path: `${lang}/posts/categories/${category.slug}.png`,
    })),
  ),
];

function resolveOptions(path: string): OgImageOptions | undefined {
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
      type: "page",
      showTitleAvatar: true,
      ...branding,
    };
  }

  // Static pages. About's title and subtitle live in its markdown source
  // (content/pages/about), not in the dictionaries.
  if (page in PAGE_EMOJIS) {
    const about = findPage(lang, "about");
    const titles: Record<string, string | undefined> = {
      posts: dictionary.labels.posts,
      projects: dictionary.labels.projects,
      use: dictionary.labels.use,
      about: about?.title,
    };
    const descriptions: Record<string, string | undefined> = {
      posts: dictionary.labels.postsSubtitle,
      projects: dictionary.labels.projectsSubtitle,
      use: dictionary.labels.useSubtitle,
      about: about?.description,
    };
    const title = titles[page];
    // No title means the page's markdown source is missing, and an OG image
    // with a blank headline is worse than none.
    if (title === undefined) return undefined;
    return {
      title,
      subtitle: descriptions[page],
      emoji: PAGE_EMOJIS[page],
      type: "page",
      ...branding,
    };
  }

  const [prefix, ...rest] = segments;
  if (prefix !== "posts") return undefined;

  // Category pages
  if (rest.length === 2 && rest[0] === "categories") {
    const category = findCategory(rest[1]);
    if (!category) return undefined;
    return { title: category.name[lang], type: "post", ...branding };
  }

  // Post pages
  if (rest.length === 1) {
    const post = findPost(lang, rest[0]);
    if (!post) return undefined;
    return {
      title: post.title,
      description: post.description,
      category: post.categories[0],
      date: displayDate(post.date, "en-US"),
      type: "post",
      ...branding,
    };
  }

  return undefined;
}

export const GET: RequestHandler = async ({ params }) => {
  const options = resolveOptions(params.path);
  if (!options) error(404, "No OG image for this path");

  const png = await generateOgImage(options);

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
