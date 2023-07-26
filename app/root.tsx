import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import rainbowStyles from "@rainbow-me/rainbowkit/styles.css";
import type { LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetchers,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import NProgress from "nprogress";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "sonner";
import { WagmiConfig } from "wagmi";
import { arbitrum, arbitrumGoerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";

import { APP_NAME } from "./const";
import nProgressStyles from "./styles/nprogress.css";
import styles from "./styles/tailwind.css";
import type { Env } from "./types";
import { createWagmiConfig } from "./utils/wagmi";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: nProgressStyles },
  { rel: "stylesheet", href: rainbowStyles },
];

export const meta: V2_MetaFunction = () => [
  { charSet: "utf-8" },
  { viewport: "width=device-width,initial-scale=1" },
  { title: APP_NAME },
];

const strictEntries = <T extends Record<string, any>>(
  object: T
): [keyof T, T[keyof T]][] => {
  return Object.entries(object);
};

function getPublicKeys(env: Env): Env {
  const publicKeys = {} as Env;
  for (const [key, value] of strictEntries(env)) {
    if (key.startsWith("PUBLIC_")) {
      publicKeys[key] = value;
    }
  }
  return publicKeys;
}

export const loader = async () => {
  return json({
    ENV: getPublicKeys(process.env),
  });
};

export default function App() {
  const { ENV } = useLoaderData<typeof loader>();

  const [{ chains, config: wagmiConfig }] = useState(() => {
    return createWagmiConfig(
      ENV.PUBLIC_ENABLE_TESTNETS === "true"
        ? [arbitrumGoerli, arbitrum]
        : [arbitrum],
      ENV.PUBLIC_ALCHEMY_KEY
        ? [alchemyProvider({ apiKey: ENV.PUBLIC_ALCHEMY_KEY })]
        : [],
      ENV.PUBLIC_WALLET_CONNECT_PROJECT_ID
    );
  });

  const transition = useTransition();
  const fetchers = useFetchers();
  const state = useMemo<"idle" | "loading">(
    function getGlobalState() {
      const states = [
        transition.state,
        ...fetchers.map((fetcher) => fetcher.state),
      ];
      if (states.every((state) => state === "idle")) return "idle";
      return "loading";
    },
    [transition.state, fetchers]
  );

  // slim loading bars on top of the page, for page transitions
  useEffect(() => {
    if (state === "loading") NProgress.start();
    if (state === "idle") NProgress.done();
  }, [state, transition.state]);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="antialiased">
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            <Outlet />
          </RainbowKitProvider>
        </WagmiConfig>
        <Toaster richColors />

        <Scripts />
        <ScrollRestoration />
        <LiveReload />
      </body>
    </html>
  );
}
