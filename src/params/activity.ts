import type { ParamMatcher } from "@sveltejs/kit";

export const activities = ["reading", "films", "music"] as const;

export type Activity = (typeof activities)[number];

export const match: ParamMatcher = (param): param is Activity =>
  (activities as readonly string[]).includes(param);
