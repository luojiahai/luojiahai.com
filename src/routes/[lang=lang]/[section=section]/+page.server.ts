import {
  categoriesOf,
  postsOf,
  sections,
  toListItem,
  type Section,
} from "$lib/content";
import { languages, type Language } from "$lib/dictionaries";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const entries: EntryGenerator = () =>
  languages.flatMap((lang) => sections.map((section) => ({ lang, section })));

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
