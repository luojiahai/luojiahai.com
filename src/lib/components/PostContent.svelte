<script lang="ts">
  let { html }: { html: string } = $props();
</script>

<div
  class={[
    "post-content prose mt-[22px] max-w-[66ch] font-read text-[16.5px] leading-[1.72] max-sm:text-base",
    "prose-headings:font-ui prose-headings:tracking-[0.02em] prose-headings:scroll-mt-24",
    "prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3",
    "prose-p:my-[1.05em]",
    "prose-a:font-normal prose-a:underline-offset-[3px]",
    "prose-a:transition-[text-decoration-color,text-decoration-thickness] prose-a:duration-150",
    "prose-li:my-1.5",
    "prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:border-l-2",
    "prose-pre:border prose-pre:border-white/15 prose-pre:px-4 prose-pre:py-3",
    "prose-code:before:content-none prose-code:after:content-none",
    "prose-img:my-6 prose-img:border prose-img:border-white/35",
  ]}
>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- build-time markdown output -->
  {@html html}
</div>
