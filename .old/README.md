# [luojiahai.com](https://luojiahai.com/)

It's the source for my personal site. Built with [VitePress](https://vitepress.dev/) and deployed to [GitHub Pages](https://pages.github.com/).

## Development

```sh
pnpm install   # install dependencies
pnpm dev       # start dev server with hot-reload
pnpm build     # build for production → .vitepress/dist/
pnpm preview   # preview production build locally
pnpm format    # format all files with Prettier
pnpm lint      # lint with ESLint
```

Pre-commit hooks run Prettier + ESLint via `lint-staged` and `simple-git-hooks`.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages on every push to `main`. The live site is served at the custom domain `luojiahai.com` via `CNAME`.

## License

[MIT](LICENSE)
