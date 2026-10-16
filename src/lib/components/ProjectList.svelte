<script lang="ts">
  import type { ProjectItem } from "$lib/content";
  import ScreenEmpty from "./ScreenEmpty.svelte";

  let { projects }: { projects: ProjectItem[] } = $props();
</script>

<div class="flex flex-col">
  {#each projects as project (project.slug)}
    <a href={project.link} target="_blank" rel="noopener" class="row proj">
      {#if project.image}
        <img
          class="icon"
          src={project.image}
          alt=""
          width="44"
          height="44"
          loading="lazy"
        />
      {:else}
        <span
          class="icon grid place-items-center font-mono text-base font-bold text-ecam-white"
        >
          {project.name[0]}
        </span>
      {/if}
      <span class="t">{project.name}</span>
      <span class="arrow" aria-hidden="true">›</span>
      <span class="d line-clamp-1">{project.description}</span>
    </a>
  {:else}
    <ScreenEmpty />
  {/each}
</div>
