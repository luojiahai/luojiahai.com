import type { Element, Parent, Root } from "hast";
import rehypePrettyCode from "rehype-pretty-code";
import { defineCollection, defineConfig, s } from "velite";
import { aircraft, match as isAircraft } from "./src/params/aircraft";

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

/** The keys that appear more than once, each reported once. */
function duplicates(keys: string[]): string[] {
  const seen = new Set<string>();
  return [
    ...new Set(
      keys.filter((key) => (seen.has(key) ? true : (seen.add(key), false))),
    ),
  ];
}

const categories = defineCollection({
  name: "Category",
  pattern: "categories/*.yml",
  schema: s
    .object({
      slug: s.string(),
      name: localized(20),
      description: localized(100).optional(),
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
      archived: s.boolean().default(false),
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

/**
 * The flight companions, listed in the Fly section of /{lang}/projects. The
 * name and URL come from the aircraft registry; only the blurb is here.
 */
const fly = defineCollection({
  name: "FlyEntry",
  pattern: "fly/*.yml",
  schema: s.object({
    slug: s.string().refine(isAircraft, "Unknown aircraft"),
    description: localized(100),
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
  collections: { categories, fly, pages, posts, projects, use },
  markdown: { rehypePlugins: [rehypePrettyCode, rehypeTableScroll] },
  // Without strict, a schema violation is only logged and the document still
  // ships, so every cap above would be advisory.
  strict: true,
  prepare: ({ categories, fly, pages, posts, projects, use }) => {
    const problems: string[] = [];
    const report = (what: string, found: string[]) => {
      if (found.length > 0) problems.push(`${what}: ${found.join(", ")}`);
    };

    report(
      "Unknown categories",
      [...new Set(posts.flatMap((post) => post.categories))].filter(
        (slug) => !categories.some((category) => category.slug === slug),
      ),
    );

    // Every list page keys its `{#each}` by the key named here, and Svelte
    // throws on a repeated key - so a duplicate is a broken page, not a
    // cosmetic slip. Posts key by lang+slug because translations share one
    // slug; use items have no slug at all, so the page keys them by `value`.
    const keyed = [
      ["post slugs", posts.map((post) => `${post.lang}/${post.slug}`)],
      ["page slugs", pages.map((page) => `${page.lang}/${page.slug}`)],
      ["category slugs", categories.map((category) => category.slug)],
      ["project slugs", projects.map((project) => project.slug)],
      ["use group slugs", use.map((group) => group.slug)],
      ...use.map(
        (group) =>
          [
            `use items in ${group.slug}`,
            group.items.map((item) => item.value),
          ] as const,
      ),
      ["fly slugs", fly.map((entry) => entry.slug)],
    ] as const;
    for (const [what, keys] of keyed) report(`Duplicate ${what}`, duplicates(keys));

    // The schema rejects a fly.yml slug missing from the registry; this is the
    // other direction. An aircraft with no row still prerenders its page, but
    // nothing links to it.
    report(
      "Aircraft missing from content/fly/fly.yml",
      aircraft
        .map((entry) => entry.slug)
        .filter((slug) => !fly.some((entry) => entry.slug === slug)),
    );

    // Unlike posts, a page renders at a fixed URL in every language, so a
    // missing translation is a broken route rather than one fewer list entry.
    const pageKeys = new Set(pages.map((page) => `${page.lang}/${page.slug}`));
    report(
      "Missing page translations",
      [...new Set(pages.map((page) => page.slug))].flatMap((slug) =>
        lang.options
          .filter((language) => !pageKeys.has(`${language}/${slug}`))
          .map((language) => `pages/${slug}/${language}.md`),
      ),
    );

    if (problems.length > 0) throw new Error(problems.join("\n"));
  },
});
