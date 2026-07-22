<script lang="ts">
  import { page } from "$app/state";
  import { getDictionary, type Language } from "$lib/dictionaries";
  import PrintedDivider from "$lib/components/PrintedDivider.svelte";
  import PrintedEmpty from "$lib/components/PrintedEmpty.svelte";
  import PrintedPageTitle from "$lib/components/PrintedPageTitle.svelte";
  import PrintedSection from "$lib/components/PrintedSection.svelte";
  import Seo from "$lib/components/Seo.svelte";

  let lang = $derived(page.params.lang as Language);
  let dictionary = $derived(getDictionary(lang));

  let primaryWorks = $derived(dictionary.works.filter((work) => work.primary));
  let otherWorks = $derived(dictionary.works.filter((work) => !work.primary));
</script>

<Seo
  {lang}
  title="{dictionary.labels.works} - {dictionary.meta.websiteName}"
  description={dictionary.labels.worksSubtitle}
  path={dictionary.urls.works}
/>

<div>
  <!-- Header -->
  <PrintedSection>
    <PrintedPageTitle icon="apps">{dictionary.labels.works}</PrintedPageTitle>
    <p class="font-serif text-xs text-printer-ink-light dark:text-printer-ink-dark/50">
      {dictionary.labels.worksSubtitle}
    </p>
  </PrintedSection>

  <!-- Primary works -->
  <PrintedSection label={dictionary.labels.featured} labelIcon="star">
    <div class="flex flex-col gap-1">
      {#each primaryWorks as work (work.name)}
        <a
          href={work.link}
          target="_blank"
          rel="noopener"
          class="group flex items-center gap-3 py-3 -mx-2 px-2 rounded-md hover:bg-printer-ink/3 dark:hover:bg-printer-ink-dark/3 transition-colors"
        >
          {#if work.image}
            <img
              class="h-10 w-10 rounded-lg border border-printer-ink/10 dark:border-printer-ink-dark/10 shrink-0"
              src={work.image}
              alt={dictionary.labels.icon(work.name)}
              width="40"
              height="40"
              loading="lazy"
            />
          {:else}
            <div
              class="h-10 w-10 rounded-lg bg-printer-accent/10 dark:bg-printer-accent-dark/10 flex items-center justify-center font-mono text-lg font-bold text-printer-accent dark:text-printer-accent-dark shrink-0"
            >
              {work.name[0]}
            </div>
          {/if}
          <div class="min-w-0 flex-1">
            <div
              class="font-mono text-sm font-medium text-printer-ink dark:text-printer-ink-dark group-hover:text-printer-accent dark:group-hover:text-printer-accent-dark transition-colors"
            >
              {work.name}
            </div>
            <div
              class="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 mt-0.5 line-clamp-1"
            >
              {work.summary}
            </div>
          </div>
          <span
            class="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/30 group-hover:text-printer-accent dark:group-hover:text-printer-accent-dark transition-colors shrink-0"
          >
            →
          </span>
        </a>
      {:else}
        <PrintedEmpty />
      {/each}
    </div>
  </PrintedSection>

  <PrintedDivider style="dashed" />

  <!-- Other works -->
  <PrintedSection label={dictionary.labels.archive} labelIcon="archive">
    <div class="flex flex-col gap-1">
      {#each otherWorks as work (work.name)}
        <a
          href={work.link}
          target="_blank"
          rel="noopener"
          class="group flex items-center gap-3 py-2.5 -mx-2 px-2 rounded-md hover:bg-printer-ink/3 dark:hover:bg-printer-ink-dark/3 transition-colors"
        >
          {#if work.image}
            <img
              class="h-8 w-8 rounded-lg border border-printer-ink/10 dark:border-printer-ink-dark/10 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"
              src={work.image}
              alt={dictionary.labels.icon(work.name)}
              width="32"
              height="32"
              loading="lazy"
            />
          {:else}
            <div
              class="h-8 w-8 rounded-lg bg-printer-ink/5 dark:bg-printer-ink-dark/5 flex items-center justify-center font-mono text-sm font-bold text-printer-ink-light dark:text-printer-ink-dark/40 shrink-0"
            >
              {work.name[0]}
            </div>
          {/if}
          <div class="min-w-0 flex-1">
            <div
              class="font-mono text-xs text-printer-ink/70 dark:text-printer-ink-dark/70 group-hover:text-printer-accent dark:group-hover:text-printer-accent-dark transition-colors"
            >
              {work.name}
            </div>
            <div
              class="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/30 mt-0.5 line-clamp-1"
            >
              {work.summary}
            </div>
          </div>
          <span
            class="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/30 group-hover:text-printer-accent dark:group-hover:text-printer-accent-dark transition-colors shrink-0"
          >
            →
          </span>
        </a>
      {:else}
        <PrintedEmpty />
      {/each}
    </div>
  </PrintedSection>
</div>
