<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    kind = "page",
    subtitle,
    children,
  }: {
    /** A page title reads as an ECAM page name; a post keeps its own case. */
    kind?: "page" | "post";
    subtitle?: string;
    children: Snippet;
  } = $props();
</script>

<h1
  class={[
    "inline-block border-b-2 border-ecam-white pb-0.5 font-bold leading-[1.25] tracking-[0.05em] text-ecam-white",
    kind === "page"
      ? "text-[22px] uppercase max-sm:text-[19px]"
      : "text-[26px] max-sm:text-[22px]",
  ]}
>
  {@render children()}
</h1>
{#if subtitle}
  <p class="mt-2 font-read text-[15px] leading-normal text-ecam-dim">
    {subtitle}
  </p>
{/if}
