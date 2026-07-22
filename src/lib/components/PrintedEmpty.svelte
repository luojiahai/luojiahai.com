<script lang="ts">
  import { page } from "$app/state";
  import { getDictionary, type Language } from "$lib/dictionaries";

  let lang = $derived((page.params.lang ?? "en") as Language);
  let dictionary = $derived(getDictionary(lang));
</script>

<p class="font-mono text-xs text-printer-ink-light dark:text-printer-ink-dark/40 py-2.5">
  {dictionary.labels.empty}
</p>
