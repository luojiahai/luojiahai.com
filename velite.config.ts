import type { Element, Parent, Root } from "hast";
import rehypePrettyCode from "rehype-pretty-code";
import { defineCollection, defineConfig, s } from "velite";

/**
 * One blog, one content pipeline:
 *   content/posts/** -> served under /{lang}/posts
 * Categories live in content/categories/posts.yml.
 */

/**
 * Wrap every table in a horizontally scrollable div. The printed paper column is
 * ~294px wide on a phone and .printer-paper-area clips its overflow, so a wide
 * table loses its right-hand columns with no way to reach them. Styled as
 * .table-scroll in src/app.css.
 */
function rehypeTableScroll() {
  return (tree: Root) => {
    const wrap = (node: Parent) => {
      node.children = node.children.map((child) => {
        // Descend first, so the wrapper we return is never revisited.
        if ("children" in child) wrap(child);
        if (child.type !== "element" || child.tagName !== "table") return child;
        return {
          type: "element",
          tagName: "div",
          properties: { className: ["table-scroll"], tabIndex: 0 },
          children: [child],
        } satisfies Element;
      });
    };
    wrap(tree);
  };
}

const lang = s.enum(["en", "zh"]);

/**
 * A field that varies by language, written inline so everything around it -
 * links, image paths, product names - stays written once.
 */
const localized = (max: number) =>
  s.object({
    en: s.string().max(max),
    zh: s.string().max(max),
  });

/**
 * The keys that appear more than once. Duplicate slugs are not cosmetic: the
 * pages key their `{#each}` blocks by slug, and Svelte throws on a repeated key.
 */
function duplicates(keys: string[]): string[] {
  const seen = new Set<string>();
  return [
    ...new Set(keys.filter((key) => (seen.has(key) ? true : (seen.add(key), false)))),
  ];
}

function reportDuplicates(what: string, keys: string[]): boolean {
  const found = duplicates(keys);
  if (found.length === 0) return true;
  console.error(`Duplicate ${what} found:`, found.join(", "));
  return false;
}

const count = s
  .object({
    en: s.number(),
    zh: s.number(),
  })
  .default({ en: 0, zh: 0 });

const categories = defineCollection({
  name: "Category",
  pattern: "categories/*.yml",
  schema: s
    .object({
      slug: s.string(),
      name: localized(20),
      description: localized(100).optional(),
      count,
    })
    .transform((data) => {
      return {
        ...data,
        permalink: {
          en: `/en/posts/categories/${data.slug}`,
          zh: `/zh/posts/categories/${data.slug}`,
        },
      };
    }),
});

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.md",
  schema: s
    .object({
      title: s.string().max(99),
      slug: s.string(),
      lang,
      date: s.isodate(),
      updated: s.isodate().optional(),
      cover: s.image().optional(),
      video: s.file().optional(),
      description: s.string().max(999).optional(),
      keywords: s.array(s.string()).optional(),
      draft: s.boolean().default(false),
      featured: s.boolean().default(false),
      categories: s.array(s.string()),
      wechatLink: s.string().optional(),
      excerpt: s.excerpt(),
      content: s.markdown(),
    })
    .transform((data) => {
      return {
        ...data,
        permalink: `/${data.lang}/posts/${data.slug}`,
      };
    }),
});

/**
 * Standalone pages: prose that belongs to a hand-written route rather than to
 * the blog. The route owns the URL, so there is no permalink here - `slug` is
 * only the lookup key the route asks for.
 */
const pages = defineCollection({
  name: "Page",
  pattern: "pages/**/*.md",
  schema: s.object({
    slug: s.string(),
    lang,
    title: s.string().max(99),
    description: s.string().max(999).optional(),
    content: s.markdown(),
  }),
});

/**
 * The things I build, listed on /{lang}/projects and the home page. Names,
 * links and image paths are the same in every language, so only the blurb is
 * localized. Array order is display order.
 */
const projects = defineCollection({
  name: "Project",
  pattern: "projects/*.yml",
  schema: s.object({
    slug: s.string(),
    name: s.string(),
    description: localized(100),
    image: s.string().optional(),
    link: s.string(),
  }),
});

/**
 * The gear list on /{lang}/use, one record per group. A group has no identity
 * beyond its label and its position, so this is not a taxonomy - the items
 * live inside it rather than pointing at it.
 */
const use = defineCollection({
  name: "UseGroup",
  pattern: "use/*.yml",
  schema: s.object({
    slug: s.string(),
    label: localized(20),
    items: s.array(
      s.object({
        label: localized(30),
        value: s.string().max(60),
      }),
    ),
  }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "static/blog",
    base: "/blog/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { categories, pages, posts, projects, use },
  markdown: { rehypePlugins: [rehypePrettyCode, rehypeTableScroll] },
  prepare: ({ categories, pages, posts, projects, use }) => {
    const unknownCategories = posts
      .flatMap((post) => post.categories)
      .filter((slug) => !categories.some((c) => c.slug === slug));

    if (unknownCategories.length > 0) {
      console.error("Unknown categories found:", unknownCategories.join(", "));
      return false;
    }

    // Translations are linked by slug alone, so a slug reused by two posts
    // in the same language would silently shadow one of them.
    const postsOk = reportDuplicates(
      "post slugs",
      posts.map((post) => `${post.lang}/${post.slug}`),
    );
    if (!postsOk) return false;

    const projectsOk = reportDuplicates(
      "project slugs",
      projects.map((project) => project.slug),
    );
    if (!projectsOk) return false;

    const useOk = reportDuplicates(
      "use group slugs",
      use.map((group) => group.slug),
    );
    if (!useOk) return false;

    // Items have no slug - the page keys them by `value`, so a group listing
    // the same product twice is the same crash a duplicate slug would be.
    const itemsOk = use.every((group) =>
      reportDuplicates(
        `use items in ${group.slug}`,
        group.items.map((item) => item.value),
      ),
    );
    if (!itemsOk) return false;

    // Unlike posts, a page renders at a fixed URL in every language, so a
    // missing translation is a broken route rather than one fewer list entry.
    const pageKeys = new Set(pages.map((page) => `${page.lang}/${page.slug}`));
    const missingPages = [...new Set(pages.map((page) => page.slug))].flatMap(
      (slug) =>
        lang.options
          .filter((language) => !pageKeys.has(`${language}/${slug}`))
          .map((language) => `pages/${slug}/${language}.md`),
    );

    if (missingPages.length > 0) {
      console.error("Missing page translations:", missingPages.join(", "));
      return false;
    }

    const pagesOk = reportDuplicates(
      "page slugs",
      pages.map((page) => `${page.lang}/${page.slug}`),
    );
    if (!pagesOk) return false;

    for (const category of categories) {
      category.count = {
        en: 0,
        zh: 0,
      };
      for (const post of posts) {
        if (post.categories.includes(category.slug)) {
          category.count[post.lang] += 1;
        }
      }
    }
  },
});
