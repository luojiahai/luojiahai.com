<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    label,
    action,
    children,
  }: {
    label: string;
    action?: { href: string; label: string };
    children: Snippet;
  } = $props();
</script>

<section>
  <div class="mt-[26px] mb-3 flex items-baseline justify-between gap-3">
    <h2
      class="border-b-2 border-ecam-white pb-px text-sm font-bold uppercase leading-[1.2] tracking-[0.1em] text-ecam-white"
    >
      {label}
    </h2>
    {#if action}
      <a class="act" href={action.href}>{action.label} ›</a>
    {/if}
  </div>
  {@render children()}
</section>
