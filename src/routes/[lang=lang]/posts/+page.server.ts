import { categories, postsOf, toListItem } from "$lib/content";
import { languages } from "$lib/dictionaries";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const entries: EntryGenerator = () => languages.map((lang) => ({ lang }));

export const load: PageServerLoad = ({ params }) => {
  const { lang } = params;

  return {
    posts: postsOf(lang).map(toListItem),
    categories,
  };
};
