import type { Env, EnvVar } from "~/types";

export {};

declare global {
  /**
   * To make typescript stop complaining when trying to access window.env
   */
  interface Window {
    env: {
      [key in EnvVar]: string;
    };
  }

  namespace NodeJS {
    /**
     * Extend process.env with our custom environment variables.
     */
    interface ProcessEnv extends Env {
      NODE_ENV: "development" | "production" | "test";
      PORT: string;
    }
  }
}
