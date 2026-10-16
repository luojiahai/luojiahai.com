<script lang="ts">
  import type { ProjectItem } from "$lib/content";
  import EmptyState from "./EmptyState.svelte";

  let { projects }: { projects: ProjectItem[] } = $props();
</script>

<div class="flex flex-col">
  {#each projects as project (project.slug)}
    <a
      href={project.link}
      target="_blank"
      rel="noopener"
      class="row-link flex items-center gap-3 border-b border-line px-4 py-3 last:border-b-0 focus-visible:outline-offset-[-2px]"
    >
      {#if project.image}
        <img
          class="h-10 w-10 shrink-0 rounded-[3px] border border-line"
          src={project.image}
          alt=""
          width="40"
          height="40"
          loading="lazy"
        />
      {/if}
      <div class="min-w-0 flex-1">
        <div class="row-title text-[15px] font-bold text-accent">
          {project.name}
        </div>
        <div class="mt-0.5 line-clamp-1 text-[13px] text-ink-soft">
          {project.description}
        </div>
      </div>
    </a>
  {:else}
    <EmptyState />
  {/each}
</div>
