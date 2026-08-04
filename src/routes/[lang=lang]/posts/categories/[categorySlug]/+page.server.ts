import { error } from "@sveltejs/kit";
import { categories, findCategory, postsOf, toListItem } from "$lib/content";
import { languages } from "$lib/dictionaries";
import type { Language } from "$lib/dictionaries";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const entries: EntryGenerator = () =>
  categories.flatMap((category) =>
    languages.map((lang) => ({ lang, categorySlug: category.slug })),
  );

export const load: PageServerLoad = ({ params }) => {
  const lang = params.lang as Language;

  const category = findCategory(params.categorySlug);
  if (!category) error(404, "Category not found");

  return {
    category: {
      slug: category.slug,
      name: category.name,
      description: category.description,
      permalink: category.permalink,
    },
    posts: postsOf(lang, category.slug).map(toListItem),
  };
};
