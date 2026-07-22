import { categories as allCategories, posts as allPosts } from "#velite";
import type { Language } from "$lib/dictionaries";

export const sections = ["posts", "life"] as const;

export type Section = (typeof sections)[number];

type Localized = Record<Language, string>;

export interface Post {
  title: string;
  slug: string;
  lang: Language;
  section: Section;
  date: string;
  updated?: string;
  cover?: { src: string; width: number; height: number };
  video?: string;
  description?: string;
  keywords?: string[];
  draft: boolean;
  featured: boolean;
  categories: string[];
  wechatLink?: string;
  excerpt: string;
  content: string;
  permalink: string;
}

export interface Category {
  slug: string;
  section: Section;
  name: Localized;
  description?: Localized;
  count: Record<Language, number>;
  permalink: Localized;
}

export function isSection(value: string): value is Section {
  return (sections as readonly string[]).includes(value);
}

/** All published posts, newest first. Drafts are only visible in dev. */
export const posts: Post[] = (allPosts as unknown as Post[])
  .filter((post) => import.meta.env.DEV || !post.draft)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const categories: Category[] = allCategories as unknown as Category[];

/** The lightweight shape sent to list pages (no rendered content). */
export type PostListItem = Pick<
  Post,
  | "title"
  | "slug"
  | "lang"
  | "section"
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
    section: post.section,
    date: post.date,
    description: post.description,
    categories: post.categories,
    permalink: post.permalink,
  };
}

export function postsOf(
  lang: Language,
  section?: Section,
  category?: string,
): Post[] {
  return posts.filter(
    (post) =>
      post.lang === lang &&
      (!section || post.section === section) &&
      (!category || post.categories.includes(category)),
  );
}

export function findPost(
  lang: Language,
  section: Section,
  slug: string,
): Post | undefined {
  return posts.find(
    (post) =>
      post.lang === lang && post.section === section && post.slug === slug,
  );
}

/** The same post in other languages, for hreflang alternates. */
export function postTranslations(post: Post): Post[] {
  return posts.filter(
    (other) => other.section === post.section && other.slug === post.slug,
  );
}

export function categoriesOf(section: Section): Category[] {
  return categories.filter((category) => category.section === section);
}

export function findCategory(
  section: Section,
  slug: string,
): Category | undefined {
  return categories.find(
    (category) => category.section === section && category.slug === slug,
  );
}
