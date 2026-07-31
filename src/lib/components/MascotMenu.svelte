<script lang="ts">
  import { tick } from "svelte";
  import { fly } from "svelte/transition";
  import type { Dictionary } from "$lib/dictionaries";
  import { topAnimations, type TopAnimation } from "$lib/site-config";
  import { mascot, setMascot } from "$lib/mascot-state.svelte";
  import { mascotGlyphs } from "$lib/mascot-glyphs";
  import DotMatrix from "./DotMatrix.svelte";

  /**
   * Selector for the critter riding the printer's top edge. The trigger is
   * a print window: the deck's occupant rendered in dot-matrix, laid down
   * row by row whenever it changes. Picking from the chit reprints it.
   *
   * The chit is promoted to the top layer and positioned in viewport
   * coordinates, because the header housing clips its overflow and would
   * otherwise cut the chit off at the shell edge.
   */
  let { dictionary }: { dictionary: Dictionary } = $props();

  /** Keep in sync with .deck-chit's width in app.css. */
  const CHIT_WIDTH = 144;
  const VIEWPORT_MARGIN = 8;

  const options: TopAnimation[] = [...topAnimations];

  let open = $state(false);
  let position = $state({ top: 0, left: 0 });
  let triggerEl = $state<HTMLButtonElement>();
  let wrapperEl = $state<HTMLDivElement>();
  let itemEls = $state<HTMLButtonElement[]>([]);

  let currentLabel = $derived(dictionary.labels.deckOptions[mascot.current]);

  /** Park the chit under the readout, right-aligned, kept on screen. */
  function reposition() {
    const rect = triggerEl?.getBoundingClientRect();
    if (!rect) return;
    position = {
      top: rect.bottom + 8,
      left: Math.min(
        Math.max(VIEWPORT_MARGIN, rect.right - CHIT_WIDTH),
        window.innerWidth - CHIT_WIDTH - VIEWPORT_MARGIN,
      ),
    };
  }

  /** Lift the chit out of the header's overflow clip. */
  function topLayer(node: HTMLElement) {
    try {
      node.showPopover?.();
    } catch {
      // Already shown, or popovers unsupported — the fixed positioning
      // below keeps it out of the clip either way.
    }
  }

  function toggle() {
    if (!open) reposition();
    open = !open;
  }

  function close(returnFocus = false) {
    open = false;
    if (returnFocus) triggerEl?.focus();
  }

  function select(value: TopAnimation) {
    setMascot(value);
    close(true);
  }

  async function onTriggerKeydown(event: KeyboardEvent) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    if (!open) {
      reposition();
      open = true;
    }
    // The list drops below the readout, so Down lands on the nearest item.
    const index = event.key === "ArrowDown" ? 0 : options.length - 1;
    await tick();
    itemEls[index]?.focus();
  }

  function onItemKeydown(event: KeyboardEvent, index: number) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      const next = (index + step + options.length) % options.length;
      itemEls[next]?.focus();
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      itemEls[event.key === "Home" ? 0 : options.length - 1]?.focus();
    }
  }

  // Dismiss on outside pointer, Escape, or focus leaving the menu entirely
  // (which also covers tabbing out). The chit sits in the top layer but
  // stays a DOM descendant, so contains() still answers correctly.
  $effect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperEl?.contains(event.target as Node)) close();
    };
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        close(true);
      }
    };
    const onFocusIn = (event: FocusEvent) => {
      if (!wrapperEl?.contains(event.target as Node)) close();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("focusin", onFocusIn);
    // Viewport coordinates go stale as the page moves under the chit.
    window.addEventListener("scroll", reposition, { passive: true });
    window.addEventListener("resize", reposition);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeydown);
      document.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("scroll", reposition);
      window.removeEventListener("resize", reposition);
    };
  });
</script>

<div class="flex" bind:this={wrapperEl}>
  <button
    bind:this={triggerEl}
    type="button"
    aria-haspopup="menu"
    aria-expanded={open}
    aria-label="{dictionary.labels.deck}: {currentLabel}"
    title="{dictionary.labels.deck}: {currentLabel}"
    onclick={toggle}
    onkeydown={onTriggerKeydown}
    class="deck-readout"
  >
    {#key mascot.current}
      <DotMatrix glyph={mascotGlyphs[mascot.current]} printing />
    {/key}
  </button>

  {#if open}
    <div
      use:topLayer
      popover="manual"
      class="deck-chit"
      style:top="{position.top}px"
      style:left="{position.left}px"
      transition:fly={{ y: -6, duration: 160 }}
    >
      <div
        class="rounded-sm border border-printer-ink/15 dark:border-printer-ink-dark/15 bg-printer-paper dark:bg-printer-paper-dark thermal-texture shadow-[0_10px_28px_rgba(0,0,0,0.16),0_2px_6px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_28px_rgba(0,0,0,0.55),0_2px_6px_rgba(0,0,0,0.4)] px-2.5 py-2 text-left"
      >
        <!-- No title row: the readout's caption already names this. -->
        <div role="menu" aria-label={dictionary.labels.deck}>
          {#each options as option, i (option)}
            {@const active = mascot.current === option}
            <button
              bind:this={itemEls[i]}
              type="button"
              role="menuitemradio"
              aria-checked={active}
              onclick={() => select(option)}
              onkeydown={(event) => onItemKeydown(event, i)}
              class="deck-option {active ? 'active' : ''}"
            >
              <span class="flex items-center gap-2.5">
                <DotMatrix glyph={mascotGlyphs[option]} dot={2} />
                <span class="leading-none">
                  {dictionary.labels.deckOptions[option]}
                </span>
              </span>
              <span
                class="relative flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-black/10 dark:bg-black/40"
              >
                <span
                  class={[
                    "h-1.5 w-1.5 rounded-full transition-colors duration-200",
                    active
                      ? "bg-printer-accent shadow-[0_0_6px_rgba(217,119,87,0.5)] dark:bg-printer-accent-dark"
                      : "bg-transparent",
                  ]}
                ></span>
              </span>
            </button>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>
