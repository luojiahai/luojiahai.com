import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      "#velite": ".velite/index.js",
    },
    prerender: {
      // Everything on this site is derived from build-time content. The only
      // runtime code is the locale redirect in hooks.server.ts.
      // /resume is intentionally unlinked, so the crawler needs a hint.
      entries: ["*", "/en", "/zh", "/en/resume", "/zh/resume"],
      handleHttpError: "fail",
    },
  },
};

export default config;
