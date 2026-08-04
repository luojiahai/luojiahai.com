<script lang="ts">
  import { getDictionary } from "$lib/dictionaries";
  import PostList from "$lib/components/PostList.svelte";
  import PrintedDivider from "$lib/components/PrintedDivider.svelte";
  import PrintedLabel from "$lib/components/PrintedLabel.svelte";
  import PrintedPageTitle from "$lib/components/PrintedPageTitle.svelte";
  import PrintedEmpty from "$lib/components/PrintedEmpty.svelte";
  import PrintedSection from "$lib/components/PrintedSection.svelte";
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

<div>
  <!-- Header -->
  <PrintedSection>
    <PrintedPageTitle icon="draft">
      {dictionary.labels.posts}
    </PrintedPageTitle>
    <p class="page-subtitle">
      {dictionary.labels.postsSubtitle}
    </p>
  </PrintedSection>

  <!-- Posts, with the categories above them -->
  <PrintedSection label={dictionary.labels.posts} labelIcon="window">
    <div class="mb-2 flex flex-wrap gap-1.5">
      {#each data.categories as category (category.slug)}
        <a href={category.permalink[lang]}>
          <PrintedLabel variant="default">
            {category.name[lang]}
            <span class="opacity-50">({category.count[lang]})</span>
          </PrintedLabel>
        </a>
      {:else}
        <PrintedEmpty />
      {/each}
    </div>

    <PostList posts={data.posts} {lang} />
  </PrintedSection>

  <PrintedDivider style="dashed" />
</div>
