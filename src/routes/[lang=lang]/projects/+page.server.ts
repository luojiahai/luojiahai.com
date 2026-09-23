import { flyOf, projectsOf } from "$lib/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ params }) => {
  const { lang } = params;

  return {
    projects: projectsOf(lang),
    fly: flyOf(lang),
  };
};
