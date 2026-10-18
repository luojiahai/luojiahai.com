<script lang="ts">
  import { page } from "$app/state";
  import { getDictionary, languageOf } from "$lib/dictionaries";

  let lang = $derived(languageOf(page.url));
  let dictionary = $derived(getDictionary(lang));
</script>

<p class="font-mono text-data text-printer-ink-light dark:text-printer-ink-light-dark py-2.5">
  {dictionary.labels.empty}
</p>
