<script lang="ts">
  import { page } from "$app/state";
  import { getDictionary, languageOf } from "$lib/dictionaries";

  let lang = $derived(languageOf(page.url));
  let dictionary = $derived(getDictionary(lang));
  let notFound = $derived(dictionary.labels.notFound);
</script>

<svelte:head>
  <title>{notFound.system} {notFound.title} - {dictionary.meta.websiteName}</title>
  <meta name="robots" content="noindex" />
</svelte:head>

{#snippet leader()}
  <span
    class="mx-1.5 inline-block w-[6em] -translate-y-1 border-b-2 border-dotted border-ecam-cyan max-sm:w-[3em]"
  ></span>
{/snippet}

<h1 class="text-xl font-bold leading-[1.2] tracking-[0.06em] text-ecam-red">
  <u class="decoration-2 underline-offset-4">{notFound.system}</u>
  {notFound.title}
</h1>

<div class="mt-4 font-mono text-base leading-[1.9]">
  <p>
    <span class="text-ecam-white">{notFound.requested}</span>
    <span class="break-all text-ecam-amber">{page.url.pathname}</span>
  </p>
  <p class="text-ecam-cyan">- {notFound.url}{@render leader()}{notFound.check}</p>
  <p>
    <a class="text-ecam-cyan hover:underline" href="/{lang}">
      - {notFound.home}{@render leader()}{notFound.select}
    </a>
  </p>
</div>

<p class="mt-[22px] font-read text-[15px] text-ecam-dim">ERR {page.status}</p>
