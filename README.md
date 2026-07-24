## luojiahai.com

[中文](./README.zh.md)

This is the source code of [luojiahai.com](https://luojiahai.com), my personal website.

## Stack

- [Svelte](https://svelte.dev) / [SvelteKit](https://svelte.dev/docs/kit)
- [TailwindCSS](https://tailwindcss.com)
- [Velite](https://velite.js.org)
- [Cloudflare Workers](https://workers.cloudflare.com) via `@sveltejs/adapter-cloudflare`

The whole site is prerendered at build time and served as static assets from
Cloudflare's edge. Only two things run in the worker: the `Accept-Language`
redirect for locale-less URLs, and the RSS feeds (cached with the Cloudflare
Cache API).

## Content

Both blogs share one content pipeline (Velite):

- `content/posts/**` — tech posts, served under `/{lang}/posts`
- `content/life-posts/**` — life posts, served under `/{lang}/life`
- `content/categories/{posts,life}.yml` — categories for each section

## Develop & Deploy

- `pnpm dev`: Start the local dev server.
- `pnpm check`: Type-check the project.
- `pnpm build`: Build the site (including prerendered pages and OG images).
- `pnpm preview`: Build and preview locally in the Workers runtime.
- `pnpm deploy`: Build and deploy to Cloudflare Workers. In CI, only main
  deploys to production; other branches upload a preview version.
