<script lang="ts">
  import { onMount } from "svelte";
  import { getDictionary, type Language } from "$lib/dictionaries";
  import type { IconName } from "$lib/icons";
  import { generateWebSiteJsonLd } from "$lib/json-ld";
  import type { SocialCardKind } from "$lib/social";
  import Icon from "$lib/components/Icon.svelte";
  import PostList from "$lib/components/PostList.svelte";
  import PrintedDivider from "$lib/components/PrintedDivider.svelte";
  import PrintedLabel from "$lib/components/PrintedLabel.svelte";
  import PrintedSection from "$lib/components/PrintedSection.svelte";
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

  let primaryWorks = $derived(
    dictionary.works.filter((work) => work.primary).slice(0, 4),
  );

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
  <PrintedSection class="mb-14">
    <div class="grid gap-8 sm:grid-cols-[minmax(0,1fr)_9rem] sm:gap-10">
      <div>
        <div
          class="mb-4 flex items-center gap-2 font-mono text-[9px] font-medium tracking-[0.18em] text-printer-accent dark:text-printer-accent-dark"
        >
          <span class="h-px w-5 bg-current"></span>
          PROFILE / 001
        </div>
        <h1
          class="max-w-[11ch] font-serif text-[2.5rem] font-semibold leading-[0.94] tracking-[-0.045em] text-printer-ink dark:text-printer-ink-dark sm:text-[3.375rem]"
        >
          {dictionary.meta.name}
        </h1>
        <p
          class="mt-5 max-w-[42ch] font-serif text-base italic leading-relaxed text-printer-ink-light dark:text-printer-ink-dark/60 sm:text-lg"
        >
          {motto}
        </p>
      </div>
      <dl
        class="grid grid-cols-3 gap-3 border-t border-dashed border-printer-ink/10 pt-4 font-mono text-[8px] tracking-[0.12em] text-printer-ink-light tabular-nums dark:border-printer-ink-dark/10 dark:text-printer-ink-dark/40 sm:grid-cols-1 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-1"
      >
        <div>
          <dt class="mb-1 text-printer-ink/35 dark:text-printer-ink-dark/25">
            ISSUE
          </dt>
          <dd>№ {printedOn.replaceAll("-", "")}</dd>
        </div>
        <div>
          <dt class="mb-1 text-printer-ink/35 dark:text-printer-ink-dark/25">
            LOCALE
          </dt>
          <dd>{lang.toUpperCase()} / MEL</dd>
        </div>
        <div>
          <dt class="mb-1 text-printer-ink/35 dark:text-printer-ink-dark/25">
            STATUS
          </dt>
          <dd class="text-printer-accent dark:text-printer-accent-dark">
            ONLINE
          </dd>
        </div>
      </dl>
    </div>

    <!-- Contact strip -->
    <div class="mt-9 flex flex-wrap gap-2">
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

  <!-- Works section -->
  <PrintedSection label={dictionary.labels.works} labelIcon="apps">
    <div class="grid grid-cols-1">
      {#each primaryWorks as work, index (work.name)}
        <a
          href={work.link}
          target="_blank"
          rel="noopener"
          class="printed-row group -mx-3 grid grid-cols-[2rem_3rem_1fr_auto] items-center gap-3 px-3 py-4 transition-colors hover:bg-printer-ink/[0.035] focus-visible:bg-printer-ink/[0.035] focus-visible:outline-none dark:hover:bg-printer-ink-dark/[0.035] dark:focus-visible:bg-printer-ink-dark/[0.035]"
        >
          <span
            class="font-mono text-[9px] text-printer-ink/25 tabular-nums dark:text-printer-ink-dark/20"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          {#if work.image}
            <img
              class="h-12 w-12 border border-printer-ink/10 dark:border-printer-ink-dark/10"
              src={work.image}
              alt={dictionary.labels.icon(work.name)}
              width="48"
              height="48"
              loading="lazy"
            />
          {:else}
            <div
              class="flex h-12 w-12 items-center justify-center bg-printer-accent/10 font-mono text-lg font-semibold text-printer-accent dark:bg-printer-accent-dark/10 dark:text-printer-accent-dark"
            >
              {work.name[0]}
            </div>
          {/if}
          <div class="min-w-0 flex-1">
            <div
              class="font-serif text-xl font-medium tracking-[-0.02em] text-printer-ink transition-colors group-hover:text-printer-accent dark:text-printer-ink-dark dark:group-hover:text-printer-accent-dark"
            >
              {work.name}
            </div>
            <div
              class="mt-0.5 line-clamp-1 font-serif text-[13px] text-printer-ink-light dark:text-printer-ink-dark/60"
            >
              {work.summary}
            </div>
          </div>
          <span
            class="shrink-0 font-mono text-sm text-printer-ink-light transition-transform duration-200 group-hover:translate-x-1 group-hover:text-printer-accent dark:text-printer-ink-dark/30 dark:group-hover:text-printer-accent-dark"
          >
            →
          </span>
        </a>
      {/each}
    </div>
    <a
      href={dictionary.urls.works}
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
      href={dictionary.urls.posts}
      class="mt-3 inline-flex items-center gap-1 font-mono text-[11px] tracking-wider text-printer-accent hover:underline dark:text-printer-accent-dark"
    >
      VIEW ALL →
    </a>
  </PrintedSection>

  <!-- Footer stamp -->
  <div
    class="mt-8 pt-4 border-t border-dotted border-printer-ink/10 dark:border-printer-ink-dark/10"
  >
    <div class="flex items-center justify-between">
      <div
        class="font-mono text-[9px] text-printer-ink-light dark:text-printer-ink-dark/30 tracking-wider uppercase"
      >
        {dictionary.labels.printedOn}
        {printedOn}
      </div>
      <PrintedLabel variant="muted">luojiahai.com</PrintedLabel>
    </div>
  </div>
</div>
