/**
 * The blog sections. Kept out of `$lib/content` so the `section` param
 * matcher — which ships to the browser as part of the client router — does
 * not pull the velite output (`#velite`) into the client bundle.
 */
export const sections = ["posts", "life"] as const;

export type Section = (typeof sections)[number];

export function isSection(value: string): value is Section {
  return (sections as readonly string[]).includes(value);
}
