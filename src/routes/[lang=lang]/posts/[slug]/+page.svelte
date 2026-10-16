<script lang="ts">
  import { displayDate } from "$lib/date";
  import { getDictionary, languageLabels } from "$lib/dictionaries";
  import {
    generateBlogPostingJsonLd,
    generateBreadcrumbJsonLd,
  } from "$lib/json-ld";
  import { SITE_URL } from "$lib/site-config";
  import Icon from "$lib/components/Icon.svelte";
  import PostContent from "$lib/components/PostContent.svelte";
  import Seo from "$lib/components/Seo.svelte";

  let { data } = $props();

  let lang = $derived(data.lang);
  let post = $derived(data.post);
  let dictionary = $derived(getDictionary(lang));
  let postUrl = $derived(`${SITE_URL}${post.permalink}`);
</script>

<Seo
  {lang}
  title={post.title}
  description={post.description}
  keywords={post.keywords}
  path={post.permalink}
  ogType="article"
  article={{
    publishedTime: post.date,
    modifiedTime: post.updated,
    tags: post.categories,
  }}
  alternates={Object.fromEntries(
    [[lang, post.permalink], ...data.translations.map((t) => [t.lang, t.permalink])],
  )}
  jsonLd={[
    generateBlogPostingJsonLd({
      title: post.title,
      description: post.description,
      url: postUrl,
      datePublished: post.date,
      dateModified: post.updated,
      image: post.cover?.src ? `${SITE_URL}${post.cover.src}` : undefined,
      categories: post.categories,
      lang,
    }),
    generateBreadcrumbJsonLd({
      items: [
        {
          name: dictionary.labels.home,
          url: `${SITE_URL}${dictionary.urls.home}`,
        },
        {
          name: dictionary.labels.posts,
          url: `${SITE_URL}${dictionary.urls.posts}`,
        },
        { name: post.title, url: postUrl },
      ],
    }),
  ]}
/>

<!-- Breadcrumb strip across the top of the display -->
<div
  class="-mx-3.5 -mt-6 mb-7 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-line px-3.5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-ink-soft sm:-mx-6 sm:-mt-7 sm:px-6"
>
  <nav aria-label={dictionary.labels.posts} class="flex flex-wrap items-center gap-x-2">
    <a href={dictionary.urls.posts} class="text-accent hover:underline">
      {dictionary.labels.posts}
    </a>
    {#each data.categories as category (category.slug)}
      <span aria-hidden="true">›</span>
      <a href={category.permalink[lang]} class="hover:text-accent hover:underline">
        {category.name[lang]}
      </a>
    {/each}
  </nav>
  <span>{dictionary.labels.readingTime(data.readingMinutes)}</span>
</div>

<div class="flex flex-wrap items-start gap-x-10 gap-y-8">
  <article class="min-w-0 flex-[999_1_34rem]">
    <div
      class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tabular-nums text-ink-soft"
    >
      <span class="text-accent">{displayDate(post.date, lang)}</span>
      {#if post.updated}
        <span>{dictionary.labels.updated} {displayDate(post.updated, lang)}</span>
      {/if}
      {#each data.translations as translation (translation.lang)}
        <a class="text-accent hover:underline" href={translation.permalink}>
          {languageLabels[translation.lang]}
        </a>
      {/each}
    </div>
    <h1 class="mt-3 max-w-[30ch] text-[1.875rem] font-bold leading-[1.12] sm:text-[2.375rem]">
      {post.title}
    </h1>
    {#if post.description}
      <p class="mt-3.5 max-w-[60ch] text-base leading-relaxed text-ink-soft sm:text-[17px]">
        {post.description}
      </p>
    {/if}
    <div class="my-7 h-0.5 bg-line" aria-hidden="true"></div>

    <PostContent html={post.content} />

    {#if data.wechatQrSvg}
      <div class="card mt-8 flex max-w-[68ch] items-center gap-4 p-3">
        <div class="h-20 w-20 shrink-0 bg-white p-1.5">
          <!-- eslint-disable-next-line svelte/no-at-html-tags -- build-time QR SVG -->
          {@html data.wechatQrSvg}
        </div>
        <div>
          <p class="text-sm font-bold">WeChat</p>
          <p class="mt-0.5 text-xs text-ink-soft">
            {dictionary.labels.wechatScanHint}
          </p>
        </div>
      </div>
    {/if}

    <div
      class="mt-8 flex max-w-[68ch] flex-wrap justify-between gap-3 border-t-2 border-line pt-5"
    >
      <a href={dictionary.urls.posts} class="btn">
        {dictionary.labels.backToPosts}
      </a>
      <a
        href={dictionary.urls.shareToX(post.title, post.permalink)}
        target="_blank"
        rel="noopener"
        class="btn btn-accent"
      >
        {dictionary.labels.shareToX}
        <Icon name="x" class="h-3.5 w-3.5" />
      </a>
    </div>
  </article>

  {#if data.toc.length > 1 || post.keywords?.length}
    <aside class="flex-[1_1_13rem] lg:sticky lg:top-40">
      {#if data.toc.length > 1}
        <nav aria-label={dictionary.labels.contents} class="mb-7 hidden lg:block">
          <h2 class="mb-2 text-[11px] font-bold uppercase tracking-[0.18em]">
            {dictionary.labels.contents}
          </h2>
          {#each data.toc as heading (heading.id)}
            <a
              href="#{heading.id}"
              class="block border-l-2 border-line px-2.5 py-1.5 text-sm leading-snug text-ink-soft transition-colors hover:border-accent hover:text-accent"
            >
              {heading.text}
            </a>
          {/each}
        </nav>
      {/if}
      {#if post.keywords?.length}
        <h2 class="mb-2.5 text-[11px] font-bold uppercase tracking-[0.18em]">
          {dictionary.labels.keywords}
        </h2>
        <div class="flex flex-wrap gap-1.5">
          {#each post.keywords as keyword (keyword)}
            <span class="chip normal-case tracking-normal">{keyword}</span>
          {/each}
        </div>
      {/if}
    </aside>
  {/if}
</div>
