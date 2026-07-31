import type { TopAnimation } from "./site-config";

/**
 * 9x7 dot-matrix glyphs for the deck readout — what the print head would
 * lay down to say who's on the deck. '#' prints a dot, '.' leaves the
 * paper blank.
 *
 * The plane sits centred (it flies), the snail sits on the bottom row (it
 * crawls), and an empty deck prints nothing at all.
 */
export const mascotGlyphs: Record<TopAnimation, string[]> = {
  none: [
    ".........",
    ".........",
    ".........",
    ".........",
    ".........",
    ".........",
    ".........",
  ],
  plane: [
    ".........",
    "...##....",
    ".#.##....",
    "#########",
    ".#.##....",
    "...##....",
    ".........",
  ],
  snail: [
    ".........",
    ".......#.",
    "..###..#.",
    ".#...#.##",
    ".#.#.#.##",
    ".#...#.##",
    "#########",
  ],
};

export const GLYPH_COLS = 9;
export const GLYPH_ROWS = 7;

/** Flattened cells, carrying the row index so the print pass can cascade. */
export function glyphCells(glyph: string[]) {
  return glyph.flatMap((row, y) =>
    [...row].map((char, x) => ({ on: char === "#", row: y, key: `${x}-${y}` })),
  );
}
