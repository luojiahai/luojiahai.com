import type { ParamMatcher } from "@sveltejs/kit";

/**
 * The aircraft that have a flight companion, one page each at /fly/<slug>.
 *
 * Names are product names rather than prose, so they are the same in every
 * language and live here instead of in the dictionaries. The dictionaries
 * carry only the translated summary, keyed by slug.
 *
 * Deliberately free of the checklist payloads: this module ships to the
 * browser as part of the param matcher, and each payload is ~200 kB.
 */
export const aircraft = [{ slug: "fbw-a32nx", name: "FlyByWire A32NX" }] as const;

export type Aircraft = (typeof aircraft)[number];
export type AircraftSlug = Aircraft["slug"];

export const aircraftNames: Record<AircraftSlug, string> = Object.fromEntries(
  aircraft.map((entry) => [entry.slug, entry.name]),
) as Record<AircraftSlug, string>;

export const match: ParamMatcher = (param): param is AircraftSlug =>
  aircraft.some((entry) => entry.slug === param);
