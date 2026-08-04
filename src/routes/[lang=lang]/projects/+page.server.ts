import { flyOf, projectsOf } from "$lib/content";
import type { Language } from "$lib/dictionaries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ params }) => {
  const lang = params.lang as Language;

  return {
    projects: projectsOf(lang),
    fly: flyOf(lang),
  };
};
