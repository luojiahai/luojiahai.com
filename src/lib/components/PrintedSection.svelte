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

<section class={["mb-12", className]}>
  {#if label}
    <div class="mb-5 flex items-center gap-3">
      <span
        class="h-1.5 w-1.5 shrink-0 bg-printer-accent dark:bg-printer-accent-dark"
        aria-hidden="true"
      ></span>
      <div
        class="inline-flex items-center gap-1.5 align-middle font-mono text-[10px] font-medium leading-none tracking-[0.18em] text-printer-ink/70 dark:text-printer-ink-dark/65"
      >
        {#if labelIcon}
          <Icon name={labelIcon} class="h-3 w-3 shrink-0" />
        {/if}
        <span class="inline-flex translate-y-[0.5px] items-center leading-none">
          {label}
        </span>
      </div>
      <div
        class="h-px flex-1 bg-printer-ink/8 dark:bg-printer-ink-dark/8"
      ></div>
    </div>
  {/if}
  {@render children()}
</section>
