<script lang="ts">
  import { getDictionary } from "$lib/dictionaries";
  import { generateWebSiteJsonLd } from "$lib/json-ld";
  import { SITE_URL } from "$lib/site-config";
  import PostList from "$lib/components/PostList.svelte";
  import ProjectList from "$lib/components/ProjectList.svelte";
  import ScreenSection from "$lib/components/ScreenSection.svelte";
  import Seo from "$lib/components/Seo.svelte";
  import SocialHoverCard from "$lib/components/SocialHoverCard.svelte";

  let { data } = $props();

  let lang = $derived(data.lang);
  let dictionary = $derived(getDictionary(lang));
</script>

<Seo
  {lang}
  title={dictionary.meta.websiteName}
  description={dictionary.meta.motto}
  path={dictionary.urls.home}
  feeds
  jsonLd={[
    generateWebSiteJsonLd({
      name: dictionary.meta.websiteName,
      alternateName: "luojiahai",
      url: `${SITE_URL}${dictionary.urls.home}`,
      description: dictionary.meta.motto,
    }),
  ]}
/>

<h1
  class="text-[32px] font-bold uppercase leading-[1.1] tracking-[0.04em] text-ecam-white max-sm:text-[25px]"
>
  {dictionary.meta.name}
</h1>
<p class="mt-2 font-mono text-base leading-[1.4] text-ecam-green">
  {dictionary.meta.motto}
</p>
<div class="mt-4 flex flex-wrap gap-2">
  {#each dictionary.contacts as contact (contact.link)}
    <SocialHoverCard
      kind={contact.kind}
      href={contact.link}
      {lang}
      {dictionary}
      align="left"
      side="bottom"
      class="chip"
    >
      {contact.label}
    </SocialHoverCard>
  {/each}
</div>

<ScreenSection
  label={dictionary.labels.projects}
  action={{ href: dictionary.urls.projects, label: dictionary.labels.viewAll }}
>
  <ProjectList projects={data.projects} />
</ScreenSection>

<ScreenSection
  label={dictionary.labels.recentPosts}
  action={{ href: dictionary.urls.posts, label: dictionary.labels.viewAll }}
>
  <PostList posts={data.latestPosts} {lang} compact />
</ScreenSection>
