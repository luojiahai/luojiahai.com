<script lang="ts">
  import { getDictionary } from "$lib/dictionaries";
  import FlyList from "$lib/components/FlyList.svelte";
  import PrintedDivider from "$lib/components/PrintedDivider.svelte";
  import PrintedPageTitle from "$lib/components/PrintedPageTitle.svelte";
  import PrintedSection from "$lib/components/PrintedSection.svelte";
  import ProjectList from "$lib/components/ProjectList.svelte";
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

<div>
  <!-- Header -->
  <PrintedSection>
    <PrintedPageTitle icon="code">
      {dictionary.labels.projects}
    </PrintedPageTitle>
    <p class="page-subtitle">
      {dictionary.labels.projectsSubtitle}
    </p>
  </PrintedSection>

  <PrintedDivider style="solid" />

  <!-- Projects. The page title already names them, so no section label. -->
  <PrintedSection>
    <ProjectList projects={data.projects} />
  </PrintedSection>

  <PrintedDivider style="dashed" />

  <!-- Sim companions - links out of the printer shell -->
  <PrintedSection label={dictionary.labels.fly} labelIcon="plane">
    <FlyList entries={data.fly} />
  </PrintedSection>

  <PrintedDivider style="dashed" />
</div>
