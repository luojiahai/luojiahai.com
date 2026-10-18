<script lang="ts">
  import type { Dictionary } from "$lib/dictionaries";

  /**
   * Desktop-only light switch: a pull cord on the right edge of the screen
   * toggles dark mode via a Braun/TE-style pendant lamp hanging on the left —
   * a matte plastic drum housing with an orange trim ring and a frosted
   * diffuser globe, matching the printer-shell design language.
   *
   * Pulling the cord in light mode blacks out the whole screen, then the
   * bulb sputters awake revealing the dark theme. Pulling again makes the
   * bulb flicker and die, and daylight fades back in.
   *
   * The bulb / room-shading layers are shown purely via CSS (`dark` class +
   * `lg` breakpoint), so they are correct on first paint with no JS.
   */
  let {
    isDark,
    ontoggle,
    dictionary,
  }: {
    isDark: boolean;
    /** Called mid-transition, while the screen is fully black. */
    ontoggle: (dark: boolean) => void;
    dictionary: Dictionary;
  } = $props();

  let busy = $state(false);
  let pulled = $state(false);
  let blackoutElement: HTMLDivElement | undefined = $state();

  let title = $derived(
    isDark ? dictionary.labels.lightSwitchOff : dictionary.labels.lightSwitchOn,
  );

  // Blackout opacity over time — an old bulb sputtering awake…
  const FLICKER_ON: Keyframe[] = [
    { opacity: 1, offset: 0 },
    { opacity: 1, offset: 0.08 },
    { opacity: 0.45, offset: 0.14 },
    { opacity: 0.9, offset: 0.22 },
    { opacity: 0.15, offset: 0.32 },
    { opacity: 0.75, offset: 0.4 },
    { opacity: 0.85, offset: 0.47 },
    { opacity: 0.08, offset: 0.56 },
    { opacity: 0.5, offset: 0.66 },
    { opacity: 0, offset: 0.76 },
    { opacity: 0.18, offset: 0.86 },
    { opacity: 0, offset: 1 },
  ];

  function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function run(
    element: Element,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions,
  ) {
    const animation = element.animate(keyframes, { fill: "forwards", ...options });
    try {
      await animation.finished;
    } catch {
      // Cancelled mid-flight (e.g. rapid re-toggle) — the caller re-syncs.
    }
  }

  async function pull() {
    if (busy || !blackoutElement) return;
    busy = true;
    const toDark = !isDark;
    blackoutElement.getAnimations().forEach((animation) => animation.cancel());

    // Tug the cord down.
    pulled = true;
    await wait(170);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ontoggle(toDark);
      pulled = false;
      busy = false;
      return;
    }

    if (toDark) {
      // Lights out — the room goes pitch black…
      await run(blackoutElement, [{ opacity: 0 }, { opacity: 1 }], {
        duration: 150,
        easing: "ease-in",
      });
      ontoggle(true); // swap the theme under cover of darkness
      pulled = false; // cord springs back up
      await wait(140); // a beat of total darkness
      // …then the old bulb sputters awake.
      await run(blackoutElement, FLICKER_ON, { duration: 780, easing: "linear" });
    } else {
      // Daylight returns instantly, then the bulb clicks off and fades away
      // (the CSS transitions on the bulb/shading layers do the "lamp dying").
      ontoggle(false);
      await wait(120);
      pulled = false;
      await wait(650); // keep the switch busy until the bulb has been hoisted away
    }

    busy = false;
  }
</script>

<!-- Room shading — the further from the bulb, the darker the page -->
<div class="lamp-shade hidden lg:block fixed inset-0 z-[90] pointer-events-none" aria-hidden="true"></div>
<div class="lamp-warmth hidden lg:block fixed inset-0 z-[90] pointer-events-none" aria-hidden="true"></div>

<!-- The bulb, hanging left of the content column -->
<div
  class="bulb-root hidden lg:block fixed top-0 z-[95] pointer-events-none"
  aria-hidden="true"
>
  <div class="bulb-sway relative">
    <div class="bulb-glow absolute"></div>
    <svg width="100" height="190" viewBox="0 0 100 190" fill="none" class="bulb-svg relative block">
      <defs>
        <radialGradient id="light-switch-diffuser" cx="0.5" cy="0.42" r="0.75">
          <stop offset="0" style="stop-color: var(--lamp-diffuser-0)" />
          <stop offset="0.5" style="stop-color: var(--lamp-diffuser-1)" />
          <stop offset="0.85" style="stop-color: var(--lamp-diffuser-2)" />
          <stop offset="1" style="stop-color: var(--lamp-diffuser-3)" />
        </radialGradient>
        <!-- horizontal sheen that makes the flat drum read as a cylinder -->
        <linearGradient id="light-switch-cyl" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#000000" stop-opacity="0.12" />
          <stop offset="0.16" stop-color="#ffffff" stop-opacity="0.42" />
          <stop offset="0.42" stop-color="#ffffff" stop-opacity="0.05" />
          <stop offset="0.72" stop-color="#000000" stop-opacity="0" />
          <stop offset="1" stop-color="#000000" stop-opacity="0.24" />
        </linearGradient>
      </defs>
      <!-- straight rubber pendant cable -->
      <path d="M50 -2 V60" class="bulb-wire" />
      <!-- strain relief where the cable enters the housing -->
      <rect x="46" y="56" width="8" height="12" rx="3" class="bulb-cap" />
      <!-- frosted diffuser globe -->
      <circle cx="50" cy="130" r="24" fill="url(#light-switch-diffuser)" class="bulb-glass" />
      <!-- dead-diffuser overlay, shown the instant the lamp switches off -->
      <circle cx="50" cy="130" r="24" class="bulb-glass-dead" />
      <!-- soft highlight on the globe -->
      <path d="M35.12 123.76 a18 18 0 0 1 7.92 -11.04" class="bulb-glint" />
      <!-- matte plastic housing drum -->
      <path d="M28 105 V73 a7 7 0 0 1 7 -7 h30 a7 7 0 0 1 7 7 V105 Z" class="bulb-shade" />
      <path
        d="M28 105 V73 a7 7 0 0 1 7 -7 h30 a7 7 0 0 1 7 7 V105 Z"
        fill="url(#light-switch-cyl)"
        class="bulb-shade-sheen"
      />
      <!-- grooves -->
      <path d="M33 82 H67 M33 88 H67" class="bulb-vent" />
      <!-- accent trim ring where the globe meets the housing -->
      <rect x="27" y="103.5" width="46" height="5" rx="2.5" class="bulb-ring" />
      <rect
        x="27"
        y="103.5"
        width="46"
        height="5"
        rx="2.5"
        fill="url(#light-switch-cyl)"
        class="bulb-ring-sheen"
      />
    </svg>
  </div>
</div>

<!-- The pull cord, hanging right of the content column -->
<div class="cord-root cord-sway hidden lg:block fixed -top-12 z-[95]">
  <button
    type="button"
    role="switch"
    aria-checked={isDark}
    aria-label={title}
    {title}
    onclick={pull}
    class="cord-group block cursor-pointer focus:outline-none"
    class:pulled
  >
    <svg width="28" height="270" viewBox="0 0 28 270" fill="none" class="block">
      <defs>
        <linearGradient id="light-switch-handle-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#000000" stop-opacity="0.12" />
          <stop offset="0.16" stop-color="#ffffff" stop-opacity="0.42" />
          <stop offset="0.42" stop-color="#ffffff" stop-opacity="0.05" />
          <stop offset="0.72" stop-color="#000000" stop-opacity="0" />
          <stop offset="1" stop-color="#000000" stop-opacity="0.24" />
        </linearGradient>
        <clipPath id="light-switch-handle-clip">
          <path d="M7 203 a4 4 0 0 1 4 -4 h6 a4 4 0 0 1 4 4 v28 a4 4 0 0 1 -4 4 h-6 a4 4 0 0 1 -4 -4 Z" />
        </clipPath>
      </defs>
      <!-- straight rubber cable -->
      <line x1="14" y1="0" x2="14" y2="197" class="cord-rope" />
      <!-- ferrule where the cable enters the handle -->
      <rect x="11" y="193" width="6" height="9" rx="2.5" class="cord-ferrule" />
      <!-- matte plastic pull handle -->
      <path
        d="M7 203 a4 4 0 0 1 4 -4 h6 a4 4 0 0 1 4 4 v28 a4 4 0 0 1 -4 4 h-6 a4 4 0 0 1 -4 -4 Z"
        class="cord-handle"
      />
      <g clip-path="url(#light-switch-handle-clip)">
        <rect x="6" y="228.5" width="16" height="7" class="cord-accent" />
        <path
          d="M7 203 a4 4 0 0 1 4 -4 h6 a4 4 0 0 1 4 4 v28 a4 4 0 0 1 -4 4 h-6 a4 4 0 0 1 -4 -4 Z"
          fill="url(#light-switch-handle-sheen)"
          class="cord-sheen"
        />
        <path d="M9 205 H19 M9 209 H19" class="cord-grip" />
      </g>
    </svg>
  </button>
</div>

<!-- Blackout curtain the flicker animations run on -->
<div
  bind:this={blackoutElement}
  class="hidden lg:block fixed inset-0 z-[100] bg-black opacity-0 pointer-events-none"
  aria-hidden="true"
></div>

<style>
  /* The lamp and cord axes hang --lamp-offset outside the 56rem printer's
     edges (50% ∓ 448px), mirrored. Never clamped to the viewport, which
     would shove the lamp on top of the shell. */
  :global(:root) {
    --lamp-offset: 64px;
    --lamp-x: calc(50% - 448px - var(--lamp-offset));

    /* The light's own incandescent palette, kept apart from the printer
       tokens; the lamp's hardware and accent ring still use those. */
    --lamp-diffuser-0: #fff8dd;
    --lamp-diffuser-1: #ffeaae;
    --lamp-diffuser-2: #ffcd78;
    --lamp-diffuser-3: #ffb45a;
    --lamp-rim: rgba(255, 226, 170, 0.55);
    --lamp-shadow: rgba(255, 190, 100, 0.4);
    --lamp-glow-core: rgba(255, 216, 130, 0.55);
    --lamp-glow-edge: rgba(255, 190, 100, 0.2);
    --lamp-warmth-core: rgba(255, 190, 110, 0.14);
    --lamp-warmth-edge: rgba(255, 185, 105, 0.05);
  }

  /* ---------------- room lighting ---------------- */

  /* The gradients are centred on the bulb.
     Both layers appear instantly when dark mode arrives (hidden behind the
     blackout curtain anyway) but fade away gently when the lamp is switched
     off in daylight. */
  .lamp-shade,
  .lamp-warmth {
    opacity: 0;
    transition: opacity 420ms ease;
  }
  :global(.dark) .lamp-shade,
  :global(.dark) .lamp-warmth {
    opacity: 1;
    transition: none;
  }

  /* Light falls off with distance from the bulb */
  .lamp-shade {
    background: radial-gradient(
      140% 140% at var(--lamp-x) 135px,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.05) 22%,
      rgba(0, 0, 0, 0.16) 45%,
      rgba(0, 0, 0, 0.3) 72%,
      rgba(0, 0, 0, 0.4) 100%
    );
  }

  /* Warm incandescent spill close to the bulb */
  .lamp-warmth {
    background: radial-gradient(
      620px circle at var(--lamp-x) 135px,
      var(--lamp-warmth-core),
      var(--lamp-warmth-edge) 45%,
      transparent 72%
    );
    mix-blend-mode: screen;
  }

  /* ---------------- bulb ---------------- */

  /* Lowered down from above the screen when the lamp arrives; when switched
     off it dies first (grey glass) and is then hoisted back up out of view. */
  .bulb-root {
    left: calc(var(--lamp-x) - 50px); /* lamp axis is at local x=50 */
    visibility: hidden;
    transform: translateY(-240px);
    transition:
      transform 540ms cubic-bezier(0.5, 0, 0.85, 0.6) 180ms,
      visibility 0s linear 720ms;
  }
  :global(.dark) .bulb-root {
    visibility: visible;
    transform: translateY(0);
    transition: transform 680ms cubic-bezier(0.22, 1.18, 0.36, 1) 80ms;
  }

  .bulb-sway {
    transform-origin: 50px 0;
    animation: light-switch-sway 9s ease-in-out infinite;
  }

  .bulb-svg {
    filter: none;
    transition: filter 130ms ease-out;
  }
  :global(.dark) .bulb-svg {
    filter: drop-shadow(0 0 18px var(--lamp-shadow));
  }

  .bulb-glow {
    left: -8px;
    top: 72px;
    width: 116px;
    height: 116px;
    border-radius: 9999px;
    background: radial-gradient(
      closest-side,
      var(--lamp-glow-core),
      var(--lamp-glow-edge) 55%,
      transparent 100%
    );
    filter: blur(6px);
    opacity: 0;
    transition: opacity 130ms ease-out;
  }
  :global(.dark) .bulb-glow {
    opacity: 1;
    animation: light-switch-shimmer 4s ease-in-out infinite;
  }

  .bulb-wire {
    stroke: rgba(20, 20, 19, 0.48);
    stroke-width: 3;
    stroke-linecap: round;
  }
  :global(.dark) .bulb-wire {
    stroke: rgba(250, 249, 245, 0.3);
  }
  .bulb-cap {
    fill: var(--color-printer-ink);
  }
  :global(.dark) .bulb-cap {
    fill: #4d4c48;
  }
  /* Cream Braun-plastic drum in daylight, charcoal plastic at night */
  .bulb-shade {
    fill: var(--color-printer-tape);
    stroke: rgba(0, 0, 0, 0.14);
    stroke-width: 1;
  }
  :global(.dark) .bulb-shade {
    fill: var(--color-printer-button-dark);
    stroke: rgba(255, 255, 255, 0.1);
  }
  :global(.dark) .bulb-shade-sheen {
    opacity: 0.55;
  }
  :global(.dark) .bulb-ring-sheen {
    opacity: 0.55;
  }
  .bulb-vent {
    stroke: rgba(0, 0, 0, 0.16);
    stroke-width: 1.4;
    stroke-linecap: round;
  }
  :global(.dark) .bulb-vent {
    stroke: rgba(0, 0, 0, 0.5);
  }
  .bulb-ring {
    fill: var(--color-printer-accent);
  }
  :global(.dark) .bulb-ring {
    fill: var(--color-printer-accent-dark);
  }
  .bulb-glass {
    stroke: var(--lamp-rim);
    stroke-width: 0.8;
  }
  /* Frosted off-white overlay revealed the instant the lamp dies */
  .bulb-glass-dead {
    fill: var(--color-printer-tape);
    stroke: rgba(0, 0, 0, 0.12);
    stroke-width: 0.8;
    opacity: 0.95;
    transition: opacity 130ms ease-out;
  }
  :global(.dark) .bulb-glass-dead {
    opacity: 0;
  }
  .bulb-glint {
    stroke: rgba(255, 255, 255, 0.6);
    stroke-width: 1.8;
    stroke-linecap: round;
  }

  /* ---------------- pull cord ---------------- */

  .cord-root {
    right: calc(var(--lamp-x) - 14px); /* cable is at local x=14 */
  }

  .cord-sway {
    transform-origin: top center;
    animation: light-switch-sway 8s ease-in-out -2s infinite;
  }

  .cord-group {
    /* springy release */
    transition: transform 600ms cubic-bezier(0.18, 1.6, 0.4, 1);
  }
  .cord-group.pulled {
    transform: translateY(46px);
    /* taut, quick pull */
    transition: transform 170ms cubic-bezier(0.55, 0, 0.9, 0.7);
  }
  .cord-group:not(.pulled):hover {
    transform: translateY(4px);
  }

  .cord-rope {
    stroke: rgba(20, 20, 19, 0.5);
    stroke-width: 2.5;
  }
  :global(.dark) .cord-rope {
    stroke: rgba(250, 249, 245, 0.3);
  }
  .cord-ferrule {
    fill: var(--color-printer-ink);
  }
  :global(.dark) .cord-ferrule {
    fill: #4d4c48;
  }
  /* Pull knob in the same Braun plastic as the lamp housing, with an orange
     end cap */
  .cord-handle {
    fill: var(--color-printer-tape);
    stroke: rgba(0, 0, 0, 0.16);
    stroke-width: 1;
  }
  :global(.dark) .cord-handle {
    fill: var(--color-printer-button-dark);
    stroke: rgba(255, 255, 255, 0.12);
  }
  .cord-accent {
    fill: var(--color-printer-accent);
  }
  :global(.dark) .cord-accent {
    fill: var(--color-printer-accent-dark);
  }
  :global(.dark) .cord-sheen {
    opacity: 0.55;
  }
  .cord-grip {
    stroke: rgba(0, 0, 0, 0.18);
    stroke-width: 1.2;
    stroke-linecap: round;
  }
  :global(.dark) .cord-grip {
    stroke: rgba(0, 0, 0, 0.5);
  }
  .cord-group:focus-visible .cord-handle {
    stroke: var(--color-printer-accent);
    stroke-width: 2;
  }

  @keyframes light-switch-sway {
    0%,
    100% {
      transform: rotate(-0.9deg);
    }
    50% {
      transform: rotate(0.9deg);
    }
  }

  @keyframes light-switch-shimmer {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.82;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .bulb-sway,
    .cord-sway,
    .bulb-glow {
      animation: none !important;
    }
    .bulb-root {
      transition: none !important;
    }
  }
</style>
