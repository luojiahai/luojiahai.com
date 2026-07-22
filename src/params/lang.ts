import { isLanguage } from "$lib/dictionaries";
import type { ParamMatcher } from "@sveltejs/kit";

export const match: ParamMatcher = (param) => isLanguage(param);
