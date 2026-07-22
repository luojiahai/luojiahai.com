import { defineConfig } from "vitepress";
import { config as enConfig } from "../en/config";
import { config as zhConfig } from "../zh/config";
import { searchOptions as zhSearchOptions } from "../zh/config";

export default defineConfig({
  title: "luojiahai",
  description: "Hello, World!",
  locales: {
    root: { label: "English", ...enConfig },
    zh: { label: "简体中文", ...zhConfig },
  },
  srcExclude: ["archive/**/*", "examples/**/*", "README.md"],
  appearance: true,
  lastUpdated: true,
  markdown: {
    theme: { light: "vitesse-light", dark: "vitesse-dark" },
  },
  metaChunk: true,
  cleanUrls: true,
  rewrites: {
    "en/:rest*": ":rest*",
    "root/:rest*": ":rest*",
  },
  sitemap: {
    hostname: "https://luojiahai.com",
    transformItems(items) {
      return items.filter((item) => !item.url.includes("migration"));
    },
  },
  /* prettier-ignore */
  head: [
    ["link", { rel: "shortcut icon", href: "/favicon.ico" }],
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    ["link", { rel: "apple-touch-icon", href: "/apple-touch-icon.png" }],
    ["link", { rel: "icon", type: "image/png", href: "/favicon-32x32.png", sizes: "32x32" }],
    ["link", { rel: "icon", type: "image/png", href: "/favicon-16x16.png", sizes: "16x16" }],
    ["link", { rel: "manifest", href: "/manifest.json" }],
    ["meta", { name: "theme-color", content: "#141413" }],
    ["meta", { name: "description", content: "Hello, World!" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "en" }],
    ["meta", { property: "og:site_name", content: "luojiahai" }],
    ["meta", { property: "og:title", content: "luojiahai" }],
    ["meta", { property: "og:description", content: "Hello, World!" }],
    ["meta", { property: "og:image", content: "https://luojiahai.com/apple-touch-icon.png" }],
    ["meta", { property: "og:url", content: "https://luojiahai.com/" }],
  ],
  themeConfig: {
    logo: { light: "/logo-light.svg", dark: "/logo-dark.svg" },
    // siteTitle: "LUOJIAHAI",
    socialLinks: [
      { icon: "github", link: "https://github.com/luojiahai" },
      { icon: "x", link: "https://x.com/luojiahai" },
      { icon: "instagram", link: "https://instagram.com/luojiahai" },
      { icon: "linkedin", link: "https://linkedin.com/in/luojiahai" },
      { icon: "bilibili", link: "https://space.bilibili.com/866961" },
      { icon: "xiaohongshu", link: "https://www.xiaohongshu.com/user/profile/5c8e525c000000001203a0ba" },
      { icon: "sinaweibo", link: "https://weibo.com/ljiahai" },
    ],
    search: {
      provider: "local",
      options: {
        locales: {
          zh: zhSearchOptions(),
        },
      },
    },
  },
});
