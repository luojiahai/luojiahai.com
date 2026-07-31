import { isSection } from "$lib/sections";
import type { ParamMatcher } from "@sveltejs/kit";

export const match: ParamMatcher = (param) => isSection(param);
