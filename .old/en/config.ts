import { defineConfig, type DefaultTheme } from "vitepress";
import { readdirSync, readFileSync, statSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const config = defineConfig({
  lang: "en-US",
  themeConfig: {
    nav: nav(),
    sidebar: sidebar(),
    editLink: {
      pattern: "https://github.com/luojiahai/luojiahai.github.io/edit/main/:path",
      text: "Edit this page on GitHub",
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} LUOJIAHAI`,
    },
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: "Home", link: "/" },
    // { text: "Blog", link: "/blog/", activeMatch: "/blog/" },
    { text: "Use", link: "/use" },
    { text: "Resume", link: "/resume" },
  ];
}

function sidebar(): DefaultTheme.Sidebar {
  return {
    "/blog/": [{ text: "Blog", collapsed: false, items: blogSidebarItems() }],
  };
}

function blogSidebarItems(): DefaultTheme.SidebarItem[] {
  const blogDir = resolve(__dirname, "blog");
  const posts: { text: string; link: string; date: string }[] = [];

  const collect = (src: string, link: string, fallback: string) => {
    const title = src.match(/^#\s+(.+)/m)?.[1].trim() ?? fallback;
    const date = src.match(/^date:\s*['"]?(\d{4}-\d{2}-\d{2})/m)?.[1] ?? "";
    posts.push({ text: title, link, date });
  };

  for (const f of readdirSync(blogDir).filter((f: string) => f !== "index.md" && !f.endsWith(".ts"))) {
    const fullPath = resolve(blogDir, f);
    if (statSync(fullPath).isDirectory()) {
      for (const c of readdirSync(fullPath).filter((c: string) => c.endsWith(".md"))) {
        const src = readFileSync(resolve(fullPath, c), "utf-8");
        collect(src, `/blog/${f}/${c.replace(/\.md$/, "")}`, c.replace(/\.md$/, ""));
      }
    } else {
      const src = readFileSync(fullPath, "utf-8");
      collect(src, `/blog/${f.replace(/\.md$/, "")}`, f.replace(/\.md$/, ""));
    }
  }

  // Sort by frontmatter date, newest first (matches the blog index in blog.data.ts).
  return posts
    .sort((a, b) => b.date.localeCompare(a.date) || a.link.localeCompare(b.link))
    .map(({ text, link }) => ({ text, link }));
}
