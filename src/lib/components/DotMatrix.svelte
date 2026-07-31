<script lang="ts">
  import { GLYPH_COLS, glyphCells } from "$lib/mascot-glyphs";

  /**
   * A tiny dot-matrix print of a glyph. Unlit dots stay visible as blank
   * paper so the grid reads as a print area rather than a floating shape.
   */
  let {
    glyph,
    dot = 3,
    printing = false,
  }: {
    glyph: string[];
    /** Dot diameter in px; the 1px gutter scales with it. */
    dot?: number;
    /** Cascade the dots on, row by row, like a print head pass. */
    printing?: boolean;
  } = $props();

  let cells = $derived(glyphCells(glyph));
</script>

<div
  class={["dot-matrix", printing && "printing"]}
  style:--dot="{dot}px"
  style:--cols={GLYPH_COLS}
  aria-hidden="true"
>
  {#each cells as cell (cell.key)}
    <span class:on={cell.on} style:--row={cell.row}></span>
  {/each}
</div>
