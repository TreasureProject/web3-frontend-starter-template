export type EnvVar =
  | "PUBLIC_ALCHEMY_KEY"
  | "PUBLIC_NODE_ENV"
  | "PUBLIC_ENABLE_TESTNETS"
  | "EXCHANGE_ENDPOINT";

export type Env = {
  [key in EnvVar]: string;
};

export type Optional<T> = T | undefined;
