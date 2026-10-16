<script lang="ts">
  import { getDictionary } from "$lib/dictionaries";
  import PostList from "$lib/components/PostList.svelte";
  import ScreenTitle from "$lib/components/ScreenTitle.svelte";
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

<ScreenTitle subtitle={category.description?.[lang]}>
  {category.name[lang]}
</ScreenTitle>
<div
  class="mt-3.5 flex flex-wrap items-center gap-x-3.5 gap-y-2 font-mono text-[13px]"
>
  <span class="text-ecam-green">{dictionary.labels.entries(data.posts.length)}</span>
  <a class="act" href={dictionary.urls.posts}>{dictionary.labels.allPosts}</a>
</div>

<div class="mt-[18px]">
  <PostList posts={data.posts} {lang} />
</div>
