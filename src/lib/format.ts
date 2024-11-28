import type { Address } from "viem";

export function formatAddress(address?: Address) {
  if (!address) return null;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
