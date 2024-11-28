import { PRIZE_TOKEN_DECIMALS } from "@/config";
import type { ReactNode } from "react";
import { parseUnits, type Address } from "viem";

interface Fundraiser {
  title: string;
  address: Address;
  description?: ReactNode;
  targetAmount?: bigint;
}

export const FUNDRAISERS: Fundraiser[] = [
  {
    title: "LottoPGF Support",
    description: "Support development of the LottoPGF project!",
    targetAmount: parseUnits("0.42069", PRIZE_TOKEN_DECIMALS),
    address: "0xF9FCDf64160087Ac1610bB1366750D55043ef206",
  },
];
