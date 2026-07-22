<script lang="ts">
  import { getDictionary, languages, defaultLanguage } from "$lib/dictionaries";
  import type { Language } from "$lib/dictionaries";

  const BASE_URL = "https://luojiahai.com";

  let {
    lang,
    title,
    description,
    keywords,
    path,
    ogType = "website",
    ogImage,
    article,
    alternates,
    feeds = false,
    noindex = false,
    jsonLd = [],
  }: {
    lang: Language;
    title: string;
    description?: string;
    keywords?: string[];
    /** Canonical path of this page, e.g. "/en/posts". */
    path: string;
    ogType?: "website" | "article";
    /** Path of the OG image; defaults to the prerendered one for this page. */
    ogImage?: string;
    article?: {
      publishedTime: string;
      modifiedTime?: string;
      tags?: string[];
    };
    /**
     * Language alternates as {lang: path}. Defaults to the same path with
     * the language prefix swapped (correct for all non-post pages).
     */
    alternates?: Partial<Record<Language, string>>;
    /** Advertise RSS feeds (used on the home page). */
    feeds?: boolean;
    noindex?: boolean;
    jsonLd?: object[];
  } = $props();

  let dictionary = $derived(getDictionary(lang));
  let url = $derived(`${BASE_URL}${path}`);
  let image = $derived(`${BASE_URL}${ogImage ?? `/og${path}.png`}`);
  let allKeywords = $derived(dictionary.meta.fillKeywords(keywords));
  let feedBase = $derived(lang === "zh" ? "/feed/zh" : "/feed");

  let languageAlternates = $derived.by(() => {
    const entries = languages.map((other) => {
      const alternate =
        alternates?.[other] ?? path.replace(/^\/(en|zh)(?=\/|$)/, `/${other}`);
      return [other, `${BASE_URL}${alternate}`] as const;
    });
    const defaultEntry = entries.find(([other]) => other === defaultLanguage);
    return defaultEntry
      ? [...entries, ["x-default", defaultEntry[1]] as const]
      : entries;
  });

  // JSON-LD must be a raw <script> tag; Svelte can't template that directly.
  let jsonLdHtml = $derived(
    jsonLd
      .map(
        (item) =>
          `<script type="application/ld+json">${JSON.stringify(item).replace(/</g, "\\u003c")}<\/script>`,
      )
      .join(""),
  );
</script>

<svelte:head>
  <title>{title}</title>
  {#if description}
    <meta name="description" content={description} />
  {/if}
  <meta name="keywords" content={allKeywords.join(", ")} />
  <meta name="author" content="Luo, Jiahai" />
  <link rel="canonical" href={url} />
  {#if noindex}
    <meta name="robots" content="noindex, nofollow" />
  {/if}

  <meta property="og:type" content={ogType} />
  <meta property="og:url" content={url} />
  <meta property="og:title" content={title} />
  {#if description}
    <meta property="og:description" content={description} />
  {/if}
  <meta property="og:site_name" content={dictionary.meta.websiteName} />
  <meta property="og:locale" content={lang === "zh" ? "zh_CN" : "en_US"} />
  <meta property="og:image" content={image} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  {#if article}
    <meta property="article:published_time" content={article.publishedTime} />
    <meta
      property="article:modified_time"
      content={article.modifiedTime ?? article.publishedTime}
    />
    <meta property="article:author" content="Luo, Jiahai" />
    {#each article.tags ?? [] as tag (tag)}
      <meta property="article:tag" content={tag} />
    {/each}
  {/if}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@luojiahai" />
  <meta name="twitter:creator" content="@luojiahai" />
  <meta name="twitter:title" content={title} />
  {#if description}
    <meta name="twitter:description" content={description} />
  {/if}
  <meta name="twitter:image" content={image} />

  {#each languageAlternates as [hreflang, href] (hreflang)}
    <link rel="alternate" hreflang={hreflang} {href} />
  {/each}

  {#if feeds}
    <link
      rel="alternate"
      type="application/rss+xml"
      href="{feedBase}"
      title="{dictionary.meta.websiteName} - All"
    />
    <link
      rel="alternate"
      type="application/rss+xml"
      href="{feedBase}/tech"
      title="{dictionary.meta.websiteName} - Tech"
    />
    <link
      rel="alternate"
      type="application/rss+xml"
      href="{feedBase}/life"
      title="{dictionary.meta.websiteName} - Life"
    />
  {/if}

  <!-- eslint-disable-next-line svelte/no-at-html-tags -- serialized JSON-LD -->
  {@html jsonLdHtml}
</svelte:head>
