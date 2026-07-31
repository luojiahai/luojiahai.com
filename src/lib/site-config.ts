/** Site-wide feature flags. */

/**
 * The decorative animations available on the printer shell's top edge,
 * in the order the deck menu lists them.
 */
export const topAnimations = ["none", "plane", "snail"] as const;
export type TopAnimation = (typeof topAnimations)[number];

/**
 * Which animation plays along the printer shell's top edge by default.
 * Visitors can override it from the deck menu; their pick is stored under
 * the "mascot" key (see src/lib/mascot-state.svelte.ts).
 */
export const topAnimation: TopAnimation = "snail";

/** Show the draggable decorative stickers on the printer shell. */
export const showStickers = false;

/** Show the activity section (recent reading/films/listening) on the life page. */
export const showActivity = false;
