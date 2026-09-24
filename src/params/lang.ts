import { isLanguage } from "$lib/dictionaries";
import type { ParamMatcher } from "@sveltejs/kit";

export const match = isLanguage satisfies ParamMatcher;
