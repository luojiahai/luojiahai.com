import { useGroupsOf } from "$lib/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ params }) => {
  const { lang } = params;

  return {
    groups: useGroupsOf(lang),
  };
};
