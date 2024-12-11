import { CHAIN, CONTRACT_ADDRESS } from "@/config";
import { extractErrorMessages, handleTransactionError } from "@/lib/error";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { erc20Abi, type Address } from "viem";
import {
  useBalance,
  usePublicClient,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export function useBalanceWithAllowance({
  address,
  token,
  onAllowanceUpdated,
}: {
  address?: Address;
  token?: Address;
  onAllowanceUpdated?: () => void;
}) {
  const client = usePublicClient();
  const { primaryWallet } = useDynamicContext();

  const [hash, setHash] = useState<Address | undefined>();

  const { data: tokenBalanceData, refetch } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        abi: erc20Abi,
        address: token,
        functionName: "balanceOf",
        args: [address!],
      },
      {
        abi: erc20Abi,
        address: token,
        functionName: "allowance",
        args: [address!, CONTRACT_ADDRESS],
      },
    ],
  });

  const { isPending, mutateAsync: increaseAllowance } = useMutation({
    async mutationFn({ amount }: { amount: bigint }) {
      if (!primaryWallet || !isEthereumWallet(primaryWallet)) return null;
      if (!address || !token) return;

      const walletClient = await primaryWallet.getWalletClient();

      try {
        const hash = await walletClient.writeContract({
          chain: CHAIN,
          type: "eip1559",
          abi: erc20Abi,
          address: token,
          functionName: "approve",
          args: [CONTRACT_ADDRESS, amount],
        });

        setHash(hash);

        toast.promise(async () => client?.waitForTransactionReceipt({ hash }), {
          loading: "Waiting for confirmation…",
          action: {
            label: "Explorer",
            onClick(e) {
              e.preventDefault();
              window.open(
                `${CHAIN.blockExplorers.default.url}/tx/${hash}`,
                "_blank",
              );
            },
          },
          success: "Allowance updated successfully",
          error(error) {
            const { message } = extractErrorMessages(error);
            return message;
          },
          finally() {
            refetch();
            onAllowanceUpdated?.();
          },
        });

        return hash;
      } catch (error) {
        handleTransactionError(error);
      }
    },
  });

  const { isFetching: isWaitingForConfirmation, data } =
    useWaitForTransactionReceipt({
      hash,
    });

  const [tokenBalance, allowance] = tokenBalanceData ?? [];

  const balance = tokenBalance ?? 0n;

  return {
    balance,
    allowance,
    increaseAllowance,
    isPendingAllowance: isPending || isWaitingForConfirmation,
    refetch,
  };
}
