import {
  categories as allCategories,
  pages,
  posts as allPosts,
  projects,
  use as useGroups,
  type Post,
} from "#velite";
import { languages, type Language } from "$lib/dictionaries";

export type { Post } from "#velite";

/**
 * All published posts, newest first. Drafts are only visible in dev; archived
 * posts stay in the repo but never render.
 */
export const posts: Post[] = allPosts
  .filter((post) => !post.archived)
  .filter((post) => import.meta.env.DEV || !post.draft)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

/**
 * Every category, with its post count per language. The count is derived from
 * `posts` so it agrees with the lists it summarizes.
 */
export const categories = allCategories.map((category) => ({
  ...category,
  count: Object.fromEntries(
    languages.map((lang) => [
      lang,
      posts.filter(
        (post) => post.lang === lang && post.categories.includes(category.slug),
      ).length,
    ]),
  ) as Record<Language, number>,
}));

export type Category = (typeof categories)[number];

/** The lightweight shape sent to list pages (no rendered content). */
export type PostListItem = Pick<
  Post,
  | "title"
  | "slug"
  | "lang"
  | "date"
  | "description"
  | "categories"
  | "permalink"
>;

export function toListItem(post: Post): PostListItem {
  return {
    title: post.title,
    slug: post.slug,
    lang: post.lang,
    date: post.date,
    description: post.description,
    categories: post.categories,
    permalink: post.permalink,
  };
}

export function postsOf(lang: Language, category?: string): Post[] {
  return posts.filter(
    (post) =>
      post.lang === lang &&
      (!category || post.categories.includes(category)),
  );
}

export function findPost(lang: Language, slug: string): Post | undefined {
  return posts.find((post) => post.lang === lang && post.slug === slug);
}

/** The same post in other languages, for hreflang alternates. */
export function postTranslations(post: Post): Post[] {
  return posts.filter((other) => other.slug === post.slug);
}

/**
 * Every project, in authored order, with the name and blurb resolved for
 * `lang`. The `{ en, zh }` shape stops here so routes and components never see
 * it.
 */
export function projectsOf(lang: Language) {
  return projects.map((project) => ({
    ...project,
    name: typeof project.name === "string" ? project.name : project.name[lang],
    description: project.description[lang],
  }));
}

export type ProjectItem = ReturnType<typeof projectsOf>[number];

/** The gear list, in authored order, with every label resolved for `lang`. */
export function useGroupsOf(lang: Language) {
  return useGroups.map((group) => ({
    slug: group.slug,
    label: group.label[lang],
    items: group.items.map((item) => ({
      label: item.label[lang],
      value: item.value,
    })),
  }));
}

export function findPage(lang: Language, slug: string) {
  return pages.find((page) => page.lang === lang && page.slug === slug);
}

export function findCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
};

function plainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:amp|lt|gt|quot|#39|#x27);/g, (entity) => ENTITIES[entity]);
}

/**
 * The post's h2 headings, for the table of contents. The ids come from the
 * rehypeHeadingIds step in velite.config.ts.
 */
export function tableOfContents(html: string): { id: string; text: string }[] {
  return [...html.matchAll(/<h2 id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)].map(
    ([, id, inner]) => ({ id, text: plainText(inner).replace(/\s+/g, " ").trim() }),
  );
}

/**
 * Minutes to read rendered HTML: about 220 words a minute for spaced
 * scripts, 450 characters a minute for CJK, never less than one.
 */
export function readingMinutes(html: string): number {
  const text = plainText(html);
  const cjk = text.match(/[㐀-鿿豈-﫿]/g)?.length ?? 0;
  const words = text
    .replace(/[㐀-鿿豈-﫿]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220 + cjk / 450));
}
