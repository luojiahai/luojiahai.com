<script lang="ts">
  import { page } from "$app/state";
  import { getDictionary, type Language } from "$lib/dictionaries";
  import PrintedDivider from "$lib/components/PrintedDivider.svelte";
  import PrintedLabel from "$lib/components/PrintedLabel.svelte";
  import PrintedPageTitle from "$lib/components/PrintedPageTitle.svelte";
  import PrintedSection from "$lib/components/PrintedSection.svelte";
  import Seo from "$lib/components/Seo.svelte";

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
    <p class="font-serif text-xs text-printer-ink-light dark:text-printer-ink-dark/50">
      {dictionary.use.intro}
    </p>
  </PrintedSection>

  <PrintedDivider style="solid" />

  {#each dictionary.use.groups as group, groupIndex (group.label)}
    <PrintedSection label={group.label} labelIcon="tag">
      <div class="flex flex-col">
        {#each group.items as item, index (item.label)}
          <div>
            <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5">
              <div
                class="font-mono text-[10px] uppercase tracking-[0.2em] text-printer-ink-light dark:text-printer-ink-dark/45"
              >
                {item.label}
              </div>
              <div
                class="font-mono text-xs text-printer-ink dark:text-printer-ink-dark text-right"
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

    {#if groupIndex < dictionary.use.groups.length - 1}
      <PrintedDivider style="dashed" />
    {/if}
  {/each}

  <!-- Footer stamp -->
  <div
    class="mt-8 pt-4 border-t border-dotted border-printer-ink/10 dark:border-printer-ink-dark/10"
  >
    <div class="flex items-center justify-end">
      <PrintedLabel variant="muted">use</PrintedLabel>
    </div>
  </div>
</div>
