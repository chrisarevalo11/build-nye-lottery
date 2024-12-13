import { formatEther } from "viem";

export function makeBridgeUrl(amount: bigint) {
  return `https://relay.link/bridge/base?amount=${formatEther(amount)}&tradeType=EXACT_OUTPUT`;
}
