import type { CloudFlareEnv, CloudFlareEnvVar, Optional } from "~/types";

const isBrowser = typeof document !== "undefined";

/**
 * Convenience method for getting environment variables no matter
 * where you are, be it on the remix server in dev, served from cloudflare
 * or running in the browser.
 *
 * For `window.env`, please consult the render method in root.tsx for details.
 */
const getEnvVariable = (
  name: CloudFlareEnvVar,
  env: Optional<CloudFlareEnv> = undefined
): string => {
  return isBrowser ? window.env[name] : env?.[name] ?? "";
};

export { getEnvVariable };
