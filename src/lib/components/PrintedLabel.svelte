<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Language } from "$lib/dictionaries";
  import type { IconName } from "$lib/icons";
  import Icon from "./Icon.svelte";

  let {
    variant = "default",
    icon,
    lang,
    children,
  }: {
    variant?: "default" | "accent" | "muted";
    icon?: IconName;
    lang?: Language;
    children: Snippet;
  } = $props();

  const variantClasses = {
    default:
      "border-printer-ink/10 dark:border-printer-ink-dark/10 text-printer-ink-light dark:text-printer-ink-light-dark",
    accent:
      "border-printer-accent/30 dark:border-printer-accent-dark/30 text-printer-accent dark:text-printer-accent-dark bg-printer-accent/5 dark:bg-printer-accent-dark/5",
    muted:
      "border-printer-ink/5 dark:border-printer-ink-dark/5 text-printer-ink-light dark:text-printer-ink-light-dark",
  };
</script>

<span
  {lang}
  class={[
    "inline-flex items-center gap-1 leading-none font-mono text-label uppercase px-2 py-[3px] rounded-sm border",
    variantClasses[variant],
  ]}
>
  {#if icon}
    <Icon name={icon} class="w-2.5 h-2.5 shrink-0" />
  {/if}
  <span class="inline-flex items-center leading-none translate-y-[0.5px]">
    {@render children()}
  </span>
</span>
