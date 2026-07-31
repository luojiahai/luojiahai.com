<script lang="ts">
  import { getDictionary } from "$lib/dictionaries";
  import PostList from "$lib/components/PostList.svelte";
  import PrintedDivider from "$lib/components/PrintedDivider.svelte";
  import PrintedLabel from "$lib/components/PrintedLabel.svelte";
  import PrintedPageTitle from "$lib/components/PrintedPageTitle.svelte";
  import PrintedEmpty from "$lib/components/PrintedEmpty.svelte";
  import PrintedSection from "$lib/components/PrintedSection.svelte";
  import ProjectList from "$lib/components/ProjectList.svelte";
  import Seo from "$lib/components/Seo.svelte";

  let { data } = $props();

  let lang = $derived(data.lang);
  let section = $derived(data.section);
  let dictionary = $derived(getDictionary(lang));
  let sectionLabel = $derived(dictionary.labels[section]);
  let sectionSubtitle = $derived(dictionary.labels.sectionSubtitle[section]);
</script>

<Seo
  {lang}
  title="{sectionLabel} - {dictionary.meta.websiteName}"
  description={sectionSubtitle}
  path={dictionary.urls[section]}
/>

<div>
  <!-- Header -->
  <PrintedSection>
    <PrintedPageTitle icon={section === "life" ? "draft" : "computer"}>
      {sectionLabel}
    </PrintedPageTitle>
    <p class="page-subtitle">
      {sectionSubtitle}
    </p>
  </PrintedSection>

  {#if section === "life"}
    <!-- Activity sections - links to subpages -->
    <PrintedSection label={dictionary.labels.activity} labelIcon="pulse">
      <div class="flex flex-wrap gap-2">
        <a href="{dictionary.urls.life}/reading">
          <PrintedLabel variant="default" icon="book">
            {dictionary.labels.reading}
          </PrintedLabel>
        </a>
        <a href="{dictionary.urls.life}/watching">
          <PrintedLabel variant="default" icon="film">
            {dictionary.labels.watching}
          </PrintedLabel>
        </a>
        <a href="{dictionary.urls.life}/listening">
          <PrintedLabel variant="default" icon="music">
            {dictionary.labels.listening}
          </PrintedLabel>
        </a>
      </div>
    </PrintedSection>
  {:else}
    <!-- Projects -->
    <PrintedSection label={dictionary.labels.projects} labelIcon="code">
      <ProjectList works={dictionary.works} {lang} />
    </PrintedSection>
  {/if}

  <PrintedDivider style="dashed" />

  <!-- Posts, with the section's categories above them -->
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
