import { formatEther } from "viem";

export function makeBridgeUrl(amount: bigint) {
  return `https://relay.link/bridge/scroll?fromChainId=1&amount=${formatEther(amount)}&currency=eth&tradeType=EXACT_OUTPUT&lockToChain=true&lockCurrency=true`;
}
