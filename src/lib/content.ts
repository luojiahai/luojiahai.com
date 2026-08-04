import {
  categories as allCategories,
  fly as allFly,
  pages as allPages,
  posts as allPosts,
  projects as allProjects,
  use as allUseGroups,
} from "#velite";
import type { Language } from "$lib/dictionaries";
import type { AircraftSlug } from "../params/aircraft";

type Localized = Record<Language, string>;

export interface Post {
  title: string;
  slug: string;
  lang: Language;
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

/** A standalone page's prose, rendered by a hand-written route. */
export interface Page {
  slug: string;
  lang: Language;
  title: string;
  description?: string;
  content: string;
}

export interface Category {
  slug: string;
  name: Localized;
  description?: Localized;
  count: Record<Language, number>;
  permalink: Localized;
}

/** A thing I build. Only the blurb varies by language. */
export interface Project {
  slug: string;
  name: string;
  description: Localized;
  image?: string;
  link: string;
}

/** A project with its blurb resolved, which is all a list row needs. */
export type ProjectItem = Omit<Project, "description"> & {
  description: string;
};

/** One labelled row of the gear list. `value` is a product name, never translated. */
export interface UseItem {
  label: Localized;
  value: string;
}

export interface UseGroup {
  slug: string;
  label: Localized;
  items: UseItem[];
}

export type UseGroupItem = {
  slug: string;
  label: string;
  items: { label: string; value: string }[];
};

/**
 * A flight companion. The name and URL come from the aircraft registry, which
 * `slug` is validated against in Velite's prepare step.
 */
export interface FlyEntry {
  slug: AircraftSlug;
  description: Localized;
}

export type FlyItem = Omit<FlyEntry, "description"> & { description: string };

/** All published posts, newest first. Drafts are only visible in dev. */
export const posts: Post[] = (allPosts as unknown as Post[])
  .filter((post) => import.meta.env.DEV || !post.draft)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const pages: Page[] = allPages as unknown as Page[];

export const categories: Category[] = allCategories as unknown as Category[];

export const projects: Project[] = allProjects as unknown as Project[];

export const useGroups: UseGroup[] = allUseGroups as unknown as UseGroup[];

export const fly: FlyEntry[] = allFly as unknown as FlyEntry[];

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

/** The one category projection every page shares. */
export function toCategoryItem(category: Category): Category {
  return {
    slug: category.slug,
    name: category.name,
    description: category.description,
    count: category.count,
    permalink: category.permalink,
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
 * Every project, in authored order, with the blurb resolved for `lang`. The
 * `{ en, zh }` shape stops here so routes and components never see it.
 */
export function projectsOf(lang: Language): ProjectItem[] {
  return projects.map((project) => ({
    ...project,
    description: project.description[lang],
  }));
}

/** The gear list, in authored order, with every label resolved for `lang`. */
export function useGroupsOf(lang: Language): UseGroupItem[] {
  return useGroups.map((group) => ({
    slug: group.slug,
    label: group.label[lang],
    items: group.items.map((item) => ({
      label: item.label[lang],
      value: item.value,
    })),
  }));
}

/** The flight companions, in authored order, with the blurb resolved. */
export function flyOf(lang: Language): FlyItem[] {
  return fly.map((entry) => ({
    ...entry,
    description: entry.description[lang],
  }));
}

export function findPage(lang: Language, slug: string): Page | undefined {
  return pages.find((page) => page.lang === lang && page.slug === slug);
}

export function findCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
