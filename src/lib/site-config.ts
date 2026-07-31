/** Site-wide configuration. */

/**
 * The critters available to ride the printer shell's top edge — the deck —
 * in the order the deck menu lists them.
 */
export const mascots = ["none", "plane", "snail"] as const;
export type Mascot = (typeof mascots)[number];

/**
 * Which mascot rides the deck by default. Visitors can override it from the
 * deck menu; their pick is stored under the "mascot" key (see
 * src/lib/mascot-state.svelte.ts).
 */
export const defaultMascot: Mascot = "snail";
