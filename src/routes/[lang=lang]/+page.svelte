<script lang="ts">
  import { onMount } from "svelte";
  import { getDictionary } from "$lib/dictionaries";
  import type { IconName } from "$lib/icons";
  import { generateWebSiteJsonLd } from "$lib/json-ld";
  import type { SocialCardKind } from "$lib/social";
  import Icon from "$lib/components/Icon.svelte";
  import PostList from "$lib/components/PostList.svelte";
  import PrintedDivider from "$lib/components/PrintedDivider.svelte";
  import PrintedLabel from "$lib/components/PrintedLabel.svelte";
  import PrintedSection from "$lib/components/PrintedSection.svelte";
  import ProjectList from "$lib/components/ProjectList.svelte";
  import Seo from "$lib/components/Seo.svelte";
  import SocialHoverCard from "$lib/components/SocialHoverCard.svelte";

  let { data } = $props();

  let lang = $derived(data.lang);
  let dictionary = $derived(getDictionary(lang));

  // Prerendered pages show the first motto; rotate randomly per visit.
  let mottoIndex = $state(0);
  onMount(() => {
    mottoIndex = Math.floor(Math.random() * dictionary.meta.mottos.length);
  });
  let motto = $derived(dictionary.meta.mottos[mottoIndex] ?? dictionary.meta.motto);

  let works = $derived(dictionary.works.slice(0, 3));

  const printedOn = new Date().toISOString().split("T")[0];

  // Contacts whose icon maps to a hover-card kind get a SocialHoverCard;
  // the rest render as plain links.
  const cardKinds: Partial<Record<IconName, SocialCardKind>> = {
    x: "x",
    github: "github",
    mail: "email",
    send: "telegram",
    linkedin: "linkedin",
    instagram: "instagram",
  };
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
      url: `${dictionary.meta.baseUrl}${dictionary.urls.home}`,
      description: dictionary.meta.motto,
    }),
  ]}
/>

<div>
  <!-- Profile masthead -->
  <PrintedSection>
    <h1
      class="max-w-[11ch] font-serif text-[2rem] font-bold leading-[0.96] tracking-[-0.04em] text-printer-ink dark:text-printer-ink-dark"
    >
      {dictionary.meta.name}
    </h1>
    <p
      class="mt-3 max-w-[42ch] font-serif text-base italic leading-relaxed text-printer-ink-light dark:text-printer-ink-dark/60 sm:text-lg"
    >
      {motto}
    </p>

    <!-- Contact strip -->
    <div class="mt-4 flex flex-wrap gap-2">
      {#each dictionary.contacts as contact (contact.link)}
        {@const kind = cardKinds[contact.icon]}
        {@const linkClass =
          "inline-flex items-center gap-1.5 rounded-sm border border-printer-ink/8 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-printer-ink-light transition-colors hover:border-printer-accent/20 hover:text-printer-accent dark:border-printer-ink-dark/8 dark:text-printer-ink-dark/50 dark:hover:border-printer-accent-dark/20 dark:hover:text-printer-accent-dark"}
        {#if kind}
          <SocialHoverCard
            {kind}
            href={contact.link}
            {lang}
            {dictionary}
            align="left"
            side="bottom"
            class={linkClass}
          >
            <Icon name={contact.icon} class="h-3 w-3" />
            {contact.label}
          </SocialHoverCard>
        {:else}
          <a
            href={contact.link}
            target="_blank"
            rel="noopener"
            class={linkClass}
          >
            <Icon name={contact.icon} class="h-3 w-3" />
            {contact.label}
          </a>
        {/if}
      {/each}
    </div>
  </PrintedSection>

  <PrintedDivider style="dotted" />

  <!-- Projects section -->
  <PrintedSection label={dictionary.labels.projects} labelIcon="code">
    <ProjectList {works} {lang} />
    <a
      href={dictionary.urls.tech}
      class="mt-3 inline-flex items-center gap-1 font-mono text-[11px] tracking-wider text-printer-accent hover:underline dark:text-printer-accent-dark"
    >
      VIEW ALL →
    </a>
  </PrintedSection>

  <PrintedDivider style="dashed" />

  <!-- Latest Life Posts -->
  <PrintedSection label={dictionary.labels.latestLife} labelIcon="draft">
    <PostList posts={data.latestLife} {lang} compact />
    <a
      href={dictionary.urls.life}
      class="mt-3 inline-flex items-center gap-1 font-mono text-[11px] tracking-wider text-printer-accent hover:underline dark:text-printer-accent-dark"
    >
      VIEW ALL →
    </a>
  </PrintedSection>

  <PrintedDivider style="dashed" />

  <!-- Latest Tech Posts -->
  <PrintedSection label={dictionary.labels.latestTech} labelIcon="window">
    <PostList posts={data.latestTech} {lang} compact />
    <a
      href={dictionary.urls.tech}
      class="mt-3 inline-flex items-center gap-1 font-mono text-[11px] tracking-wider text-printer-accent hover:underline dark:text-printer-accent-dark"
    >
      VIEW ALL →
    </a>
  </PrintedSection>

  <!-- Footer stamp -->
  <div
    class="mt-5 border-t border-dotted border-printer-ink/10 pt-4 dark:border-printer-ink-dark/10"
  >
    <div class="flex items-center justify-between">
      <div
        class="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/30 tracking-wider uppercase"
      >
        {dictionary.labels.printedOn}
        {printedOn}
      </div>
      <PrintedLabel variant="muted">luojiahai.com</PrintedLabel>
    </div>
  </div>
</div>
