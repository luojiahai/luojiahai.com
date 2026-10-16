<script lang="ts">
  import { ecamDate } from "$lib/date";
  import { getDictionary, languageLabels } from "$lib/dictionaries";
  import {
    generateBlogPostingJsonLd,
    generateBreadcrumbJsonLd,
  } from "$lib/json-ld";
  import { SITE_URL } from "$lib/site-config";
  import PostContent from "$lib/components/PostContent.svelte";
  import ScreenChip from "$lib/components/ScreenChip.svelte";
  import ScreenTitle from "$lib/components/ScreenTitle.svelte";
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

{#if data.categories.length > 0}
  <div class="mb-4 flex flex-wrap gap-2">
    {#each data.categories as category (category.slug)}
      <ScreenChip href={category.permalink[lang]}>{category.name[lang]}</ScreenChip>
    {/each}
  </div>
{/if}

<ScreenTitle kind="post" subtitle={post.description}>{post.title}</ScreenTitle>

<div
  class="mt-3.5 flex flex-wrap items-center gap-x-3.5 gap-y-2 font-mono text-[13px]"
>
  <span class="text-ecam-green tabular-nums">{ecamDate(post.date, lang)}</span>
  {#each data.translations as translation (translation.lang)}
    <a class="act" href={translation.permalink}>
      {languageLabels[translation.lang]} ›
    </a>
  {/each}
</div>

<PostContent html={post.content} />

{#if data.wechatQrSvg}
  <div class="mt-6 flex items-center gap-4">
    <div class="h-20 w-20 shrink-0 bg-white p-1.5">
      <!-- eslint-disable-next-line svelte/no-at-html-tags -- build-time QR SVG -->
      {@html data.wechatQrSvg}
    </div>
    <div>
      <p class="text-[13px] font-bold tracking-[0.06em] text-ecam-white">WECHAT</p>
      <p class="mt-1 font-read text-sm text-ecam-dim">
        {dictionary.labels.wechatScanHint}
      </p>
    </div>
  </div>
{/if}

<div
  class="mt-[18px] flex flex-wrap justify-between gap-3 border-t border-white/15 pt-3.5"
>
  <a class="act" href={dictionary.urls.posts}>{dictionary.labels.backToPosts}</a>
  <a
    class="act"
    href={dictionary.urls.shareToX(post.title, post.permalink)}
    target="_blank"
    rel="noopener"
  >
    {dictionary.labels.shareToX} ›
  </a>
</div>
