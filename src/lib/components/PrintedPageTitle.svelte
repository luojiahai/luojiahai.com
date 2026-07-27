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

<div class="mb-2 flex items-center gap-2">
  <Icon
    name={icon}
    class="pointer-events-none h-4 w-4 shrink-0 text-printer-accent dark:text-printer-accent-dark"
  />
  <h1
    class="font-serif text-xl font-bold uppercase leading-none tracking-tight text-printer-ink dark:text-printer-ink-dark"
  >
    {@render children()}
  </h1>
</div>
