<script lang="ts">
  import { getDictionary } from "$lib/dictionaries";
  import { generateWebSiteJsonLd } from "$lib/json-ld";
  import { SITE_URL } from "$lib/site-config";
  import { socialCardIcons } from "$lib/social";
  import Icon from "$lib/components/Icon.svelte";
  import Card from "$lib/components/Card.svelte";
  import PostList from "$lib/components/PostList.svelte";
  import ProjectList from "$lib/components/ProjectList.svelte";
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

<div class="grid gap-4 lg:grid-cols-2">
  <Card title={dictionary.labels.profile}>
    <div class="px-4 pb-5 pt-4">
      <h1 class="text-[2rem] font-bold leading-[1.05] sm:text-[2.25rem]">
        {dictionary.meta.name}
      </h1>
      <p class="mt-2 text-base text-ink-soft">{dictionary.meta.motto}</p>

      <!-- Contact buttons -->
      <div class="mt-5 flex flex-wrap gap-2">
        {#each dictionary.contacts as contact (contact.link)}
          <SocialHoverCard
            kind={contact.kind}
            href={contact.link}
            {lang}
            {dictionary}
            align="left"
            side="bottom"
            class="btn"
          >
            <Icon name={socialCardIcons[contact.kind]} class="h-3.5 w-3.5" />
            {contact.label}
          </SocialHoverCard>
        {/each}
      </div>
    </div>
  </Card>

  <Card title={dictionary.labels.projects}>
    <ProjectList projects={data.projects} />
    {#snippet action()}
      <a href={dictionary.urls.projects} class="btn btn-accent">
        {dictionary.labels.viewAllProjects}
      </a>
    {/snippet}
  </Card>

  <Card title={dictionary.labels.posts} class="lg:col-span-2">
    <PostList posts={data.latestPosts} {lang} compact />
    {#snippet action()}
      <a href={dictionary.urls.posts} class="btn btn-accent">
        {dictionary.labels.viewAllPosts}
      </a>
    {/snippet}
  </Card>
</div>
