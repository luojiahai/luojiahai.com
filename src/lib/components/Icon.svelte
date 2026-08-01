<script lang="ts">
  import { icons, customIconPaths, type IconName } from "$lib/icons";

  let { name, class: className = "" }: { name: IconName; class?: string } =
    $props();
</script>

{#if name in icons}
  {@const LucideIcon = icons[name as keyof typeof icons]}
  <LucideIcon class={className} aria-hidden="true" />
{:else}
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    class={className}
    aria-hidden="true"
  >
    <path d={customIconPaths[name as keyof typeof customIconPaths]} />
  </svg>
{/if}
