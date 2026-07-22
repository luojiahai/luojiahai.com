import type { Language } from "$lib/dictionaries";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ params }) => {
  return { lang: params.lang as Language };
};
