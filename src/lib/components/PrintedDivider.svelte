<script lang="ts">
  let {
    style = "dashed",
    class: className = "",
  }: {
    style?: "solid" | "dashed" | "dotted";
    class?: string;
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
    className,
  ]}
></div>
