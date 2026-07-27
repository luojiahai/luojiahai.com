<script lang="ts">
  import type { PostListItem } from "$lib/content";
  import { displayDate } from "$lib/date";
  import PrintedEmpty from "./PrintedEmpty.svelte";

  let {
    posts,
    lang,
    compact = false,
  }: {
    posts: PostListItem[];
    lang: string;
    /** Tighter rows without separators (used on the home page). */
    compact?: boolean;
  } = $props();
</script>

<div class="flex flex-col">
  {#each posts as post, index (post.permalink)}
    <div>
      <a href={post.permalink} class="group block focus-visible:outline-none">
        <div
          class={[
            "printed-row -mx-3 px-3 hover:bg-printer-ink/[0.035] group-focus-visible:bg-printer-ink/[0.035] dark:hover:bg-printer-ink-dark/[0.035] dark:group-focus-visible:bg-printer-ink-dark/[0.035]",
            compact ? "py-2.5" : "py-4",
          ]}
        >
          <div class="grid gap-1 sm:grid-cols-[7.5rem_1fr] sm:gap-5">
            <div
              class="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-printer-ink-light tabular-nums dark:text-printer-ink-dark/55 sm:pt-1"
            >
              {displayDate(post.date, lang)}
            </div>
            <div>
              <h3
                class="font-serif text-lg font-medium leading-[1.15] tracking-[-0.015em] text-printer-ink transition-colors group-hover:text-printer-accent group-focus-visible:text-printer-accent dark:text-printer-ink-dark dark:group-hover:text-printer-accent-dark dark:group-focus-visible:text-printer-accent-dark sm:text-xl"
              >
                {post.title}
              </h3>
              {#if post.description}
                <p
                  class={[
                    "mt-1 max-w-[62ch] font-serif text-[13px] leading-relaxed text-printer-ink-light dark:text-printer-ink-dark/60",
                    compact ? "line-clamp-1" : "line-clamp-2",
                  ]}
                >
                  {post.description}
                </p>
              {/if}
            </div>
          </div>
        </div>
      </a>
      {#if !compact && index < posts.length - 1}
        <div
          class="border-b border-dotted border-printer-ink/5 dark:border-printer-ink-dark/5"
        ></div>
      {/if}
    </div>
  {:else}
    <PrintedEmpty />
  {/each}
</div>
