<script lang="ts">
  import { getDictionary } from "$lib/dictionaries";
  import PostList from "$lib/components/PostList.svelte";
  import ScreenChip from "$lib/components/ScreenChip.svelte";
  import ScreenEmpty from "$lib/components/ScreenEmpty.svelte";
  import ScreenTitle from "$lib/components/ScreenTitle.svelte";
  import Seo from "$lib/components/Seo.svelte";

  let { data } = $props();

  let lang = $derived(data.lang);
  let dictionary = $derived(getDictionary(lang));
</script>

<Seo
  {lang}
  title="{dictionary.labels.posts} - {dictionary.meta.websiteName}"
  description={dictionary.labels.postsSubtitle}
  path={dictionary.urls.posts}
/>

<ScreenTitle subtitle={dictionary.labels.postsSubtitle}>
  {dictionary.labels.posts}
</ScreenTitle>

<div class="mt-[18px] flex flex-wrap gap-2">
  {#each data.categories as category (category.slug)}
    <ScreenChip href={category.permalink[lang]} count={category.count[lang]}>
      {category.name[lang]}
    </ScreenChip>
  {:else}
    <ScreenEmpty />
  {/each}
</div>

<div class="mt-[18px]">
  <PostList posts={data.posts} {lang} />
</div>
