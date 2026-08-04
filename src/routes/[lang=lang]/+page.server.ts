import { postsOf, toListItem } from "$lib/content";
import type { Language } from "$lib/dictionaries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ params }) => {
  const lang = params.lang as Language;

  return {
    latestPosts: postsOf(lang).slice(0, 5).map(toListItem),
  };
};
