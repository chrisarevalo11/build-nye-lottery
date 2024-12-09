import { CHAIN, METADATA } from "@/config";
import { transport } from "@/lib/chain";
import { createClient } from "viem";
import { baseSepolia, mainnet, scrollSepolia } from "viem/chains";
import { cookieStorage, createConfig, createStorage, http } from "wagmi";

export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;
if (!projectId) throw new Error("WalletConnect Project ID is not defined");

const metadata = {
  name: METADATA.name,
  description: METADATA.description,
  url: METADATA.url,
  icons: [METADATA.icon],
};

const chains = [CHAIN] as const;

export const wagmiConfig = createConfig({
  chains,
  ssr: true,
  transports: {
    [CHAIN.id]: transport,
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
});

export const ensConfig = createConfig({
  chains: [scrollSepolia, baseSepolia],
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
});
