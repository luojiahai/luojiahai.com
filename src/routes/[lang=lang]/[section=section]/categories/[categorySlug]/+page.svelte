<script lang="ts">
  import { getDictionary } from "$lib/dictionaries";
  import PostList from "$lib/components/PostList.svelte";
  import PrintedDivider from "$lib/components/PrintedDivider.svelte";
  import PrintedPageTitle from "$lib/components/PrintedPageTitle.svelte";
  import PrintedSection from "$lib/components/PrintedSection.svelte";
  import Seo from "$lib/components/Seo.svelte";

  let { data } = $props();

  let lang = $derived(data.lang);
  let dictionary = $derived(getDictionary(lang));
  let category = $derived(data.category);
</script>

<Seo
  {lang}
  title="{category.name[lang]} - {dictionary.meta.websiteName}"
  description={category.description?.[lang]}
  path={category.permalink[lang]}
/>

<div>
  <!-- Header -->
  <PrintedSection>
    <PrintedPageTitle icon="tag">{category.name[lang]}</PrintedPageTitle>
    {#if category.description?.[lang]}
      <p class="font-serif text-xs text-printer-ink-light dark:text-printer-ink-dark/50">
        {category.description[lang]}
      </p>
    {/if}
    <p
      class="font-serif text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 mt-1"
    >
      {dictionary.labels.entries(data.posts.length)}
    </p>
  </PrintedSection>

  <!-- Back link -->
  <div class="mb-4">
    <a
      href={dictionary.urls[data.section]}
      class="inline-flex items-center gap-1 font-mono text-[11px] tracking-wider text-printer-accent dark:text-printer-accent-dark hover:underline"
    >
      {dictionary.labels.allSectionPosts[data.section]}
    </a>
  </div>

  <PrintedDivider style="dashed" />

  <!-- Post list -->
  <PostList posts={data.posts} {lang} />
</div>
