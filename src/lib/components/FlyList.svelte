<script lang="ts">
  import type { Dictionary } from "$lib/dictionaries";
  import { aircraftNames } from "../../params/aircraft";
  import Icon from "./Icon.svelte";
  import PrintedEmpty from "./PrintedEmpty.svelte";

  let { entries }: { entries: Dictionary["fly"] } = $props();

  // The name and the URL belong to the aircraft registry; the dictionary
  // supplies only the translated summary.
  let rows = $derived(
    entries.map((entry) => ({
      slug: entry.slug,
      name: aircraftNames[entry.slug],
      summary: entry.summary,
      href: `/fly/${entry.slug}`,
    })),
  );
</script>

<div class="flex flex-col">
  {#each rows as entry (entry.slug)}
    <!-- The companions are standalone pages outside the printer shell, so the
      client router has to hand off to a full load. -->
    <a
      href={entry.href}
      data-sveltekit-reload
      class="printed-row group -mx-3 flex items-start gap-3 px-3 py-3 transition-colors hover:bg-printer-ink/[0.035] focus-visible:bg-printer-ink/[0.035] focus-visible:outline-none dark:hover:bg-printer-ink-dark/[0.035] dark:focus-visible:bg-printer-ink-dark/[0.035]"
    >
      <Icon
        name="plane"
        class="mt-[7px] h-3.5 w-3.5 shrink-0 text-printer-ink-light transition-colors group-hover:text-printer-accent group-focus-visible:text-printer-accent dark:text-printer-ink-dark/40 dark:group-hover:text-printer-accent-dark dark:group-focus-visible:text-printer-accent-dark"
      />

      <div class="min-w-0 flex-1">
        <span
          class="font-mono text-[13px] font-medium leading-5 text-printer-ink transition-colors group-hover:text-printer-accent group-focus-visible:text-printer-accent dark:text-printer-ink-dark dark:group-hover:text-printer-accent-dark dark:group-focus-visible:text-printer-accent-dark"
        >
          {entry.name}
        </span>
        <p
          class="mt-1 max-w-[62ch] font-serif text-[13px] leading-relaxed text-printer-ink-light dark:text-printer-ink-dark/60"
        >
          {entry.summary}
        </p>
      </div>

      <span
        aria-hidden="true"
        class="shrink-0 font-mono text-sm leading-5 text-printer-ink-light transition-transform duration-200 group-hover:translate-x-1 group-hover:text-printer-accent dark:text-printer-ink-dark/30 dark:group-hover:text-printer-accent-dark"
      >
        →
      </span>
    </a>
  {:else}
    <PrintedEmpty />
  {/each}
</div>
