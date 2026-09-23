/** Site-wide configuration. */

/** The production origin, for every absolute URL the site prints. */
export const SITE_URL = "https://luojiahai.com";

/**
 * The critters available to ride the printer shell's top edge — the deck.
 */
export const mascots = ["none", "plane", "snail"] as const;
export type Mascot = (typeof mascots)[number];

/**
 * Which mascot rides the deck. Toggle by editing this value; "none" leaves
 * the deck empty.
 */
export const mascot: Mascot = "snail";
