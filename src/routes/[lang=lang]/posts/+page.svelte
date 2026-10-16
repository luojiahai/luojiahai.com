<script lang="ts">
  import { getDictionary } from "$lib/dictionaries";
  import Card from "$lib/components/Card.svelte";
  import CategoryFilter from "$lib/components/CategoryFilter.svelte";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import PostList from "$lib/components/PostList.svelte";
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

<PageHeader
  title={dictionary.labels.posts}
  subtitle={dictionary.labels.postsSubtitle}
/>

<div class="flex flex-col gap-4">
  <CategoryFilter categories={data.categories} active={null} {lang} {dictionary} />
  <p class="font-mono text-xs uppercase tracking-[0.1em] text-ink-soft">
    {dictionary.labels.filterSummary(
      dictionary.labels.allCategories,
      data.posts.length,
    )}
  </p>
  <Card>
    <PostList posts={data.posts} {lang} categories={data.categories} />
  </Card>
</div>
