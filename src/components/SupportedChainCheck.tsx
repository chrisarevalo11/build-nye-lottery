"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAccount, useDisconnect } from "wagmi";
import { Button } from "./ui/button";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { CHAIN } from "@/config";

export function SupportedChainCheck() {
  const { chainId: connectedChainId, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { primaryWallet } = useDynamicContext();

  const switchNetwork = async (chainId: number) => {
    if (primaryWallet?.connector.supportsNetworkSwitching()) {
      await primaryWallet.switchNetwork(chainId);
      console.log("Success! Network switched");
    }
  };

  const defaultChain = CHAIN;

  const isConnectedToUnsupportedChain =
    isConnected && CHAIN.id !== connectedChainId;

  return (
    <AlertDialog open={isConnectedToUnsupportedChain}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsupported Network</AlertDialogTitle>
          <AlertDialogDescription>
            Please connect to {defaultChain.name} to use this application. Note
            that some wallets like Rainbow might not support custom chains. In
            that case please use another wallet.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outlineWhite" onClick={() => disconnect()}>
            Disconnect
          </Button>
          <Button variant={"white"} onClick={() => switchNetwork(CHAIN.id)}>
            Connect to {defaultChain.name}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
