import { siteStats } from "$lib/content";
import type { LayoutServerLoad } from "./$types";

// Every page, the error page included, gets these through the root layout, so
// the shell never imports $lib/content and ships the content JSON to the
// browser.
export const load: LayoutServerLoad = () => ({
  stats: siteStats(),
  builtAt: __BUILD_TIME__,
});
