<script lang="ts">
  import { getDictionary } from "$lib/dictionaries";
  import ScreenSection from "$lib/components/ScreenSection.svelte";
  import ScreenTitle from "$lib/components/ScreenTitle.svelte";
  import Seo from "$lib/components/Seo.svelte";

  let { data } = $props();

  let lang = $derived(data.lang);
  let dictionary = $derived(getDictionary(lang));
</script>

<Seo
  {lang}
  title="{dictionary.labels.use} - {dictionary.meta.websiteName}"
  description={dictionary.labels.useSubtitle}
  path={dictionary.urls.use}
/>

<ScreenTitle subtitle={dictionary.labels.useSubtitle}>
  {dictionary.labels.use}
</ScreenTitle>

{#each data.groups as group (group.slug)}
  <ScreenSection label={group.label}>
    {#each group.items as item (item.value)}
      <div class="flex items-baseline gap-2.5 py-1.5">
        <span class="flex-none text-[13px] leading-[1.4] text-ecam-white">
          {item.label}
        </span>
        <span
          class="min-w-3.5 flex-1 -translate-y-1 border-b-2 border-dotted border-white/30"
        ></span>
        <span class="min-w-0 text-right font-mono text-sm leading-[1.4] text-ecam-green">
          {item.value}
        </span>
      </div>
    {/each}
  </ScreenSection>
{/each}
