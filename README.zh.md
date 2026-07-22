## luojiahai.com

[English](./README.md)

这里是罗嘉海的个人网站 [luojiahai.com](https://luojiahai.com) 的源码。网站技术栈基于 [nooc.me](https://github.com/noobnooc/nooc.me)。

## 技术栈

- [Svelte](https://svelte.dev) / [SvelteKit](https://svelte.dev/docs/kit)
- [TailwindCSS](https://tailwindcss.com)
- [Velite](https://velite.js.org)
- [Cloudflare Workers](https://workers.cloudflare.com)（通过 `@sveltejs/adapter-cloudflare`）

整个站点在构建期预渲染，作为静态资源由 Cloudflare 边缘节点直接分发。Worker
中只运行两件事：无语言前缀 URL 的 `Accept-Language` 重定向，以及 RSS
订阅源（使用 Cloudflare Cache API 做边缘缓存）。

## 内容

两个博客共用同一套内容管道（Velite）：

- `content/posts/**` —— 技术文章，对应 `/{lang}/posts`
- `content/life-posts/**` —— 生活文章，对应 `/{lang}/life`
- `content/categories/{posts,life}.yml` —— 两个板块各自的分类

## 开发与部署

- `pnpm dev`：启动本地开发服务器。
- `pnpm check`：类型检查。
- `pnpm build`：构建站点（包含预渲染页面与 OG 图片）。
- `pnpm preview`：构建并在本地 Workers 运行时中预览。
- `pnpm deploy`：构建并部署到 Cloudflare Workers。
