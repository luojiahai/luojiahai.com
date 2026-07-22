<script lang="ts">
  let {
    class: className = "",
    label,
  }: {
    class?: string;
    label?: string;
  } = $props();
</script>

<svg
  viewBox="0 0 128 128"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  class={className}
  role={label ? "img" : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : "true"}
>
  <path
    d="M22 32h84M22 96h84M22 64c14-18 28-18 42 0s28 18 42 0"
    stroke="currentColor"
    stroke-width="17"
    stroke-linecap="square"
  />
</svg>
