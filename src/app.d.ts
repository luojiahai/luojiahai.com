// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
  /** When this build ran (ISO 8601), set by `define` in vite.config.ts. */
  const __BUILD_TIME__: string;

  namespace App {
    interface Platform {
      env?: {
        ASSETS: { fetch: typeof fetch };
        /** KV last-good cache for /api/social (optional in local dev). */
        SOCIAL_CACHE?: {
          get(key: string, type: "json"): Promise<unknown>;
          put(key: string, value: string): Promise<void>;
        };
      };
      context?: {
        waitUntil(promise: Promise<unknown>): void;
      };
      caches?: {
        default: {
          match(key: string | Request): Promise<Response | undefined>;
          put(key: string | Request, response: Response): Promise<void>;
        };
      };
    }
  }
}

export {};
