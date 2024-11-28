"use client";

import { Button } from "@/components/ui/button";
import { formatAddress } from "@/lib/format";
import { ensConfig } from "@/lib/wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useEnsName } from "wagmi";

export default function ConnectButton() {
  const { isConnected, address } = useAccount();
  const { data } = useEnsName({
    address,
    chainId: ensConfig.chains.at(0)?.id,
    config: ensConfig,
  });
  const { open } = useWeb3Modal();

  if (isConnected) {
    return (
      <Button size="sm" onClick={() => open()}>
        {data ? data : formatAddress(address)}
      </Button>
    );
  }
  return (
    <Button size="sm" onClick={() => open()}>
      Connect
    </Button>
  );
}
