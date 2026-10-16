<script lang="ts">
  import { afterNavigate, goto } from "$app/navigation";
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import type { Component, Snippet } from "svelte";
  import {
    getDictionary,
    languages,
    type Dictionary,
    type Language,
  } from "$lib/dictionaries";
  import { masterWarning } from "$lib/master-warning.svelte";
  import { mascot, type Mascot } from "$lib/site-config";
  import type { SocialCardKind } from "$lib/social";
  import DeckPlane from "./DeckPlane.svelte";
  import FcuWindow from "./FcuWindow.svelte";
  import SocialHoverCard from "./SocialHoverCard.svelte";

  type ColorMode = "system" | "light" | "dark";

  /**
   * Who rides the deck, keyed by the mascot values site-config lists. An
   * empty deck runs nothing, so adding a mascot means adding a row here —
   * the Record makes the compiler ask for it.
   */
  const deckOccupants: Record<Mascot, Component | null> = {
    none: null,
    plane: DeckPlane,
  };

  const DeckOccupant = deckOccupants[mascot];

  let {
    lang,
    dictionary,
    children,
  }: {
    lang: Language;
    dictionary: Dictionary;
    children: Snippet;
  } = $props();

  let navItems = $derived([
    { label: dictionary.labels.home, href: dictionary.urls.home },
    { label: dictionary.labels.posts, href: dictionary.urls.posts },
    { label: dictionary.labels.projects, href: dictionary.urls.projects },
    { label: dictionary.labels.use, href: dictionary.urls.use },
    { label: dictionary.labels.about, href: dictionary.urls.about },
  ]);

  // ------------------------------------------------------------------
  // Navigation: a pressed button engages at once, before the page loads.
  // ------------------------------------------------------------------
  let pendingNavHref = $state<string | null>(null);

  function isActive(href: string): boolean {
    const pathname = page.url.pathname;
    if (href === dictionary.urls.home) return pathname === href;
    return pathname.startsWith(href);
  }

  function isEngaged(href: string): boolean {
    return pendingNavHref ? pendingNavHref === href : isActive(href);
  }

  function onNavPress(event: MouseEvent, href: string) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    pendingNavHref = isActive(href) ? null : href;
  }

  // ------------------------------------------------------------------
  // DISPLAY window — the colour mode. The inline script in app.html applies
  // the stored mode before paint; this handles turning the knob afterwards.
  // ------------------------------------------------------------------
  const displayModes: ColorMode[] = ["system", "light", "dark"];
  const displayReadouts: Record<ColorMode, string> = {
    system: "AUTO",
    light: "DAY",
    dark: "NGT",
  };
  const displayAngles: Record<ColorMode, number> = {
    system: 0,
    light: -50,
    dark: 50,
  };

  let colorMode = $state<ColorMode>("system");
  let systemDark = $state(false);
  let isDark = $derived(
    colorMode === "dark" || (colorMode === "system" && systemDark),
  );

  onMount(() => {
    const stored = document.documentElement.dataset.colorMode;
    if (stored === "light" || stored === "dark" || stored === "system") {
      colorMode = stored;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    systemDark = media.matches;
    const onMediaChange = () => {
      systemDark = media.matches;
      if (colorMode === "system") {
        document.documentElement.classList.toggle("dark", media.matches);
      }
    };
    media.addEventListener("change", onMediaChange);
    return () => media.removeEventListener("change", onMediaChange);
  });

  function turnDisplayKnob() {
    const mode =
      displayModes[(displayModes.indexOf(colorMode) + 1) % displayModes.length];
    colorMode = mode;
    try {
      localStorage.setItem("color-mode", mode);
    } catch {}
    document.documentElement.dataset.colorMode = mode;
    document.documentElement.classList.toggle("dark", isDark);
  }

  // ------------------------------------------------------------------
  // LANG window — let the knob turn before navigating.
  // ------------------------------------------------------------------
  const LANGUAGE_KNOB_ANIMATION_MS = 220;
  let displayLang = $derived<string>(lang);
  let langSwitchTimer: ReturnType<typeof setTimeout> | undefined;
  let displayDictionary = $derived(getDictionary(displayLang));

  function turnLanguageKnob() {
    const index = languages.indexOf(displayLang as Language);
    const newLang = languages[(index + 1) % languages.length];
    const rest = page.url.pathname.split("/").slice(2);
    const newPath = `/${newLang}${rest.length ? `/${rest.join("/")}` : ""}`;
    displayLang = newLang;
    pendingNavHref = null;
    clearTimeout(langSwitchTimer);
    langSwitchTimer = setTimeout(
      () => goto(newPath),
      LANGUAGE_KNOB_ANIMATION_MS,
    );
  }

  // ------------------------------------------------------------------
  // MASTER WARN lights on an error page until it is pressed.
  // ------------------------------------------------------------------
  let isError = $derived(page.status >= 400);

  // ------------------------------------------------------------------
  // PROG window — reading progress, on post pages only.
  // ------------------------------------------------------------------
  let isPost = $derived(page.route.id === "/[lang=lang]/posts/[slug]");
  let progress = $state(0);

  $effect(() => {
    if (!isPost) return;
    void page.url.pathname; // re-measure on post-to-post navigation
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress =
        max > 0
          ? Math.min(100, Math.max(0, Math.round((window.scrollY / max) * 100)))
          : 100;
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  });

  // ------------------------------------------------------------------
  // The display refreshes on navigation.
  // ------------------------------------------------------------------
  let screenElement: HTMLElement;

  afterNavigate((navigation) => {
    pendingNavHref = null;
    masterWarning.acknowledged = false;
    if (
      navigation.type === "enter" ||
      !screenElement ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    screenElement.animate(
      [
        { opacity: 0.25, filter: "brightness(1.35)" },
        { opacity: 1, filter: "none" },
      ],
      { duration: 240, easing: "ease-out" },
    );
  });

  const currentYear = new Date().getFullYear();

  const footerLinks: {
    kind: SocialCardKind;
    label: string;
    align?: "right";
  }[] = [
    { kind: "x", label: "X" },
    { kind: "github", label: "GitHub" },
    { kind: "email", label: "Email", align: "right" },
  ];
</script>

{#snippet autopilotButtons(compact: boolean)}
  {#each navItems as item (item.href)}
    <a
      href={item.href}
      aria-current={isActive(item.href) ? "page" : undefined}
      onclick={(event) => onNavPress(event, item.href)}
      class={[
        "pb",
        compact && "min-w-0 px-1 text-[9px] tracking-[0.04em]",
        isEngaged(item.href) && "active",
      ]}
    >
      <span class="pb-bars" aria-hidden="true"><span></span><span></span><span></span></span>
      <span>{item.label}</span>
    </a>
  {/each}
{/snippet}

<a class="skip-link" href="#main-content">
  {dictionary.labels.skipToContent}
</a>

<div class="min-h-screen px-2.5 pb-14 pt-9 sm:px-5 sm:pt-11">
  <div class="relative mx-auto w-full max-w-[70rem]">
    <!-- Decorative critter/vehicle on the glareshield's top edge, picked by
      the mascot flag in src/lib/site-config.ts. -->
    {#if DeckOccupant}
      <DeckOccupant />
    {/if}

    <!-- Glareshield: brand, FCU (LANG, nav, PROG, DISPLAY), master lights -->
    <header
      class={[
        "glareshield relative z-10 flex flex-wrap items-center gap-x-4 gap-y-3 px-3.5 py-3.5 sm:px-5 lg:flex-nowrap lg:gap-5 lg:py-[18px]",
        isPost && "md:sticky md:top-0 md:z-30",
      ]}
    >
      <a
        href={dictionary.urls.home}
        class="mr-auto flex min-w-0 items-center gap-3 rounded-sm max-lg:grow max-lg:basis-0"
      >
        <img
          class="h-9 w-9 shrink-0 rounded-full shadow-[0_0_0_3px_#15181b,0_0_0_4px_rgba(255,255,255,0.12)] sm:h-10 sm:w-10"
          src="/static/avatar.webp"
          alt={dictionary.meta.name}
          width="40"
          height="40"
        />
        <span class="min-w-0">
          <span
            class="block text-sm font-bold tracking-[0.24em] sm:text-[15px]"
          >
            {dictionary.labels.brandName}
          </span>
          <span
            class="mt-0.5 block text-[8px] uppercase tracking-[0.14em] text-hw-soft sm:text-[9px] sm:tracking-[0.16em]"
          >
            {dictionary.labels.brandTagline}
          </span>
        </span>
      </a>

      <div class="recess flex shrink-0 items-end gap-3 px-3 py-2 sm:gap-4 sm:px-4 sm:py-2.5">
        <FcuWindow
          label="LANG"
          value={displayLang === "zh" ? "中" : "EN"}
          angle={displayLang === "zh" ? 40 : -40}
          title={displayDictionary.labels.switchLanguage}
          onclick={turnLanguageKnob}
        />
        <nav
          class="hidden gap-2 self-center lg:flex"
          aria-label={dictionary.labels.primaryNavigation}
        >
          {@render autopilotButtons(false)}
        </nav>
        {#if isPost}
          <div
            class="hidden flex-col items-center gap-1 self-start md:flex"
            role="progressbar"
            aria-label={dictionary.labels.readingProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <span class="fcu-label" aria-hidden="true">PROG</span>
            <span class="lcd min-w-[4.5rem]" aria-hidden="true">
              {String(progress).padStart(3, "0")}%
            </span>
          </div>
        {/if}
        <FcuWindow
          label="DISPLAY"
          value={displayReadouts[colorMode]}
          angle={displayAngles[colorMode]}
          title={dictionary.labels.colorMode(
            dictionary.labels.colorModes[colorMode],
          )}
          onclick={turnDisplayKnob}
        />
      </div>

      <div class="hidden gap-2 lg:flex">
        {#if isError}
          <button
            type="button"
            class={[
              "master master-warn cursor-pointer",
              !masterWarning.acknowledged && "lit flashing",
            ]}
            aria-label={dictionary.labels.masterWarn}
            aria-pressed={masterWarning.acknowledged}
            onclick={() => (masterWarning.acknowledged = true)}
          >
            <span>MASTER</span><span>WARN</span>
          </button>
        {:else}
          <div class="master master-warn" aria-hidden="true">
            <span>MASTER</span><span>WARN</span>
          </div>
        {/if}
        <div class="master master-caut" aria-hidden="true">
          <span>MASTER</span><span>CAUT</span>
        </div>
      </div>

      <nav
        class="recess grid w-full grid-cols-5 gap-1.5 p-2 lg:hidden"
        aria-label={dictionary.labels.primaryNavigation}
      >
        {@render autopilotButtons(true)}
      </nav>
    </header>

    <!-- Instrument panel and the display set into it -->
    <div class="instrument-panel">
      <div class="bezel">
        <div class="screen" bind:this={screenElement}>
          <nav
            class="hidden flex-wrap gap-0.5 rounded-t-[3px] bg-screen-bar p-1.5 sm:flex"
            aria-label={dictionary.labels.displaySections}
          >
            {#each navItems as item (item.href)}
              <a
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                onclick={(event) => onNavPress(event, item.href)}
                class={["screen-tab", isEngaged(item.href) && "active"]}
              >
                {item.label}
              </a>
            {/each}
          </nav>

          <main
            id="main-content"
            tabindex="-1"
            class="px-3.5 pb-8 pt-6 focus:outline-none sm:px-6 sm:pb-10 sm:pt-7"
          >
            {@render children()}
          </main>

          <footer
            class="flex flex-col items-center justify-between gap-3 rounded-b-[3px] bg-screen-bar px-4 py-3 font-mono text-[11px] tracking-[0.1em] text-ink-soft sm:flex-row sm:px-6"
          >
            <div class="order-2 sm:order-1">© {currentYear} LUOJIAHAI</div>
            <div class="order-1 flex items-center gap-4 uppercase sm:order-2">
              {#each footerLinks as { kind, label, align } (kind)}
                {@const contact = dictionary.contacts.find(
                  (contact) => contact.kind === kind,
                )}
                {#if contact}
                  <SocialHoverCard
                    {kind}
                    href={contact.link}
                    {lang}
                    {dictionary}
                    {align}
                    class="transition-colors hover:text-accent"
                  >
                    {label}
                  </SocialHoverCard>
                {/if}
              {/each}
            </div>
          </footer>
        </div>
      </div>
    </div>
  </div>
</div>
