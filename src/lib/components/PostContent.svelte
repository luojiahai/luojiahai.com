<script lang="ts">
  let { html }: { html: string } = $props();
</script>

<!-- Colours come from the .post-content prose variables in app.css, which
  follow the DAY/NGT display tokens. -->
<div
  class={[
    "post-content prose max-w-[68ch]",
    "prose-base sm:prose-lg sm:leading-[1.78]",
    "prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-xl sm:prose-h2:text-[1.375rem]",
    "prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-lg sm:prose-h3:text-xl",
    "prose-p:my-5 prose-li:my-1.5",
  ]}
>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- build-time markdown output -->
  {@html html}
</div>
