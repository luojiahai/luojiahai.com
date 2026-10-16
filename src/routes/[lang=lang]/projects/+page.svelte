<script lang="ts">
  import { getDictionary } from "$lib/dictionaries";
  import ProjectList from "$lib/components/ProjectList.svelte";
  import ScreenTitle from "$lib/components/ScreenTitle.svelte";
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

<ScreenTitle subtitle={dictionary.labels.projectsSubtitle}>
  {dictionary.labels.projects}
</ScreenTitle>

<div class="mt-3.5">
  <ProjectList projects={data.projects} />
</div>
