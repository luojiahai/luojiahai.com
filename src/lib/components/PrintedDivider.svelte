<script lang="ts">
  let {
    style = "dashed",
  }: {
    style?: "solid" | "dashed" | "dotted";
  } = $props();

  const styleClasses = {
    solid: "border-t",
    dashed: "border-t border-dashed",
    dotted: "border-t border-dotted",
  };
</script>

<div
  class={[
    "my-6 border-printer-ink/10 dark:border-printer-ink-dark/10",
    styleClasses[style],
  ]}
></div>
