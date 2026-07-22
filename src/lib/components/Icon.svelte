<script lang="ts">
  import { icons, type IconName } from "$lib/icons";

  let { name, class: className = "" }: { name: IconName; class?: string } =
    $props();
</script>

<svg
  viewBox="0 0 24 24"
  fill="currentColor"
  xmlns="http://www.w3.org/2000/svg"
  class={className}
  aria-hidden="true"
>
  <path d={icons[name]} />
</svg>
