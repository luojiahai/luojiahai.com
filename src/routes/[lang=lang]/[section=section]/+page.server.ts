import { categoriesOf, postsOf, toListItem, type Section } from "$lib/content";
import type { Language } from "$lib/dictionaries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ params }) => {
  const lang = params.lang as Language;
  const section = params.section as Section;

  return {
    section,
    posts: postsOf(lang, section).map(toListItem),
    categories: categoriesOf(section).map((category) => ({
      slug: category.slug,
      name: category.name,
      permalink: category.permalink,
      count: category.count,
    })),
  };
};
