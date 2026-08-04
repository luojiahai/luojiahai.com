<script lang="ts">
  import type { ProjectItem } from "$lib/content";
  import { getDictionary, type Language } from "$lib/dictionaries";
  import PrintedEmpty from "./PrintedEmpty.svelte";

  let {
    projects,
    lang,
  }: {
    projects: ProjectItem[];
    lang: Language;
  } = $props();

  let dictionary = $derived(getDictionary(lang));
</script>

<div class="flex flex-col">
  {#each projects as project (project.slug)}
    <a
      href={project.link}
      target="_blank"
      rel="noopener"
      class="printed-row group -mx-3 flex items-center gap-3 px-3 py-3 transition-colors hover:bg-printer-ink/[0.035] focus-visible:bg-printer-ink/[0.035] focus-visible:outline-none dark:hover:bg-printer-ink-dark/[0.035] dark:focus-visible:bg-printer-ink-dark/[0.035]"
    >
      {#if project.image}
        <img
          class="h-10 w-10 shrink-0 border border-printer-ink/10 dark:border-printer-ink-dark/10"
          src={project.image}
          alt={dictionary.labels.icon(project.name)}
          width="40"
          height="40"
          loading="lazy"
        />
      {:else}
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center bg-printer-accent/10 font-mono text-base font-semibold text-printer-accent dark:bg-printer-accent-dark/10 dark:text-printer-accent-dark"
        >
          {project.name[0]}
        </div>
      {/if}
      <div class="min-w-0 flex-1">
        <div
          class="font-serif text-lg font-medium leading-[1.15] tracking-[-0.015em] text-printer-ink transition-colors group-hover:text-printer-accent group-focus-visible:text-printer-accent dark:text-printer-ink-dark dark:group-hover:text-printer-accent-dark dark:group-focus-visible:text-printer-accent-dark sm:text-xl"
        >
          {project.name}
        </div>
        <div
          class="mt-1 line-clamp-1 max-w-[62ch] font-serif text-[13px] leading-relaxed text-printer-ink-light dark:text-printer-ink-dark/60"
        >
          {project.description}
        </div>
      </div>
      <span
        class="shrink-0 font-mono text-sm text-printer-ink-light transition-transform duration-200 group-hover:translate-x-1 group-hover:text-printer-accent dark:text-printer-ink-dark/30 dark:group-hover:text-printer-accent-dark"
      >
        →
      </span>
    </a>
  {:else}
    <PrintedEmpty />
  {/each}
</div>
