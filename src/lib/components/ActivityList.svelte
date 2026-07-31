<script lang="ts">
  import { getDictionary, type Language } from "$lib/dictionaries";
  import type { IconName } from "$lib/icons";
  import { activities, type Activity } from "../../params/activity";
  import Icon from "./Icon.svelte";

  let { lang }: { lang: Language } = $props();

  let dictionary = $derived(getDictionary(lang));

  const icons: Record<Activity, IconName> = {
    reading: "book",
    watching: "film",
    listening: "music",
  };

  // One row per activity: the label, how many entries are filed under it, and
  // the newest one as a preview. The count is printed even when it is zero, so
  // an empty channel reads as empty here instead of after a click.
  let rows = $derived(
    activities.map((activity) => {
      const items = dictionary.recent[activity];
      return {
        activity,
        href: `${dictionary.urls.life}/${activity}`,
        label: dictionary.labels[activity],
        count: items.length,
        latest: items[0]?.title,
      };
    }),
  );
</script>

<div class="flex flex-col">
  {#each rows as row (row.activity)}
    <a
      href={row.href}
      class="printed-row group -mx-3 flex items-start gap-3 px-3 py-3 transition-colors hover:bg-printer-ink/[0.035] focus-visible:bg-printer-ink/[0.035] focus-visible:outline-none dark:hover:bg-printer-ink-dark/[0.035] dark:focus-visible:bg-printer-ink-dark/[0.035]"
    >
      <Icon
        name={icons[row.activity]}
        class="mt-[3px] h-3.5 w-3.5 shrink-0 text-printer-ink-light transition-colors group-hover:text-printer-accent group-focus-visible:text-printer-accent dark:text-printer-ink-dark/40 dark:group-hover:text-printer-accent-dark dark:group-focus-visible:text-printer-accent-dark"
      />

      <div class="min-w-0 flex-1">
        <!-- Label, dot leader, count — a table-of-contents line -->
        <div class="flex items-baseline gap-2">
          <span
            class="font-mono text-[13px] font-medium leading-5 text-printer-ink transition-colors group-hover:text-printer-accent group-focus-visible:text-printer-accent dark:text-printer-ink-dark dark:group-hover:text-printer-accent-dark dark:group-focus-visible:text-printer-accent-dark"
          >
            {row.label}
          </span>
          <span
            class="h-0 min-w-4 flex-1 translate-y-px border-b border-dotted border-printer-ink/15 dark:border-printer-ink-dark/15"
          ></span>
          <span
            class="shrink-0 font-mono text-[10px] tracking-[0.12em] tabular-nums text-printer-ink-light dark:text-printer-ink-dark/55"
          >
            {dictionary.labels.entries(row.count)}
          </span>
        </div>

        {#if row.latest}
          <p
            class="mt-1 line-clamp-1 max-w-[62ch] font-serif text-[13px] leading-relaxed text-printer-ink-light dark:text-printer-ink-dark/60"
          >
            {row.latest}
          </p>
        {/if}
      </div>

      <span
        aria-hidden="true"
        class="shrink-0 font-mono text-sm leading-5 text-printer-ink-light transition-transform duration-200 group-hover:translate-x-1 group-hover:text-printer-accent dark:text-printer-ink-dark/30 dark:group-hover:text-printer-accent-dark"
      >
        →
      </span>
    </a>
  {/each}
</div>
