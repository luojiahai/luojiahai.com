/** Site-wide feature flags. */

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

/** Show the draggable decorative stickers on the printer shell. */
export const showStickers = false;

/** Show the activity section (recent reading/films/listening) on the life page. */
export const showActivity = false;
