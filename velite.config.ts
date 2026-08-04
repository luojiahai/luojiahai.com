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

const localized = s.object({
  en: s.string().max(20),
  zh: s.string().max(20),
});

const localizedDescription = s
  .object({
    en: s.string().max(100),
    zh: s.string().max(100),
  })
  .optional();

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
      name: localized,
      description: localizedDescription,
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

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "static/blog",
    base: "/blog/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { categories, pages, posts },
  markdown: { rehypePlugins: [rehypePrettyCode, rehypeTableScroll] },
  prepare: ({ categories, pages, posts }) => {
    const unknownCategories = posts
      .flatMap((post) => post.categories)
      .filter((slug) => !categories.some((c) => c.slug === slug));

    if (unknownCategories.length > 0) {
      console.error("Unknown categories found:", unknownCategories.join(", "));
      return false;
    }

    // Translations are linked by slug alone, so a slug reused by two posts
    // in the same language would silently shadow one of them.
    const seen = new Set<string>();
    const duplicates = posts
      .map((post) => `${post.lang}/${post.slug}`)
      .filter((key) => (seen.has(key) ? true : (seen.add(key), false)));

    if (duplicates.length > 0) {
      console.error("Duplicate post slugs found:", duplicates.join(", "));
      return false;
    }

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

    if (pageKeys.size !== pages.length) {
      console.error(
        "Duplicate page slugs found:",
        pages.map((page) => `${page.lang}/${page.slug}`).join(", "),
      );
      return false;
    }

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
