import { postsOf, projectsOf, toListItem } from "$lib/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ params }) => {
  const { lang } = params;

  return {
    latestPosts: postsOf(lang).slice(0, 5).map(toListItem),
    projects: projectsOf(lang).slice(0, 3),
  };
};
