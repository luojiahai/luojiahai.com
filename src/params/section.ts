import { isSection } from "$lib/content";
import type { ParamMatcher } from "@sveltejs/kit";

export const match: ParamMatcher = (param) => isSection(param);
