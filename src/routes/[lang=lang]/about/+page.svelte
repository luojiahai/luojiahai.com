<script lang="ts">
  import { getDictionary } from "$lib/dictionaries";
  import PostContent from "$lib/components/PostContent.svelte";
  import ScreenTitle from "$lib/components/ScreenTitle.svelte";
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

<ScreenTitle subtitle={about.description}>{about.title}</ScreenTitle>

<PostContent html={about.content} />

<p class="mt-1.5 font-mono text-sm text-ecam-green">
  {dictionary.labels.aboutSignOff}
</p>
