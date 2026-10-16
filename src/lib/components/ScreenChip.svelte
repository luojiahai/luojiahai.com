<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    href,
    count,
    children,
  }: {
    href: string;
    count?: number;
    children: Snippet;
  } = $props();
</script>

<a class="chip" {href}>
  {@render children()}
  {#if count !== undefined}
    <span class="text-ecam-green">{count}</span>
  {/if}
</a>
