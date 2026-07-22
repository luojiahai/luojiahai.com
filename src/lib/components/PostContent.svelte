<script lang="ts">
  let { html }: { html: string } = $props();
</script>

<div
  class={[
    "post-content prose dark:prose-invert mx-auto max-w-[70ch] font-serif",
    "prose-base sm:prose-lg",
    "prose-headings:font-serif prose-headings:text-printer-ink dark:prose-headings:text-printer-ink-dark",
    "prose-headings:tracking-tight prose-headings:scroll-mt-24",
    "prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:mb-4",
    "prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4",
    "prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3",
    "prose-p:my-5 prose-p:text-printer-ink/85 dark:prose-p:text-printer-ink-dark/85 prose-p:leading-8",
    "prose-a:font-normal prose-a:text-inherit prose-a:underline prose-a:underline-offset-2",
    "prose-a:decoration-printer-ink/30 dark:prose-a:decoration-printer-ink-dark/30 prose-a:decoration-1",
    "prose-a:transition-[text-decoration-color,text-decoration-thickness,text-underline-offset] prose-a:duration-150",
    "prose-strong:text-printer-ink dark:prose-strong:text-printer-ink-dark",
    "prose-ul:my-5 prose-ol:my-5 prose-li:my-1.5 prose-li:leading-7 prose-li:text-printer-ink/80 dark:prose-li:text-printer-ink-dark/80",
    "prose-blockquote:font-normal prose-blockquote:border-l-2 prose-blockquote:border-printer-ink/20 dark:prose-blockquote:border-printer-ink-dark/20",
    "prose-blockquote:text-printer-ink/75 dark:prose-blockquote:text-printer-ink-dark/75 prose-blockquote:py-1",
    "prose-pre:border prose-pre:border-printer-ink/10 dark:prose-pre:border-printer-ink-dark/10",
    "prose-pre:rounded-lg prose-pre:bg-printer-ink/3 dark:prose-pre:bg-printer-ink-dark/5 prose-pre:px-4 prose-pre:py-3",
    "prose-code:text-inherit prose-code:before:content-none prose-code:after:content-none",
    "prose-img:my-6 prose-img:rounded-lg prose-img:border prose-img:border-printer-ink/10",
    "prose-hr:border-printer-ink/10 dark:prose-hr:border-printer-ink-dark/10",
  ]}
>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- build-time markdown output -->
  {@html html}
</div>
