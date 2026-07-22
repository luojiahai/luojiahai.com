<script lang="ts">
  import type { PostListItem } from "$lib/content";
  import { displayDate } from "$lib/date";

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

<div class={["flex flex-col", compact && "gap-3"]}>
  {#each posts as post, index (post.permalink)}
    <div>
      <a href={post.permalink} class="group block">
        <div
          class={[
            "-mx-2 px-2 rounded-md hover:bg-printer-ink/3 dark:hover:bg-printer-ink-dark/3 transition-colors",
            compact ? "py-2" : "py-3",
          ]}
        >
          <div
            class="font-mono text-[10px] text-printer-ink-light dark:text-printer-ink-dark/40 tabular-nums mb-1"
          >
            {displayDate(post.date, lang)}
          </div>
          <h3
            class="font-serif text-base text-printer-ink dark:text-printer-ink-dark group-hover:text-printer-accent dark:group-hover:text-printer-accent-dark transition-colors leading-snug"
          >
            {post.title}
          </h3>
          {#if post.description}
            <p
              class={[
                "font-serif text-xs text-printer-ink-light dark:text-printer-ink-dark/40",
                compact ? "mt-0.5 line-clamp-1" : "mt-1 line-clamp-2",
              ]}
            >
              {post.description}
            </p>
          {/if}
        </div>
      </a>
      {#if !compact && index < posts.length - 1}
        <div
          class="border-b border-dotted border-printer-ink/5 dark:border-printer-ink-dark/5"
        ></div>
      {/if}
    </div>
  {/each}
</div>
