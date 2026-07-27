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

<div class="relative mb-2">
  <Icon
    name={icon}
    class="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-x-5 -translate-y-1/2 text-printer-accent dark:text-printer-accent-dark sm:-translate-x-7"
  />
  <h1
    class="font-serif text-[1.875rem] font-semibold leading-[1] tracking-[-0.03em] text-printer-ink dark:text-printer-ink-dark sm:text-[2.375rem]"
  >
    {@render children()}
  </h1>
</div>
