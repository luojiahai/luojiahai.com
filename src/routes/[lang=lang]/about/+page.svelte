<script lang="ts">
  import { getDictionary } from "$lib/dictionaries";
  import PostContent from "$lib/components/PostContent.svelte";
  import PrintedDivider from "$lib/components/PrintedDivider.svelte";
  import PrintedPageTitle from "$lib/components/PrintedPageTitle.svelte";
  import PrintedSection from "$lib/components/PrintedSection.svelte";
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

<div>
  <!-- Header -->
  <PrintedSection>
    <PrintedPageTitle icon="user">{about.title}</PrintedPageTitle>
    {#if about.description}
      <p class="page-subtitle">
        {about.description}
      </p>
    {/if}
  </PrintedSection>

  <PrintedDivider style="solid" />

  <!-- About content -->
  <PostContent html={about.content} />

  <PrintedDivider style="dashed" />

  <!-- Footer -->
  <div
    class="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/30 tracking-wider uppercase text-center py-4"
  >
    {lang === "zh" ? "就酱～" : "That's about it~"}
  </div>
</div>
