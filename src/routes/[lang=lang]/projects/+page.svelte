<script lang="ts">
  import { getDictionary } from "$lib/dictionaries";
  import PageHeader from "$lib/components/PageHeader.svelte";
  import ProjectMap from "$lib/components/ProjectMap.svelte";
  import Seo from "$lib/components/Seo.svelte";

  let { data } = $props();

  let lang = $derived(data.lang);
  let dictionary = $derived(getDictionary(lang));
</script>

<Seo
  {lang}
  title="{dictionary.labels.projects} - {dictionary.meta.websiteName}"
  description={dictionary.labels.projectsSubtitle}
  path={dictionary.urls.projects}
/>

<PageHeader
  title={dictionary.labels.projects}
  subtitle={dictionary.labels.projectsSubtitle}
/>

<ProjectMap projects={data.projects} {dictionary} />
