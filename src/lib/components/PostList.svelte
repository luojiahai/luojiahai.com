<script lang="ts">
  import type { PostListItem } from "$lib/content";
  import { ecamDate } from "$lib/date";
  import ScreenEmpty from "./ScreenEmpty.svelte";

  let {
    posts,
    lang,
    compact = false,
  }: {
    posts: PostListItem[];
    lang: string;
    /** Clamp each description to one line (used on the home page). */
    compact?: boolean;
  } = $props();
</script>

<div class="flex flex-col">
  {#each posts as post (post.permalink)}
    <a href={post.permalink} class="row">
      <span class="date">
        {ecamDate(post.date, lang)}
        {#if post.draft}
          <span class="text-ecam-amber">DRAFT</span>
        {/if}
      </span>
      <span class={["t", post.featured && "text-ecam-magenta"]}>{post.title}</span>
      <span class="arrow" aria-hidden="true">›</span>
      {#if post.description}
        <span class={["d", compact ? "line-clamp-1" : "line-clamp-2"]}>
          {post.description}
        </span>
      {/if}
    </a>
  {:else}
    <ScreenEmpty />
  {/each}
</div>
