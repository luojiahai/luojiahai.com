<script lang="ts">
  import { page } from "$app/state";
  import { getDictionary, type Language } from "$lib/dictionaries";
  import PrintedDivider from "$lib/components/PrintedDivider.svelte";
  import PrintedPageTitle from "$lib/components/PrintedPageTitle.svelte";
  import PrintedSection from "$lib/components/PrintedSection.svelte";
  import Seo from "$lib/components/Seo.svelte";

  let { data } = $props();

  let lang = $derived(page.params.lang as Language);
  let dictionary = $derived(getDictionary(lang));
</script>

<Seo
  {lang}
  title="{dictionary.labels.use} - {dictionary.meta.websiteName}"
  description={dictionary.labels.useSubtitle}
  path={dictionary.urls.use}
/>

<div>
  <!-- Header -->
  <PrintedSection>
    <PrintedPageTitle icon="tools">{dictionary.labels.use}</PrintedPageTitle>
    <p class="page-subtitle">
      {dictionary.labels.useSubtitle}
    </p>
  </PrintedSection>

  <PrintedDivider style="solid" />

  <!-- One section per group; the group names carry the labels here. -->
  {#each data.groups as group (group.slug)}
    <PrintedSection label={group.label} labelIcon="tag">
      <div class="flex flex-col">
        {#each group.items as item, index (item.value)}
          <div>
            <div
              class="flex flex-col gap-y-1 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-4"
            >
              <div
                class="font-mono text-[10px] uppercase tracking-[0.2em] text-printer-ink-light dark:text-printer-ink-dark/45"
              >
                {item.label}
              </div>
              <div
                class="font-mono text-xs text-printer-ink dark:text-printer-ink-dark sm:text-right"
              >
                {item.value}
              </div>
            </div>
            {#if index < group.items.length - 1}
              <div
                class="border-b border-dotted border-printer-ink/5 dark:border-printer-ink-dark/5"
              ></div>
            {/if}
          </div>
        {/each}
      </div>
    </PrintedSection>

    <PrintedDivider style="dashed" />
  {/each}
</div>
