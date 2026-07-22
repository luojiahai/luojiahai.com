import { postsOf, toListItem } from "$lib/content";
import type { Language } from "$lib/dictionaries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ params }) => {
  const lang = params.lang as Language;

  return {
    latestLife: postsOf(lang, "life").slice(0, 3).map(toListItem),
    latestTech: postsOf(lang, "posts").slice(0, 3).map(toListItem),
  };
};
