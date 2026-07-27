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
    <p class="page-subtitle">
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
          class="printed-row group -mx-3 flex items-center gap-4 px-3 py-4 transition-colors hover:bg-printer-ink/[0.035] focus-visible:bg-printer-ink/[0.035] focus-visible:outline-none dark:hover:bg-printer-ink-dark/[0.035] dark:focus-visible:bg-printer-ink-dark/[0.035]"
        >
          {#if work.image}
            <img
              class="h-12 w-12 shrink-0 border border-printer-ink/10 dark:border-printer-ink-dark/10"
              src={work.image}
              alt={dictionary.labels.icon(work.name)}
              width="48"
              height="48"
              loading="lazy"
            />
          {:else}
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center bg-printer-accent/10 font-mono text-lg font-semibold text-printer-accent dark:bg-printer-accent-dark/10 dark:text-printer-accent-dark"
            >
              {work.name[0]}
            </div>
          {/if}
          <div class="min-w-0 flex-1">
            <div
              class="font-serif text-xl font-medium tracking-[-0.02em] text-printer-ink transition-colors group-hover:text-printer-accent dark:text-printer-ink-dark dark:group-hover:text-printer-accent-dark"
            >
              {work.name}
            </div>
            <div
              class="mt-0.5 line-clamp-1 font-serif text-[13px] text-printer-ink-light dark:text-printer-ink-dark/60"
            >
              {work.summary}
            </div>
          </div>
          <span
            class="shrink-0 font-mono text-sm text-printer-ink-light transition-transform duration-200 group-hover:translate-x-1 group-hover:text-printer-accent dark:text-printer-ink-dark/30 dark:group-hover:text-printer-accent-dark"
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
          class="printed-row group -mx-3 flex items-center gap-3 px-3 py-3 transition-colors hover:bg-printer-ink/[0.035] focus-visible:bg-printer-ink/[0.035] focus-visible:outline-none dark:hover:bg-printer-ink-dark/[0.035] dark:focus-visible:bg-printer-ink-dark/[0.035]"
        >
          {#if work.image}
            <img
              class="h-9 w-9 shrink-0 border border-printer-ink/10 opacity-60 transition-opacity group-hover:opacity-100 dark:border-printer-ink-dark/10"
              src={work.image}
              alt={dictionary.labels.icon(work.name)}
              width="36"
              height="36"
              loading="lazy"
            />
          {:else}
            <div
              class="flex h-9 w-9 shrink-0 items-center justify-center bg-printer-ink/5 font-mono text-sm font-semibold text-printer-ink-light dark:bg-printer-ink-dark/5 dark:text-printer-ink-dark/40"
            >
              {work.name[0]}
            </div>
          {/if}
          <div class="min-w-0 flex-1">
            <div
              class="font-serif text-base font-medium text-printer-ink/75 transition-colors group-hover:text-printer-accent dark:text-printer-ink-dark/70 dark:group-hover:text-printer-accent-dark"
            >
              {work.name}
            </div>
            <div
              class="mt-0.5 line-clamp-1 font-serif text-xs text-printer-ink-light dark:text-printer-ink-dark/55"
            >
              {work.summary}
            </div>
          </div>
          <span
            class="shrink-0 font-mono text-xs text-printer-ink-light transition-transform duration-200 group-hover:translate-x-1 group-hover:text-printer-accent dark:text-printer-ink-dark/30 dark:group-hover:text-printer-accent-dark"
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
