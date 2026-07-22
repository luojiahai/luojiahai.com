import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type PluginOption } from "vite";

/**
 * Runs velite to turn `content/` into JSON under `.velite` (watching in dev).
 * The generated data is imported through the `#velite` alias.
 */
const VELITE_STARTED = Symbol.for("luojiahai.velite-started");

function velite(): PluginOption {
  return {
    name: "velite",
    async configResolved(config) {
      // SvelteKit builds multiple environments with fresh plugin instances;
      // guard globally so velite only runs once per process.
      const globals = globalThis as Record<symbol, boolean>;
      if (globals[VELITE_STARTED]) return;
      globals[VELITE_STARTED] = true;

      const { build } = await import("velite");
      await build({ watch: config.command === "serve", clean: true });
    },
  };
}

export default defineConfig({
  plugins: [velite(), tailwindcss(), sveltekit()],
});
