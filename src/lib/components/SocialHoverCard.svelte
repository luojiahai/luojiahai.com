<script lang="ts">
  import { onMount, tick } from "svelte";
  import type { Snippet } from "svelte";
  import type { Dictionary, Language } from "$lib/dictionaries";
  import type { SocialCardKind } from "$lib/social";
  import { ensureSocialStats, social } from "$lib/social-state.svelte";

  let {
    kind,
    href,
    lang,
    dictionary,
    side = "bottom",
    class: className = "",
    children,
  }: {
    kind: SocialCardKind;
    href: string;
    lang: Language;
    dictionary: Dictionary;
    /** Which side of the link the card prefers; it flips when that side
     * has no room. */
    side?: "top" | "bottom";
    class?: string;
    children: Snippet;
  } = $props();

  const OPEN_DELAY_MS = 120;
  const CLOSE_DELAY_MS = 160;
  const VIEWPORT_MARGIN = 12;
  const GAP = 8;

  /**
   * What opened the card decides what closes it: a hover closes when the
   * mouse leaves, keyboard focus when focus leaves, and a tap only on a tap
   * elsewhere, Escape, or a scroll.
   */
  type Opener = "hover" | "focus" | "tap";

  let openedBy = $state<Opener | null>(null);
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pointerType = "";
  let wrapper: HTMLSpanElement;
  let trigger: HTMLAnchorElement;
  let card = $state<HTMLDivElement>();

  function openSoon(by: Opener) {
    ensureSocialStats();
    clearTimeout(timer);
    if (openedBy) return;
    timer = setTimeout(() => openNow(by), OPEN_DELAY_MS);
  }

  async function openNow(by: Opener) {
    ensureSocialStats();
    clearTimeout(timer);
    openedBy = by;
    await tick();
    place();
  }

  function closeSoon(by: Opener) {
    clearTimeout(timer);
    if (openedBy !== by) return;
    timer = setTimeout(close, CLOSE_DELAY_MS);
  }

  function close() {
    clearTimeout(timer);
    openedBy = null;
  }

  /** Centre the card on the link, kept inside the viewport. */
  function place() {
    if (!card) return;
    const link = trigger.getBoundingClientRect();
    const { offsetWidth: width, offsetHeight: height } = card;
    const left = Math.min(
      Math.max(VIEWPORT_MARGIN, link.left + link.width / 2 - width / 2),
      window.innerWidth - width - VIEWPORT_MARGIN,
    );
    const above = link.top - height - GAP;
    const below = link.bottom + GAP;
    const fitsAbove = above >= GAP;
    const fitsBelow = below + height <= window.innerHeight - GAP;
    const top =
      side === "top"
        ? fitsAbove || !fitsBelow
          ? above
          : below
        : fitsBelow || !fitsAbove
          ? below
          : above;
    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
  }

  function onTriggerClick(event: MouseEvent) {
    // A touch has no hover, so the first tap shows the card and the card's
    // own link (or a second tap) follows it.
    if (pointerType === "touch" && !openedBy) {
      event.preventDefault();
      openNow("tap");
    }
  }

  // Warm up the live stats while idle so an open card never waits on the
  // network.
  onMount(() => {
    const idle = setTimeout(ensureSocialStats, 2500);
    return () => {
      clearTimeout(idle);
      clearTimeout(timer);
    };
  });

  function formatCount(value: number): string {
    return new Intl.NumberFormat(lang === "zh" ? "zh-CN" : "en-US", {
      notation: value >= 10000 ? "compact" : "standard",
      maximumFractionDigits: 1,
    }).format(value);
  }

  const kindLabels: Record<SocialCardKind, string> = {
    github: "GITHUB",
    x: "X",
    telegram: "TELEGRAM",
    instagram: "INSTAGRAM",
    email: "EMAIL",
  };

  /** What each kind of card shows: a handle, up to three stats, a bio. */
  let view = $derived.by(() => {
    const stats = social.stats;
    const labels = dictionary.social;
    switch (kind) {
      case "github":
        return {
          handle: `@${stats.github.handle}`,
          stats: [
            [labels.followers, formatCount(stats.github.followers)],
            [labels.repos, formatCount(stats.github.publicRepos)],
            [labels.contributions, formatCount(stats.github.totalContributions)],
          ],
          bio: "",
        };
      case "x":
        return {
          handle: `@${stats.x.handle}`,
          stats: [
            [labels.followers, formatCount(stats.x.followers)],
            [labels.following, formatCount(stats.x.following)],
            [labels.since, stats.x.joined],
          ],
          bio: stats.x.bio,
        };
      case "instagram":
        return {
          handle: `@${stats.instagram.handle}`,
          stats: [
            [labels.followers, formatCount(stats.instagram.followers)],
            [labels.following, formatCount(stats.instagram.following)],
            [labels.posts, formatCount(stats.instagram.posts)],
          ],
          bio: stats.instagram.bio,
        };
      case "telegram":
        return {
          handle: `@${stats.telegram.handle}`,
          stats: [],
          bio: stats.telegram.bio || labels.telegramHint,
        };
      case "email":
        return {
          handle: href.replace("mailto:", ""),
          stats: [],
          bio: labels.emailHint,
        };
    }
  });

  // Contribution heatmap: column-major grid of GitHub-style weeks
  // (top = Sunday), newest week in the last column. -1 marks padding cells
  // beyond the data range.
  const HEATMAP_WEEKS = 18;

  let heatmapCells = $derived.by(() => {
    const { levels, endDate } = social.stats.github;
    const days = [...levels].map(Number);
    const endWeekday = new Date(`${endDate}T00:00:00Z`).getUTCDay();
    const padded = days.concat(Array(6 - endWeekday).fill(-1));
    const size = HEATMAP_WEEKS * 7;
    const cells = padded.slice(-size);
    return cells.length < size
      ? Array(size - cells.length).fill(-1).concat(cells)
      : cells;
  });
</script>

<svelte:window onscroll={() => openedBy && close()} />
<svelte:document
  onclick={(event) => {
    if (openedBy && !wrapper.contains(event.target as Node)) close();
  }}
/>

<!-- Pointer handlers only track hover intent; keyboard access goes through
  the anchor's focus, so the wrapper stays presentational. -->
<span
  role="presentation"
  class="relative inline-flex"
  bind:this={wrapper}
  onpointerenter={(event) => event.pointerType === "mouse" && openSoon("hover")}
  onpointerleave={(event) => event.pointerType === "mouse" && closeSoon("hover")}
  onfocusout={(event) => {
    if (!wrapper.contains(event.relatedTarget as Node | null)) closeSoon("focus");
  }}
  onkeydown={(event) => event.key === "Escape" && close()}
>
  <a
    bind:this={trigger}
    {href}
    target={kind === "email" ? undefined : "_blank"}
    rel={kind === "email" ? undefined : "noopener"}
    class={className}
    data-open={openedBy ? "" : undefined}
    onpointerdown={(event) => (pointerType = event.pointerType)}
    onfocus={() => trigger.matches(":focus-visible") && openSoon("focus")}
    onclick={onTriggerClick}
  >
    {@render children()}
  </a>

  {#if openedBy}
    <!-- The link itself carries the name and destination; the card repeats
      it for sighted readers, so it stays out of the accessibility tree. -->
    <div bind:this={card} class="hc" aria-hidden="true">
      <div class="screen">
        <div class="hc-head">
          <b>{kindLabels[kind]}</b>
          <span>{view.handle}</span>
        </div>

        {#if view.stats.length > 0}
          <div class="hc-stats">
            {#each view.stats as [label, value] (label)}
              <div>{label}<b>{value}</b></div>
            {/each}
          </div>
        {/if}

        {#if view.bio}
          <p class="hc-bio">{view.bio}</p>
        {/if}

        {#if kind === "github"}
          <div class="hc-heat-label">{dictionary.social.recentActivity}</div>
          <div class="hc-heat">
            {#each heatmapCells as level, i (i)}
              <i data-level={level}></i>
            {/each}
          </div>
        {/if}

        <div class="hc-foot">
          <a
            class="act"
            {href}
            target={kind === "email" ? undefined : "_blank"}
            rel={kind === "email" ? undefined : "noopener"}
            tabindex="-1">OPEN ›</a
          >
        </div>
      </div>
    </div>
  {/if}
</span>
