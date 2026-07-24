/** Site-wide feature flags. */

/** The decorative animations available on the printer shell's top edge. */
export const topAnimations = ["none", "snail", "plane"] as const;
export type TopAnimation = (typeof topAnimations)[number];

/** Which animation plays along the printer shell's top edge. */
export const topAnimation: TopAnimation = "snail";

/** Show the draggable decorative stickers on the printer shell. */
export const showStickers = false;

/** Show the activity section (recent reading/films/listening) on the life page. */
export const showActivity = false;
