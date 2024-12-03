import { CHAIN, METADATA } from "@/config";
import { transport } from "@/lib/chain";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
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

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  transports: {
    [CHAIN.id]: transport,
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
  auth: {
    email: false,
    socials: [],
  },
});

export const ensConfig = createConfig({
  chains: [scrollSepolia,baseSepolia],
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
});
