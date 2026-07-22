<script lang="ts">
  import { displayDate } from "$lib/date";
  import { getDictionary, languageLabels } from "$lib/dictionaries";
  import {
    generateBlogPostingJsonLd,
    generateBreadcrumbJsonLd,
  } from "$lib/json-ld";
  import Icon from "$lib/components/Icon.svelte";
  import PostContent from "$lib/components/PostContent.svelte";
  import PrintedDivider from "$lib/components/PrintedDivider.svelte";
  import PrintedLabel from "$lib/components/PrintedLabel.svelte";
  import PrintedSection from "$lib/components/PrintedSection.svelte";
  import Seo from "$lib/components/Seo.svelte";

  let { data } = $props();

  let lang = $derived(data.lang);
  let post = $derived(data.post);
  let dictionary = $derived(getDictionary(lang));
  let baseUrl = $derived(dictionary.meta.baseUrl);
  let postUrl = $derived(`${baseUrl}${post.permalink}`);
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
      image: post.cover?.src ? `${baseUrl}${post.cover.src}` : undefined,
      categories: post.categories,
      lang,
    }),
    generateBreadcrumbJsonLd({
      items: [
        {
          name: dictionary.labels.home,
          url: `${baseUrl}${dictionary.urls.home}`,
        },
        {
          name: dictionary.labels[data.section],
          url: `${baseUrl}${dictionary.urls[data.section]}`,
        },
        { name: post.title, url: postUrl },
      ],
    }),
  ]}
/>

<div>
  <!-- Post header -->
  <PrintedSection>
    <div class="flex flex-wrap gap-1.5 mb-3">
      {#each data.categories as category (category.slug)}
        <a href={category.permalink[lang]}>
          <PrintedLabel variant="accent">{category.name[lang]}</PrintedLabel>
        </a>
      {/each}
    </div>
    <h1
      class="font-serif text-2xl font-bold text-printer-ink dark:text-printer-ink-dark leading-tight"
    >
      {post.title}
    </h1>
    <div class="flex items-center gap-3 mt-2 flex-wrap">
      <span
        class="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 tabular-nums"
      >
        {displayDate(post.date, lang)}
      </span>
      {#if data.translations.length > 0}
        <div class="flex items-center gap-2">
          <span
            class="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40"
          >
            |
          </span>
          {#each data.translations as translation (translation.lang)}
            <a
              class="font-mono text-[10px] text-printer-accent dark:text-printer-accent-dark hover:underline"
              href={translation.permalink}
            >
              {languageLabels[translation.lang]}
            </a>
          {/each}
        </div>
      {/if}
    </div>
    {#if post.description}
      <p
        class="font-serif text-xs text-printer-ink-light dark:text-printer-ink-dark/50 mt-2 leading-relaxed"
      >
        {post.description}
      </p>
    {/if}
  </PrintedSection>

  <PrintedDivider style="solid" />

  <!-- Post content -->
  <PostContent html={post.content} />

  <!-- WeChat QR Code -->
  {#if data.wechatQrSvg}
    <PrintedDivider style="dashed" />
    <div class="flex items-center gap-4 py-1">
      <div class="shrink-0 w-20 h-20 bg-white p-1.5">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -- build-time QR SVG -->
        {@html data.wechatQrSvg}
      </div>
      <div>
        <p class="font-mono text-[11px] text-printer-ink dark:text-printer-ink-dark">
          WeChat
        </p>
        <p
          class="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 mt-0.5"
        >
          {dictionary.labels.wechatScanHint}
        </p>
      </div>
    </div>
  {/if}

  <PrintedDivider style="dashed" />

  <!-- Footer actions -->
  <div class="flex items-center gap-4">
    <span
      class="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 uppercase tracking-wider"
    >
      {dictionary.labels.shareTo}
    </span>
    <a
      href={dictionary.urls.shareToX(post.title, post.permalink)}
      target="_blank"
      rel="noopener"
      class="text-printer-ink-light dark:text-printer-ink-dark/40 hover:text-printer-ink dark:hover:text-printer-ink-dark transition-colors"
      aria-label="Share to X"
    >
      <Icon name="x" class="w-4 h-4" />
    </a>
  </div>

  <div class="mt-6">
    <a
      href={dictionary.urls[data.section]}
      class="inline-flex items-center gap-1 font-mono text-[11px] tracking-wider text-printer-accent dark:text-printer-accent-dark hover:underline"
    >
      {dictionary.labels.backToSection[data.section]}
    </a>
  </div>

</div>
