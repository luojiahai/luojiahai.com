import { error } from "@sveltejs/kit";
import { findPage } from "$lib/content";
import type { Language } from "$lib/dictionaries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const lang = params.lang as Language;

  const about = findPage(lang, "about");
  if (!about) error(404, "Page not found");

  return { about };
};
