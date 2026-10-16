<script lang="ts">
  import { getDictionary } from "$lib/dictionaries";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import PostContent from "$lib/components/PostContent.svelte";
  import Seo from "$lib/components/Seo.svelte";

  let { data } = $props();

  let lang = $derived(data.lang);
  let about = $derived(data.about);
  let dictionary = $derived(getDictionary(lang));
</script>

<Seo
  {lang}
  title="{about.title} - {dictionary.meta.websiteName}"
  description={about.description ?? about.title}
  path={dictionary.urls.about}
/>

<PageHeader title={about.title} subtitle={about.description} />

<div class="mb-7 h-0.5 bg-line" aria-hidden="true"></div>

<PostContent html={about.content} />

<p
  class="mt-10 border-t border-line pt-5 text-center font-mono text-xs uppercase tracking-[0.12em] text-ink-soft"
>
  {dictionary.labels.aboutSignOff}
</p>
