<script lang="ts">
  import type { Snippet } from "svelte";
  import type { IconName } from "$lib/icons";
  import Icon from "./Icon.svelte";

  let {
    label,
    labelIcon,
    class: className = "",
    children,
  }: {
    label?: string;
    labelIcon?: IconName;
    class?: string;
    children: Snippet;
  } = $props();
</script>

<section class={["mb-8", className]}>
  {#if label}
    <div class="mb-3 flex items-center gap-2">
      <div
        class="inline-flex items-center gap-1.5 bg-printer-ink/5 px-2 py-[3px] align-middle font-mono text-[10px] uppercase leading-none tracking-[0.3em] text-printer-ink-light dark:bg-printer-ink-dark/5 dark:text-printer-ink-dark/50"
      >
        {#if labelIcon}
          <Icon name={labelIcon} class="h-2.5 w-2.5 shrink-0" />
        {/if}
        <span class="inline-flex translate-y-[0.5px] items-center leading-none">
          {label}
        </span>
      </div>
      <div class="h-px flex-1 bg-printer-ink/5 dark:bg-printer-ink-dark/5"></div>
    </div>
  {/if}
  {@render children()}
</section>
