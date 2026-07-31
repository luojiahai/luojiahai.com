import type { Mascot } from "./site-config";

/**
 * 7x5 dot-matrix glyphs for the deck readout: what the print head would
 * lay down to say who's on the deck. '#' prints a dot, '.' leaves the
 * paper blank.
 *
 * The plane sits centred (it flies), the snail sits on the bottom row (it
 * crawls), and an empty deck prints nothing at all. The grid is kept tight
 * so the readout stands the same height as the ON lamp beside it.
 */
export const mascotGlyphs: Record<Mascot, string[]> = {
  none: [".......", ".......", ".......", ".......", "......."],
  plane: ["...#...", ".#.#...", "#######", ".#.#...", "...#..."],
  snail: [".....#.", ".###.#.", ".#.#.##", ".###.##", "#######"],
};

export const GLYPH_COLS = 7;

/** Flattened cells, carrying the row index so the print pass can cascade. */
export function glyphCells(glyph: string[]) {
  return glyph.flatMap((row, y) =>
    [...row].map((char, x) => ({ on: char === "#", row: y, key: `${x}-${y}` })),
  );
}
