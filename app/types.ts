export type EnvVar =
  | "API_URL"
  | "PUBLIC_ALCHEMY_KEY"
  | "PUBLIC_ENABLE_TESTNETS"
  | "PUBLIC_WALLET_CONNECT_PROJECT_ID";

export type Env = {
  [key in EnvVar]: string;
};

export type Optional<T> = T | undefined;
