<script lang="ts">
  let { html }: { html: string } = $props();
</script>

<div
  class={[
    "post-content prose dark:prose-invert mx-auto max-w-[72ch] font-sans",
    "text-prose",
    "prose-headings:font-sans prose-headings:font-bold prose-headings:text-printer-ink dark:prose-headings:text-printer-ink-dark",
    "prose-headings:scroll-mt-24",
    "prose-h1:text-prose-h1 prose-h1:mb-4",
    "prose-h2:text-prose-h2 prose-h2:mt-12 prose-h2:mb-4",
    "prose-h3:text-prose-h3 prose-h3:mt-8 prose-h3:mb-3",
    "prose-p:my-5 prose-p:text-printer-ink dark:prose-p:text-printer-ink-dark",
    "prose-a:font-normal prose-a:text-inherit prose-a:underline prose-a:underline-offset-2",
    "prose-a:decoration-printer-ink/30 dark:prose-a:decoration-printer-ink-dark/30 prose-a:decoration-1",
    "prose-a:transition-[text-decoration-color,text-decoration-thickness,text-underline-offset] prose-a:duration-150",
    "prose-strong:text-printer-ink dark:prose-strong:text-printer-ink-dark",
    "prose-ul:my-5 prose-ol:my-5 prose-li:my-1.5 prose-li:text-printer-ink dark:prose-li:text-printer-ink-dark",
    "prose-blockquote:font-normal prose-blockquote:border-l-2 prose-blockquote:border-printer-ink/20 dark:prose-blockquote:border-printer-ink-dark/20",
    "prose-blockquote:text-printer-ink-light dark:prose-blockquote:text-printer-ink-light-dark prose-blockquote:py-1",
    "prose-pre:border prose-pre:border-printer-ink/10 dark:prose-pre:border-printer-ink-dark/10",
    "prose-pre:rounded-lg prose-pre:bg-printer-ink/5 dark:prose-pre:bg-printer-ink-dark/5 prose-pre:px-4 prose-pre:py-3",
    "prose-pre:text-printer-ink dark:prose-pre:text-printer-ink-dark",
    "prose-code:text-inherit prose-code:before:content-none prose-code:after:content-none",
    "prose-img:my-6 prose-img:rounded-lg prose-img:border prose-img:border-printer-ink/10",
    "prose-hr:border-printer-ink/10 dark:prose-hr:border-printer-ink-dark/10",
  ]}
>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- build-time markdown output -->
  {@html html}
</div>
