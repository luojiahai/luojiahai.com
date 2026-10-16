<script lang="ts">
  import { afterNavigate, goto } from "$app/navigation";
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import type { Snippet } from "svelte";
  import type { SiteStats } from "$lib/content";
  import { ecamDate, lcdDate } from "$lib/date";
  import { getDictionary, type Dictionary, type Language } from "$lib/dictionaries";
  import type { SocialCardKind } from "$lib/social";
  import SocialHoverCard from "./SocialHoverCard.svelte";

  type ColorMode = "system" | "light" | "dark";
  type Lever = "test" | "brt" | "dim";

  let {
    lang,
    dictionary,
    stats,
    builtAt,
    children,
  }: {
    lang: Language;
    dictionary: Dictionary;
    stats: SiteStats;
    builtAt: string;
    children: Snippet;
  } = $props();

  const navKeys = ["home", "posts", "projects", "use", "about"] as const;

  let navItems = $derived(
    navKeys.map((key) => ({
      key,
      label: dictionary.labels[key],
      href: dictionary.urls[key],
    })),
  );

  // ------------------------------------------------------------------
  // Navigation active/pending state
  // ------------------------------------------------------------------
  let pendingNavHref = $state<string | null>(null);

  function isActive(href: string): boolean {
    const pathname = page.url.pathname;
    if (href === dictionary.urls.home) return pathname === href;
    return pathname.startsWith(href);
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
  // Panel lighting. The inline script in app.html applies the stored mode
  // before paint; the ANN LT switch changes it afterwards. The lever's
  // resting position is drawn by CSS from html.dark, so it is right before
  // hydration too.
  // ------------------------------------------------------------------
  const TEST_MS = 1200;

  let colorMode = $state<ColorMode>("system");
  let systemDark = $state(false);
  let testing = $state(false);
  let testTimer: ReturnType<typeof setTimeout> | undefined;
  let isDark = $derived(
    colorMode === "dark" || (colorMode === "system" && systemDark),
  );
  let lever: Lever = $derived(testing ? "test" : isDark ? "dim" : "brt");

  function applyDark(dark: boolean) {
    document.documentElement.classList.toggle("dark", dark);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", dark ? "#0b0d0f" : "#1d2226");
  }

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
        applyDark(media.matches);
      }
    };
    media.addEventListener("change", onMediaChange);
    return () => {
      media.removeEventListener("change", onMediaChange);
      clearTimeout(testTimer);
    };
  });

  function setColorMode(mode: ColorMode) {
    colorMode = mode;
    try {
      localStorage.setItem("color-mode", mode);
    } catch {}
    document.documentElement.dataset.colorMode = mode;
    applyDark(isDark);
  }

  function setLever(position: Lever) {
    clearTimeout(testTimer);
    if (position === "test") {
      testing = true;
      testTimer = setTimeout(() => (testing = false), TEST_MS);
      return;
    }
    testing = false;
    setColorMode(position === "dim" ? "dark" : "light");
  }

  // ------------------------------------------------------------------
  // Master warning: lit on an error page until pressed, as in the cockpit.
  // ------------------------------------------------------------------
  let warnAcknowledged = $state(false);
  let warnLit = $derived(page.status >= 400 && !warnAcknowledged);

  // ------------------------------------------------------------------
  // Language switch — let the knob turn before navigating.
  // ------------------------------------------------------------------
  const LANGUAGE_KNOB_ANIMATION_MS = 220;
  let displayLang = $derived<string>(lang);
  let langSwitchTimer: ReturnType<typeof setTimeout> | undefined;
  let displayDictionary = $derived(getDictionary(displayLang));

  function switchLanguage() {
    const newLang = displayLang === "en" ? "zh" : "en";
    const rest = page.url.pathname.split("/").slice(2);
    const newPath = `/${newLang}${rest.length ? `/${rest.join("/")}` : ""}`;
    displayLang = newLang;
    pendingNavHref = null;
    clearTimeout(langSwitchTimer);
    langSwitchTimer = setTimeout(() => goto(newPath), LANGUAGE_KNOB_ANIMATION_MS);
  }

  // ------------------------------------------------------------------
  // Phosphor fade on the display after a client-side navigation.
  // ------------------------------------------------------------------
  let screenContent: HTMLElement;

  afterNavigate((navigation) => {
    pendingNavHref = null;
    warnAcknowledged = false;
    if (
      navigation.type === "enter" ||
      !screenContent ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    screenContent.animate(
      [
        { opacity: 0, filter: "brightness(1.8) blur(0.6px)" },
        { opacity: 1, filter: "none" },
      ],
      { duration: 150, easing: "ease-out" },
    );
  });

  // ------------------------------------------------------------------
  // UTC clock for the status strip. Prerendered HTML has no "now", so it
  // shows dashes until the browser takes over.
  // ------------------------------------------------------------------
  let now = $state<Date | null>(null);

  onMount(() => {
    now = new Date();
    let interval: ReturnType<typeof setInterval> | undefined;
    const tick = () => (now = new Date());
    const align = setTimeout(
      () => {
        tick();
        interval = setInterval(tick, 60_000);
      },
      60_000 - (Date.now() % 60_000),
    );
    return () => {
      clearTimeout(align);
      clearInterval(interval);
    };
  });

  const pad = (value: number, width = 2) => String(value).padStart(width, "0");
  let utcHours = $derived(now ? pad(now.getUTCHours()) : "--");
  let utcMinutes = $derived(now ? pad(now.getUTCMinutes()) : "--");
  let postCount = $derived(stats.posts[lang]);

  const currentYear = new Date().getFullYear();

  const pedestalKeys: { kind: SocialCardKind; legend: string }[] = [
    { kind: "x", legend: "X" },
    { kind: "github", legend: "GITHUB" },
    { kind: "email", legend: "EMAIL" },
  ];
</script>

<a class="skip-link" href="#main-content">
  {dictionary.labels.skipToContent}
</a>

<div class="cockpit" data-ann-test={testing ? "" : undefined}>
  <header class="fcu panel">
    <div class="fcu-left">
      <div class="placard">
        <img src="/static/avatar.webp" alt="" width="42" height="42" />
        <div>
          <div class="reg">{dictionary.labels.brandName}</div>
          <div class="type">{dictionary.labels.brandTagline}</div>
        </div>
        <i class="rivet a"></i>
        <i class="rivet b"></i>
      </div>
      <span class="ann norm" aria-hidden="true">NORM</span>
    </div>

    <div class="fcu-mid">
      <div class="lcds" aria-hidden="true">
        <div class="lcd">
          <span class="legend">POSTS</span>
          <span class="lcd-win">{pad(postCount, 3)}</span>
        </div>
        <div class="lcd">
          <span class="legend">PROJ</span>
          <span class="lcd-win">{pad(stats.projects, 3)}<span class="dot"></span></span>
        </div>
        <div class="lcd">
          <span class="legend">LAST UPD</span>
          <span class="lcd-win">{lcdDate(builtAt)}</span>
        </div>
      </div>

      <nav class="ecp-row" aria-label={dictionary.labels.primaryNavigation}>
        {#each navItems as item (item.key)}
          <a
            href={item.href}
            class="ecp"
            aria-label={item.label}
            aria-current={isActive(item.href) ? "page" : undefined}
            data-lit={(pendingNavHref
              ? pendingNavHref === item.href
              : isActive(item.href)) || undefined}
            onclick={(event) => onNavPress(event, item.href)}
          >
            <span class="ecp-bar"></span>
            <span class="ecp-leg">{item.key.toUpperCase()}</span>
          </a>
        {/each}
      </nav>
    </div>

    <div class="fcu-right">
      <div class={["masters", warnLit && "has-lit"]}>
        <button
          type="button"
          class={["master warn", warnLit && "lit"]}
          disabled={!warnLit}
          aria-label={dictionary.labels.masterWarning}
          onclick={() => (warnAcknowledged = true)}
        >
          MASTER<br />WARN
        </button>
        <span class="master caut" aria-hidden="true">MASTER<br />CAUT</span>
      </div>

      <div class="annlt" role="group" aria-label={dictionary.labels.annLt}>
        <span class="legend" aria-hidden="true">ANN LT</span>
        <div class="annlt-row">
          <div class="annlt-pos">
            {#each ["test", "brt", "dim"] as const as position (position)}
              <button
                type="button"
                aria-pressed={lever === position}
                aria-label={dictionary.labels.annLtPositions[position]}
                onclick={() => setLever(position)}
              >
                {position.toUpperCase()}
              </button>
            {/each}
          </div>
          <button
            type="button"
            class="toggle"
            aria-label={dictionary.labels.annLtFlip}
            onclick={() => setLever(isDark ? "brt" : "dim")}
          >
            <span class="nut"></span>
            <span class="stem"></span>
            <span class="tip"></span>
          </button>
        </div>
      </div>

      <div class="selector">
        <span class="legend" aria-hidden="true">LANG</span>
        <button
          type="button"
          class={["knob-btn", displayLang === "zh" && "zh"]}
          title={displayDictionary.labels.switchLanguage}
          aria-label={displayDictionary.labels.switchLanguage}
          onclick={switchLanguage}
        >
          <span class="mark l">EN</span>
          <span class="mark r">ZH</span>
          <span class="tick l"></span>
          <span class="tick r"></span>
          <span class="knob"></span>
        </button>
      </div>
    </div>
  </header>

  <div class="du">
    <i class="screw tl"></i>
    <i class="screw tr"></i>
    <i class="screw bl"></i>
    <i class="screw br"></i>
    <div class="screen">
      <main
        id="main-content"
        tabindex="-1"
        class="scr-body"
        bind:this={screenContent}
      >
        {@render children()}
      </main>
      <div class="sd-status">
        <div>
          POSTS <span class="value">{postCount}</span>
          PROJ <span class="value">{stats.projects}</span>
        </div>
        <div>
          UTC <span class="value">{utcHours}</span><span class="unit">H</span><span
            class="value">{utcMinutes}</span
          >
        </div>
        <div>
          {dictionary.labels.lastUpdate}
          <span class="value">{ecamDate(builtAt, lang)}</span>
        </div>
      </div>
    </div>
  </div>

  <footer class="pedestal panel">
    <span class="legend"><span class="font-read">©</span> {currentYear} LUO, JIAHAI</span>
    <div class="ped-keys">
      {#each pedestalKeys as { kind, legend } (kind)}
        {@const contact = dictionary.contacts.find((contact) => contact.kind === kind)}
        {#if contact}
          <SocialHoverCard
            {kind}
            href={contact.link}
            {lang}
            {dictionary}
            side="top"
            class="ecp plain"
          >
            <span class="ecp-leg">{legend}</span>
          </SocialHoverCard>
        {/if}
      {/each}
    </div>
  </footer>
</div>
