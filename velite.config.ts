import type { Element, Parent, Root } from "hast";
import rehypePrettyCode from "rehype-pretty-code";
import { defineCollection, defineConfig, s } from "velite";

/**
 * Both blogs share a single content pipeline:
 *   content/tech-posts/** -> section "tech", served under /{lang}/tech
 *   content/life-posts/** -> section "life", served under /{lang}/life
 * Categories live in content/categories/{tech,life}.yml.
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

function sectionOfPath(path: string): "tech" | "life" {
  if (path.startsWith("life-posts/") || path.startsWith("categories/life")) {
    return "life";
  }
  if (path.startsWith("tech-posts/") || path.startsWith("categories/tech")) {
    return "tech";
  }
  throw new Error(`Content outside a known section: ${path}`);
}

const categories = defineCollection({
  name: "Category",
  pattern: "categories/*.yml",
  schema: s
    .object({
      slug: s.string(),
      name: localized,
      description: localizedDescription,
      count,
      path: s.path(),
    })
    .transform(({ path, ...data }) => {
      const section = sectionOfPath(path);
      return {
        ...data,
        section,
        permalink: {
          en: `/en/${section}/categories/${data.slug}`,
          zh: `/zh/${section}/categories/${data.slug}`,
        },
      };
    }),
});

const posts = defineCollection({
  name: "Post",
  pattern: ["tech-posts/**/*.md", "life-posts/**/*.md"],
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
      path: s.path(),
    })
    .transform(({ path, ...data }) => {
      const section = sectionOfPath(path);
      return {
        ...data,
        section,
        permalink: `/${data.lang}/${section}/${data.slug}`,
      };
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
  collections: { categories, posts },
  markdown: { rehypePlugins: [rehypePrettyCode, rehypeTableScroll] },
  prepare: ({ categories, posts }) => {
    const unknownCategories = posts
      .flatMap((post) =>
        post.categories.map((slug) => ({ section: post.section, slug })),
      )
      .filter(
        ({ section, slug }) =>
          !categories.some((c) => c.section === section && c.slug === slug),
      );

    if (unknownCategories.length > 0) {
      console.error(
        "Unknown categories found:",
        unknownCategories
          .map(({ section, slug }) => `${section}/${slug}`)
          .join(", "),
      );
      return false;
    }

    for (const category of categories) {
      category.count = {
        en: 0,
        zh: 0,
      };
      for (const post of posts) {
        if (
          post.section === category.section &&
          post.categories.includes(category.slug)
        ) {
          category.count[post.lang] += 1;
        }
      }
    }
  },
});
