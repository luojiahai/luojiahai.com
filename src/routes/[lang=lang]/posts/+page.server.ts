import { categories, postsOf, toListItem } from "$lib/content";
import { languages, type Language } from "$lib/dictionaries";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const entries: EntryGenerator = () => languages.map((lang) => ({ lang }));

export const load: PageServerLoad = ({ params }) => {
  const lang = params.lang as Language;

  return {
    posts: postsOf(lang).map(toListItem),
    categories: categories.map((category) => ({
      slug: category.slug,
      name: category.name,
      permalink: category.permalink,
      count: category.count,
    })),
  };
};
