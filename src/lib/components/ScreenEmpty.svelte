<script lang="ts">
  import { page } from "$app/state";
  import { getDictionary, languageOf } from "$lib/dictionaries";

  let lang = $derived(languageOf(page.url));
  let dictionary = $derived(getDictionary(lang));
</script>

<p class="py-2.5 font-mono text-[13px] text-ecam-dim">
  {dictionary.labels.empty}
</p>
