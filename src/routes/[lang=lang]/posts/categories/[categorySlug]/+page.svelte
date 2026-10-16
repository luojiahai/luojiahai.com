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
  let category = $derived(data.category);
</script>

<Seo
  {lang}
  title="{category.name[lang]} - {dictionary.meta.websiteName}"
  description={category.description?.[lang]}
  path={category.permalink[lang]}
/>

<PageHeader
  title={category.name[lang]}
  subtitle={category.description?.[lang]}
/>

<div class="flex flex-col gap-4">
  <CategoryFilter
    categories={data.categories}
    active={category.slug}
    {lang}
    {dictionary}
  />
  <p class="font-mono text-xs uppercase tracking-[0.1em] text-ink-soft">
    {dictionary.labels.filterSummary(category.name[lang], data.posts.length)}
  </p>
  <Card>
    <PostList posts={data.posts} {lang} />
  </Card>
</div>
