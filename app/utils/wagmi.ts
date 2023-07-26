import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import {
  braveWallet,
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import type { Chain, ChainProviderFn } from "wagmi";
import { configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { APP_NAME } from "~/const";

export const createWagmiConfig = (
  enabledChains: Chain[],
  providers: ChainProviderFn<Chain>[],
  projectId: string
) => {
  const { chains, publicClient } = configureChains(enabledChains, [
    ...providers,
    publicProvider(),
  ]);

  const connectors = connectorsForWallets([
    {
      groupName: "Popular",
      wallets: [
        injectedWallet({ chains }),
        metaMaskWallet({ chains, projectId }),
        rainbowWallet({ chains, projectId }),
        coinbaseWallet({ appName: APP_NAME, chains }),
        walletConnectWallet({ chains, projectId }),
        braveWallet({ chains }),
        trustWallet({
          projectId,
          chains,
        }),
        ledgerWallet({
          projectId,
          chains,
        }),
      ],
    },
    {
      groupName: "Multisig",
      wallets: [safeWallet({ chains })],
    },
  ]);

  return {
    chains,
    config: createConfig({
      autoConnect: true,
      connectors,
      publicClient,
    }),
  };
};
