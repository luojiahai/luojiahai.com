<script lang="ts">
  import type { Snippet } from "svelte";
  import type { IconName } from "$lib/icons";
  import Icon from "./Icon.svelte";

  let {
    icon,
    children,
  }: {
    icon: IconName;
    children: Snippet;
  } = $props();
</script>

<div class="relative mb-1">
  <Icon
    name={icon}
    class="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-x-5 -translate-y-1/2 text-printer-ink-light dark:text-printer-ink-dark/50 sm:-translate-x-6"
  />
  <h1
    class="font-serif text-xl font-bold tracking-tight text-printer-ink dark:text-printer-ink-dark uppercase"
  >
    {@render children()}
  </h1>
</div>
