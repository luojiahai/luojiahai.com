import rehypePrettyCode from "rehype-pretty-code";
import { defineCollection, defineConfig, s } from "velite";

/**
 * Both blogs share a single content pipeline:
 *   content/posts/**      -> section "posts" (tech), served under /{lang}/posts
 *   content/life-posts/** -> section "life",         served under /{lang}/life
 * Categories live in content/categories/{posts,life}.yml.
 */

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

function sectionOfPath(path: string): "posts" | "life" {
  return path.startsWith("life-posts/") || path.startsWith("categories/life")
    ? "life"
    : "posts";
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
  pattern: ["posts/**/*.md", "life-posts/**/*.md"],
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
  markdown: { rehypePlugins: [rehypePrettyCode] },
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
