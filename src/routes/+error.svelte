<script lang="ts">
  import { page } from "$app/state";
  import { getDictionary, isLanguage, defaultLanguage } from "$lib/dictionaries";

  let lang = $derived.by(() => {
    const param = page.params.lang ?? page.url.pathname.split("/")[1];
    return param && isLanguage(param) ? param : defaultLanguage;
  });
  let dictionary = $derived(getDictionary(lang));
</script>

<svelte:head>
  <title>{dictionary.labels.notFoundTitle} - {dictionary.meta.websiteName}</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div
  data-not-found
  class="relative flex flex-col items-center justify-center min-h-[50vh] py-12 px-4 select-none"
>
  <!-- Tray interior decorations — guide rails along left & right edges -->
  <div class="absolute inset-y-0 left-0 w-6 sm:w-8 pointer-events-none opacity-40">
    <div
      class="absolute inset-y-4 left-2 sm:left-3 w-[2px] bg-gradient-to-b from-transparent via-printer-ink/10 to-transparent dark:via-printer-ink-dark/10 rounded-full"
    ></div>
    <div
      class="absolute inset-y-4 left-[7px] sm:left-[11px] w-[1px] bg-gradient-to-b from-transparent via-printer-ink/5 to-transparent dark:via-printer-ink-dark/5"
    ></div>
  </div>
  <div class="absolute inset-y-0 right-0 w-6 sm:w-8 pointer-events-none opacity-40">
    <div
      class="absolute inset-y-4 right-2 sm:right-3 w-[2px] bg-gradient-to-b from-transparent via-printer-ink/10 to-transparent dark:via-printer-ink-dark/10 rounded-full"
    ></div>
    <div
      class="absolute inset-y-4 right-[7px] sm:right-[11px] w-[1px] bg-gradient-to-b from-transparent via-printer-ink/5 to-transparent dark:via-printer-ink-dark/5"
    ></div>
  </div>

  <!-- Tray bottom ridge — horizontal groove near bottom -->
  <div
    class="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-printer-ink/8 to-transparent dark:via-printer-ink-dark/8 pointer-events-none"
  ></div>
  <div
    class="absolute bottom-[3px] left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/[0.02] pointer-events-none"
  ></div>

  <!-- Top inset shadow line for recessed depth -->
  <div
    class="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-black/[0.06] to-transparent dark:via-black/20 pointer-events-none"
  ></div>

  <!-- Error status strip -->
  <div class="flex items-center gap-2 mb-8 relative z-10">
    <div
      class="w-2 h-2 rounded-full bg-printer-accent dark:bg-printer-accent-dark animate-pulse"
    ></div>
    <span
      class="font-mono text-[9px] tracking-[0.3em] uppercase text-printer-accent dark:text-printer-accent-dark"
    >
      {dictionary.labels.notFoundStatus}
    </span>
    <div
      class="w-2 h-2 rounded-full bg-printer-accent dark:bg-printer-accent-dark animate-pulse"
    ></div>
  </div>

  <!-- Empty paper tray illustration -->
  <div class="relative w-48 h-36 mb-10">
    <svg
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="w-full h-full text-printer-ink/20 dark:text-printer-ink-dark/20"
    >
      <!-- Tray base - 3D perspective -->
      <path
        d="M20 100 L40 130 L160 130 L180 100"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <path d="M40 130 L160 130" stroke="currentColor" stroke-width="2" />
      <path
        d="M20 55 L20 100 L40 130"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <path
        d="M180 55 L180 100 L160 130"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <path
        d="M20 55 L40 75 L160 75 L180 55"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
        stroke-dasharray="4 3"
      />
      <path
        d="M55 75 L55 125"
        stroke="currentColor"
        stroke-width="1"
        stroke-dasharray="2 4"
        class="text-printer-ink/10 dark:text-printer-ink-dark/10"
      />
      <path
        d="M145 75 L145 125"
        stroke="currentColor"
        stroke-width="1"
        stroke-dasharray="2 4"
        class="text-printer-ink/10 dark:text-printer-ink-dark/10"
      />
      <path
        d="M60 90 L140 90"
        stroke="currentColor"
        stroke-width="0.5"
        stroke-dasharray="3 5"
        class="text-printer-ink/8 dark:text-printer-ink-dark/8"
      />
      <path
        d="M55 100 L145 100"
        stroke="currentColor"
        stroke-width="0.5"
        stroke-dasharray="3 5"
        class="text-printer-ink/8 dark:text-printer-ink-dark/8"
      />
      <path
        d="M50 110 L150 110"
        stroke="currentColor"
        stroke-width="0.5"
        stroke-dasharray="3 5"
        class="text-printer-ink/8 dark:text-printer-ink-dark/8"
      />
      <path
        d="M35 130 L35 135 L165 135 L165 130"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <!-- Arrow pointing down into tray (insert paper here) -->
      <path
        d="M100 25 L100 48"
        stroke="currentColor"
        stroke-width="1.5"
        class="text-printer-ink/30 dark:text-printer-ink-dark/30 animate-bounce"
        style:animation-duration="2s"
      />
      <path
        d="M93 41 L100 50 L107 41"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
        class="text-printer-ink/30 dark:text-printer-ink-dark/30 animate-bounce"
        style:animation-duration="2s"
      />
      <!-- Small page icon (ghost of missing paper) -->
      <rect
        x="85"
        y="82"
        width="30"
        height="38"
        rx="1"
        stroke="currentColor"
        stroke-width="0.8"
        stroke-dasharray="2 2"
        class="text-printer-ink/10 dark:text-printer-ink-dark/10"
      />
      <path
        d="M105 82 L115 82 L115 92"
        stroke="currentColor"
        stroke-width="0.8"
        stroke-dasharray="2 2"
        class="text-printer-ink/10 dark:text-printer-ink-dark/10"
      />
    </svg>
  </div>

  <!-- Main heading -->
  <h1
    class="font-serif text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase text-printer-ink dark:text-printer-ink-dark mb-3 text-center"
  >
    {dictionary.labels.notFoundTitle}
  </h1>

  <!-- Sub text -->
  <p
    class="font-mono text-[11px] sm:text-xs tracking-wide text-printer-ink-light dark:text-printer-ink-dark/40 text-center max-w-xs mb-8 leading-relaxed"
  >
    {dictionary.labels.notFoundSubtitle}
  </p>

  <!-- Separator -->
  <div
    class="w-32 border-t border-dashed border-printer-ink/10 dark:border-printer-ink-dark/10 mb-8"
  ></div>

  <!-- Print home button -->
  <a href="/{lang}" class="printer-btn px-6 h-9 text-[11px] tracking-[0.2em]">
    {dictionary.labels.notFoundButton}
  </a>

  <!-- Error code -->
  <div
    class="mt-10 font-mono text-[8px] tracking-[0.4em] uppercase text-printer-ink/20 dark:text-printer-ink-dark/15"
  >
    {dictionary.labels.notFoundError}
  </div>

  <!-- Pull-handle bar at the bottom of the tray -->
  <div class="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
    <div
      class="w-16 h-[5px] rounded-full bg-gradient-to-b from-printer-ink/[0.07] to-printer-ink/[0.03] dark:from-printer-ink-dark/[0.10] dark:to-printer-ink-dark/[0.04] border border-printer-ink/[0.06] dark:border-printer-ink-dark/[0.06]"
    ></div>
    <div
      class="absolute inset-x-1 top-[1px] h-[1px] rounded-full bg-white/30 dark:bg-white/[0.03]"
    ></div>
  </div>
</div>
