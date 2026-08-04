## luojiahai.com

[中文](./README.zh.md)

This is the source code of [luojiahai.com](https://luojiahai.com), my personal website.

## Stack

- [Svelte](https://svelte.dev) / [SvelteKit](https://svelte.dev/docs/kit)
- [TailwindCSS](https://tailwindcss.com)
- [Velite](https://velite.js.org)
- [Cloudflare Workers](https://workers.cloudflare.com) via `@sveltejs/adapter-cloudflare`

The whole site is prerendered at build time and served as static assets from
Cloudflare's edge. Only three things run in the worker: the `Accept-Language`
redirect for locale-less URLs, the RSS feeds, and `/api/social` (live profile
stats for the social hover cards). All of them are cached with the Cloudflare
Cache API.

`/fly/<aircraft>` serves a flight companion — a standalone, self-contained
checklist page built from the notes in `src/lib/fly/<aircraft>/`.

## Content

Posts run through Velite:

- `content/posts/YYYY-MM-DD title/<lang>.md` — one file per translation,
  images alongside, served under `/{lang}/posts`
- `content/categories/posts.yml` — the categories those posts can use

## Develop & Deploy

- `pnpm dev`: Start the local dev server.
- `pnpm check`: Type-check the project.
- `pnpm build`: Build the site (including prerendered pages and OG images).
- `pnpm preview`: Build and preview locally in the Workers runtime.
- `pnpm deploy`: Build and deploy to Cloudflare Workers. In CI, only main
  deploys to production; other branches upload a preview version.
