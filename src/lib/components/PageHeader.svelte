<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    title,
    subtitle,
    children,
  }: {
    title: string;
    subtitle?: string;
    /** Extra lines under the subtitle (counts, filters). */
    children?: Snippet;
  } = $props();
</script>

<header class="mb-6">
  <h1 class="text-[1.75rem] font-bold leading-tight sm:text-[2rem]">{title}</h1>
  {#if subtitle}
    <p class="page-subtitle">{subtitle}</p>
  {/if}
  {@render children?.()}
</header>
