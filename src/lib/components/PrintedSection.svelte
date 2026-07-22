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
    <div class="flex items-center gap-2 mb-3">
      <div
        class="inline-flex items-center gap-1.5 leading-none align-middle font-mono text-[10px] tracking-[0.3em] uppercase text-printer-ink-light dark:text-printer-ink-dark/50 bg-printer-ink/5 dark:bg-printer-ink-dark/5 px-2 py-[3px] rounded-sm"
      >
        {#if labelIcon}
          <Icon name={labelIcon} class="w-2.5 h-2.5 shrink-0" />
        {/if}
        <span
          class="inline-flex items-center leading-none translate-y-[0.5px]"
        >
          {label}
        </span>
      </div>
      <div class="flex-1 h-px bg-printer-ink/5 dark:bg-printer-ink-dark/5"></div>
    </div>
  {/if}
  {@render children()}
</section>
