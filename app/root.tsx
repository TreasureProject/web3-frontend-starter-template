import { useMemo, useEffect, Fragment, useState } from "react";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useTransition,
  useFetchers,
  useLoaderData,
  ScrollRestoration,
} from "@remix-run/react";
import { resolveValue, Toaster } from "react-hot-toast";
import { mainnet, createClient, configureChains, WagmiConfig } from "wagmi";
import { optimism, arbitrum, polygon, arbitrumGoerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import {
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { trustWallet, ledgerWallet } from "@rainbow-me/rainbowkit/wallets";

import NProgress from "nprogress";

import { Transition } from "@headlessui/react";

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  SpinnerIcon,
} from "./components/Icons";

import rainbowStyles from "@rainbow-me/rainbowkit/styles.css";
import styles from "./styles/tailwind.css";
import nProgressStyles from "./styles/nprogress.css";

import type { Env } from "./types";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: nProgressStyles },
  { rel: "stylesheet", href: rainbowStyles },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Web3 Frontend Starter Template",
  viewport: "width=device-width,initial-scale=1",
});

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

  const [{ client, chains }] = useState(() => {
    const testChains =
      ENV.PUBLIC_ENABLE_TESTNETS === "true" ? [arbitrumGoerli] : [];

    const { chains, provider } = configureChains(
      // Configure this to chains you want
      [mainnet, optimism, polygon, arbitrum, ...testChains],
      [alchemyProvider({ apiKey: ENV.PUBLIC_ALCHEMY_KEY }), publicProvider()]
    );

    const { wallets } = getDefaultWallets({
      appName: "Template App",
      chains,
    });

    const connectors = connectorsForWallets([
      ...wallets,
      {
        groupName: "Others",
        wallets: [trustWallet({ chains }), ledgerWallet({ chains })],
      },
    ]);

    const client = createClient({
      autoConnect: true,
      connectors,
      provider,
    });

    return { client, chains };
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
        <WagmiConfig client={client}>
          <RainbowKitProvider chains={chains}>
            <Outlet />
          </RainbowKitProvider>
        </WagmiConfig>
        <Toaster position="bottom-left" reverseOrder={false} gutter={18}>
          {(t) => (
            <Transition
              show={t.visible}
              as={Fragment}
              enter="transform ease-out duration-300 transition"
              enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
              enterTo="translate-y-0 opacity-100 sm:translate-x-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="p-4">
                  <div className="flex items-center justify-center">
                    <div className="flex-shrink-0">
                      {(() => {
                        switch (t.type) {
                          case "success":
                            return (
                              <CheckCircleIcon className="h-6 w-6 text-green-500" />
                            );
                          case "error":
                            return (
                              <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
                            );
                          case "loading":
                            return (
                              <SpinnerIcon className="h-6 w-6 animate-spin fill-gray-800 text-yellow-500" />
                            );
                          default:
                            return (
                              <CheckCircleIcon className="h-6 w-6 text-yellow-500" />
                            );
                        }
                      })()}
                    </div>
                    <div className="ml-3 w-0 flex-1">
                      <div className="text-sm text-white">
                        {resolveValue(t.message, t)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          )}
        </Toaster>
        <Scripts />
        <ScrollRestoration />
        <LiveReload />
      </body>
    </html>
  );
}
