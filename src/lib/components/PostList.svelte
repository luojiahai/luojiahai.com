<script lang="ts">
  import type { Category, PostListItem } from "$lib/content";
  import { displayDate } from "$lib/date";
  import type { Language } from "$lib/dictionaries";
  import EmptyState from "./EmptyState.svelte";

  let {
    posts,
    lang,
    compact = false,
    categories = [],
  }: {
    posts: PostListItem[];
    lang: Language;
    /** Tighter rows with one-line blurbs (used on the home page). */
    compact?: boolean;
    /** When given, each row shows its categories as chips. */
    categories?: Category[];
  } = $props();

  function categoryNames(post: PostListItem): string[] {
    return categories
      .filter((category) => post.categories.includes(category.slug))
      .map((category) => category.name[lang]);
  }
</script>

<div class="flex flex-col">
  {#each posts as post (post.permalink)}
    <a
      href={post.permalink}
      class={[
        "row-link border-b border-line px-4 last:border-b-0 focus-visible:outline-offset-[-2px]",
        compact ? "py-3" : "py-4",
      ]}
    >
      <div class="grid gap-1 sm:grid-cols-[7.5rem_1fr] sm:gap-5">
        <div class="font-mono text-xs tabular-nums text-accent sm:pt-1">
          {displayDate(post.date, lang)}
        </div>
        <div class="min-w-0">
          <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
            <h3 class="row-title text-[17px] font-bold leading-snug">
              {post.title}
            </h3>
            {#each categoryNames(post) as name (name)}
              <span class="chip">{name}</span>
            {/each}
          </div>
          {#if post.description}
            <p
              class={[
                "mt-1 max-w-[70ch] text-[13px] leading-relaxed text-ink-soft",
                compact ? "line-clamp-1" : "line-clamp-2",
              ]}
            >
              {post.description}
            </p>
          {/if}
        </div>
      </div>
    </a>
  {:else}
    <EmptyState />
  {/each}
</div>
