import { CHAIN } from "@/config";
import { cookieStorage, createConfig, createStorage, http } from "wagmi";

export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;
if (!projectId) throw new Error("WalletConnect Project ID is not defined");

export const wagmiConfig = createConfig({
  chains: [CHAIN],
  ssr: true,
  transports: {
    [CHAIN.id]: http(),
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
});
