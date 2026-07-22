<script lang="ts">
  import { page } from "$app/state";
  import { getDictionary, type Language } from "$lib/dictionaries";
  import PostContent from "$lib/components/PostContent.svelte";
  import PrintedDivider from "$lib/components/PrintedDivider.svelte";
  import PrintedPageTitle from "$lib/components/PrintedPageTitle.svelte";
  import PrintedSection from "$lib/components/PrintedSection.svelte";
  import Seo from "$lib/components/Seo.svelte";

  let lang = $derived(page.params.lang as Language);
  let dictionary = $derived(getDictionary(lang));
  let subtitle = $derived(dictionary.labels.aboutSubtitle.trim());

  // Convert the simple markdown-ish about text to HTML.
  let aboutHtml = $derived(
    dictionary.aboutContent
      .trim()
      .replace(/### (.+)/g, "<h3>$1</h3>")
      .replace(/## (.+)/g, "<h2>$1</h2>")
      .replace(/# (.+)/g, "<h1>$1</h1>")
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener">$1</a>',
      )
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/^/, "<p>")
      .replace(/$/, "</p>")
      .replace(/<p><h([123])>/g, "<h$1>")
      .replace(/<\/h([123])><\/p>/g, "</h$1>")
      .replace(/<p><\/p>/g, ""),
  );
</script>

<Seo
  {lang}
  title="{dictionary.labels.aboutTitle} - {dictionary.meta.websiteName}"
  description={subtitle || dictionary.labels.aboutTitle}
  path={dictionary.urls.about}
/>

<div>
  <!-- Header -->
  <PrintedSection>
    <PrintedPageTitle icon="user">{dictionary.labels.aboutTitle}</PrintedPageTitle>
    {#if subtitle}
      <p class="font-serif text-xs text-printer-ink-light dark:text-printer-ink-dark/50">
        {subtitle}
      </p>
    {/if}
  </PrintedSection>

  <PrintedDivider style="solid" />

  <!-- About content -->
  <PostContent html={aboutHtml} />

  <PrintedDivider style="dashed" />

  <!-- Footer -->
  <div
    class="font-mono text-[9px] text-printer-ink-light dark:text-printer-ink-dark/30 tracking-wider uppercase text-center py-4"
  >
    {lang === "zh" ? "就酱～" : "That's about it~"}
  </div>
</div>
