<script lang="ts">
  import type { Snippet } from "svelte";
  import type { IconName } from "$lib/icons";
  import Icon from "./Icon.svelte";

  let {
    variant = "default",
    icon,
    class: className = "",
    children,
  }: {
    variant?: "default" | "accent" | "muted";
    icon?: IconName;
    class?: string;
    children: Snippet;
  } = $props();

  const variantClasses = {
    default:
      "border-printer-ink/10 dark:border-printer-ink-dark/10 text-printer-ink/70 dark:text-printer-ink-dark/70",
    accent:
      "border-printer-accent/30 dark:border-printer-accent-dark/30 text-printer-accent dark:text-printer-accent-dark bg-printer-accent/5",
    muted:
      "border-printer-ink/5 dark:border-printer-ink-dark/5 text-printer-ink-light dark:text-printer-ink-dark/40",
  };
</script>

<span
  class={[
    "inline-flex items-center gap-1 leading-none font-mono text-[10px] tracking-widest uppercase px-2 py-[3px] rounded-sm border",
    variantClasses[variant],
    className,
  ]}
>
  {#if icon}
    <Icon name={icon} class="w-2.5 h-2.5 shrink-0" />
  {/if}
  <span class="inline-flex items-center leading-none translate-y-[0.5px]">
    {@render children()}
  </span>
</span>
