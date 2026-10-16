<script lang="ts">
  import type { Category } from "$lib/content";
  import type { Dictionary, Language } from "$lib/dictionaries";

  /**
   * The posts pages' category filter, styled as the EFIS control panel's
   * buttons: each category is a page of its own, and the one on screen has
   * its green bars lit.
   */
  let {
    categories,
    active,
    lang,
    dictionary,
  }: {
    categories: Category[];
    /** The category on screen; null for all posts. */
    active: string | null;
    lang: Language;
    dictionary: Dictionary;
  } = $props();

  let buttons = $derived([
    {
      key: "all",
      label: dictionary.labels.allCategories,
      href: dictionary.urls.posts,
      engaged: active === null,
    },
    ...categories.map((category) => ({
      key: category.slug,
      label: `${category.name[lang]} ${category.count[lang]}`,
      href: category.permalink[lang],
      engaged: active === category.slug,
    })),
  ]);
</script>

<nav class="efis" aria-label={dictionary.labels.postFilter}>
  <span
    class="mr-1 font-sans text-[9px] font-bold tracking-[0.16em] text-hw-soft"
    aria-hidden="true">EFIS</span
  >
  {#each buttons as button (button.key)}
    <a
      href={button.href}
      aria-current={button.engaged ? "page" : undefined}
      class={["pb", button.engaged && "active"]}
    >
      <span class="pb-bars" aria-hidden="true"><span></span><span></span><span></span></span>
      <span>{button.label}</span>
    </a>
  {/each}
</nav>
