<script lang="ts">
  import { page } from "$app/state";
  import { getDictionary, languageOf } from "$lib/dictionaries";
  import { masterWarning } from "$lib/master-warning.svelte";

  let lang = $derived(languageOf(page.url));
  let dictionary = $derived(getDictionary(lang));
  let steps = $derived(dictionary.labels.notFoundSteps);
  let title = $derived(
    page.status === 404
      ? dictionary.labels.notFoundTitle
      : (page.error?.message ?? dictionary.labels.notFoundTitle),
  );

  /** The ECAM procedure: what to do, and where pressing it takes you. */
  let procedure = $derived([
    { step: steps.home, href: `/${lang}` },
    { step: steps.posts, href: dictionary.urls.posts },
    { step: steps.url, href: null },
  ]);
</script>

<svelte:head>
  <title>{title} - {dictionary.meta.websiteName}</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<!-- An ECAM warning: red system and title, cyan procedure lines. The
  glareshield's MASTER WARN flashes alongside until it is pressed. -->
<div
  data-not-found
  class="flex min-h-[26rem] flex-col gap-8 rounded-[3px] border-[6px] border-bezel bg-ecam px-5 py-8 font-mono text-hw-ink sm:px-10 sm:py-10"
>
  <div>
    <h1
      class="flex flex-wrap gap-x-5 gap-y-1 text-2xl font-bold uppercase tracking-[0.04em] text-warn sm:text-3xl"
    >
      <span class="underline underline-offset-[6px]">
        {dictionary.labels.notFoundSystem}
      </span>
      <span>{title}</span>
    </h1>
    <p class="mt-3.5 text-sm">
      ERR {page.status} ·
      <span class="break-all text-caut">{page.url.pathname}</span>
    </p>
  </div>

  <ul class="m-0 flex list-none flex-col gap-3 p-0 text-base text-ecam-cyan sm:text-lg">
    {#each procedure as { step: [label, action], href } (label)}
      <li class="max-w-[30rem]">
        {#if href}
          <a class="flex gap-2 hover:underline" {href}>
            <span>-{label}</span>
            <span class="flex-1 overflow-hidden whitespace-nowrap" aria-hidden="true">
              ..............................................
            </span>
            <span>{action}</span>
          </a>
        {:else}
          <div class="flex gap-2">
            <span>-{label}</span>
            <span class="flex-1 overflow-hidden whitespace-nowrap" aria-hidden="true">
              ..............................................
            </span>
            <span>{action}</span>
          </div>
        {/if}
      </li>
    {/each}
  </ul>

  <div
    class="mt-auto flex flex-wrap items-center justify-between gap-4 border-t-2 border-[#5c656c] pt-5"
  >
    <span
      class={[
        "hidden text-sm uppercase lg:inline",
        masterWarning.acknowledged && "text-ecam-green",
      ]}
      aria-live="polite"
    >
      {masterWarning.acknowledged
        ? dictionary.labels.notFoundAcked
        : dictionary.labels.notFoundAck}
    </span>
    <a href="/{lang}" class="btn">{dictionary.labels.notFoundButton}</a>
  </div>
</div>
