<script lang="ts">
  import "../app.css";
  import { page } from "$app/state";
  import { getDictionary, languageOf } from "$lib/dictionaries";
  import PrinterShell from "$lib/components/PrinterShell.svelte";

  let { children } = $props();

  let lang = $derived(languageOf(page.url));
  let dictionary = $derived(getDictionary(lang));

  // The server only sets <html lang> on full page loads; keep it in sync
  // across client-side language switches.
  $effect(() => {
    document.documentElement.lang = lang;
  });
</script>

<PrinterShell {lang} {dictionary}>
  {@render children()}
</PrinterShell>
