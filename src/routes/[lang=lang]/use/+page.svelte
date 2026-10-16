<script lang="ts">
  import { getDictionary } from "$lib/dictionaries";
  import Card from "$lib/components/Card.svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";
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

<PageHeader title={dictionary.labels.use} subtitle={dictionary.labels.useSubtitle} />

<!-- One panel per group; the group names carry the labels here. -->
<div class="grid gap-4 lg:grid-cols-2">
  {#each data.groups as group (group.slug)}
    <Card title={group.label}>
      <dl class="m-0">
        {#each group.items as item (item.value)}
          <div
            class="flex flex-col gap-y-1 border-b border-line px-4 py-2.5 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-4"
          >
            <dt class="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
              {item.label}
            </dt>
            <dd class="m-0 text-sm sm:text-right">{item.value}</dd>
          </div>
        {/each}
      </dl>
    </Card>
  {/each}
</div>
