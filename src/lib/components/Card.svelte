<script lang="ts">
  import type { Snippet } from "svelte";

  /**
   * A panel on the display: an optional header strip, a body, and an
   * optional action row (a "view all" button and the like).
   */
  let {
    title,
    class: className = "",
    children,
    action,
  }: {
    title?: string;
    class?: string;
    children: Snippet;
    action?: Snippet;
  } = $props();
</script>

<section class={["card", className]}>
  {#if title}
    <h2 class="card-head">{title}</h2>
  {/if}
  {@render children()}
  {#if action}
    <div class="flex justify-end px-3.5 pb-3.5">
      {@render action()}
    </div>
  {/if}
</section>
