export type CloudFlareEnvVar = "ALCHEMY_KEY" | "NODE_ENV" | "EXCHANGE_ENDPOINT";

export type CloudFlareEnv = {
  [key in CloudFlareEnvVar]: string;
};

export type Optional<T> = T | undefined;
