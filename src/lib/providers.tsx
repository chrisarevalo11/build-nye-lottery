"use client";

import { projectId, wagmiConfig } from "@/lib/wagmi";
import { isServer } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { useTheme } from "next-themes";
import { useLayoutEffect, type ReactNode } from "react";
import { type State } from "wagmi";
import { hashFn } from "wagmi/query";

import {
  DynamicContextProvider,
  DynamicWidget,
} from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import {
  WagmiProvider,
} from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


if (!projectId) throw new Error("WalletConnect Project ID is not defined");

const web3Modal = createWeb3Modal({
  allowUnsupportedChain: false,
  wagmiConfig,
  projectId,
  enableAnalytics: false,
  enableSwaps: false,
  enableOnramp: false,
});

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: hashFn,
        retry: false,
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function Providers({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState: State | undefined;
}) {
  const queryClient = getQueryClient();

  const { resolvedTheme } = useTheme();

  useLayoutEffect(() => {
    if (resolvedTheme !== undefined) {
      web3Modal.setThemeMode("dark" === resolvedTheme ? "dark" : "light");
    }
  }, [resolvedTheme]);

  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID || 'df1e11b9-2518-432d-8952-55069ca46ce3',
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <WagmiProvider config={wagmiConfig} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            {children}
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}