<script lang="ts">
  import { page } from "$app/state";
  import { getDictionary, type Language } from "$lib/dictionaries";
  import type { Activity } from "../../../../params/activity";
  import type { IconName } from "$lib/icons";
  import PrintedDivider from "$lib/components/PrintedDivider.svelte";
  import PrintedEmpty from "$lib/components/PrintedEmpty.svelte";
  import PrintedPageTitle from "$lib/components/PrintedPageTitle.svelte";
  import PrintedSection from "$lib/components/PrintedSection.svelte";
  import Seo from "$lib/components/Seo.svelte";

  let lang = $derived(page.params.lang as Language);
  let activity = $derived(page.params.activity as Activity);
  let dictionary = $derived(getDictionary(lang));

  const icons: Record<Activity, IconName> = {
    reading: "book",
    films: "film",
    music: "music",
  };

  let title = $derived(dictionary.labels[activity]);
  let items = $derived(dictionary.archive[activity]);
</script>

<Seo
  {lang}
  title="{title} - {dictionary.labels.life} - {dictionary.meta.websiteName}"
  description={title}
  path="{dictionary.urls.life}/{activity}"
/>

<div>
  <!-- Header -->
  <PrintedSection>
    <PrintedPageTitle icon={icons[activity]}>{title}</PrintedPageTitle>
    <p class="font-serif text-xs text-printer-ink-light dark:text-printer-ink-dark/50">
      {dictionary.labels.entries(items.length)}
    </p>
  </PrintedSection>

  <PrintedDivider style="dashed" />

  <!-- Archive list -->
  <PrintedSection>
    <div class="flex flex-col">
      {#each items as item, index (item.title)}
        <div>
          <div class="py-2.5 -mx-2 px-2">
            <div class="font-mono text-sm text-printer-ink dark:text-printer-ink-dark">
              {item.title}
            </div>
            <p
              class="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 mt-0.5"
            >
              {item.summary}
            </p>
          </div>
          {#if index < items.length - 1}
            <div
              class="border-b border-dotted border-printer-ink/5 dark:border-printer-ink-dark/5"
            ></div>
          {/if}
        </div>
      {:else}
        <PrintedEmpty />
      {/each}
    </div>
  </PrintedSection>

  <PrintedDivider style="dashed" />

  <!-- Back link -->
  <PrintedSection>
    <a
      href={dictionary.urls.life}
      class="inline-flex items-center gap-1.5 font-mono text-xs text-printer-ink-light dark:text-printer-ink-dark/50 hover:text-printer-accent dark:hover:text-printer-accent-dark transition-colors"
    >
      <span>←</span>
      <span class="uppercase tracking-wider">{dictionary.labels.life}</span>
    </a>
  </PrintedSection>
</div>
