import {
  categoriesOf,
  postsOf,
  sections,
  toListItem,
  type Section,
} from "$lib/content";
import { languages, type Language } from "$lib/dictionaries";
import type { EntryGenerator, PageServerLoad } from "./$types";

// The tech list now lives on the Work page, so nothing links to
// /{lang}/posts any more. Name the indexes so both stay prerendered; the
// posts one keeps its old URL alive and points its canonical at /work.
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
