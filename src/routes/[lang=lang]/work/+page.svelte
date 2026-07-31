<script lang="ts">
  import { page } from "$app/state";
  import { getDictionary, type Language } from "$lib/dictionaries";
  import PostList from "$lib/components/PostList.svelte";
  import PrintedDivider from "$lib/components/PrintedDivider.svelte";
  import PrintedEmpty from "$lib/components/PrintedEmpty.svelte";
  import PrintedLabel from "$lib/components/PrintedLabel.svelte";
  import PrintedPageTitle from "$lib/components/PrintedPageTitle.svelte";
  import PrintedSection from "$lib/components/PrintedSection.svelte";
  import ProjectList from "$lib/components/ProjectList.svelte";
  import Seo from "$lib/components/Seo.svelte";

  let { data } = $props();

  let lang = $derived(page.params.lang as Language);
  let dictionary = $derived(getDictionary(lang));
</script>

<Seo
  {lang}
  title="{dictionary.labels.work} - {dictionary.meta.websiteName}"
  description={dictionary.labels.workSubtitle}
  path={dictionary.urls.work}
/>

<div>
  <!-- Header -->
  <PrintedSection>
    <PrintedPageTitle icon="apps">{dictionary.labels.work}</PrintedPageTitle>
    <p class="page-subtitle">
      {dictionary.labels.workSubtitle}
    </p>
  </PrintedSection>

  <!-- Projects -->
  <PrintedSection label={dictionary.labels.projects} labelIcon="code">
    <ProjectList works={dictionary.works} {lang} />
  </PrintedSection>

  <PrintedDivider style="dashed" />

  <!-- Tech posts (merged from the former Tech page) -->
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
