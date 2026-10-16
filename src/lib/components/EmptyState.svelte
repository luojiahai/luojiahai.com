<script lang="ts">
  import { page } from "$app/state";
  import { getDictionary, languageOf } from "$lib/dictionaries";

  let lang = $derived(languageOf(page.url));
  let dictionary = $derived(getDictionary(lang));
</script>

<p
  class="px-4 py-8 text-center font-mono text-sm uppercase tracking-[0.1em] text-memo"
>
  {dictionary.labels.empty}
</p>
