import { APP_URL } from "@/lib/host";
import { type Address } from "viem";
import { scroll } from "viem/chains";

// Project metadata
export const METADATA = {
  name: "BUILD NYE Lottery",
  title: null,
  description: "Lottery for celebrating BUILD becoming a public good in 2025.",
  url: APP_URL,
  icon: `${APP_URL}/images/icon.svg`,
  logo: `/images/logo.svg`,
  bannerImage: "/images/banner.png",
  longDescription:
    "Celebrate BUILD becoming a public good with the BUILD NYE Lottery – a week of daily on-chain lotteries supporting global communities and rewarding Builders. Join the fun, win big, and make a difference this holiday season!",
};

// The chain where your lottery contract is deployed
export const CHAIN = scroll;

// The ticker of the prize token. Will be used when rendering prizes.
export const PRIZE_TOKEN_TICKER = "ETH";
export const PRIZE_TOKEN_DECIMALS = 18;
// If true the user will pay with native tokens via the ETH adapter,
// otherwise they will pay with the ERC20 token directly
export const PRIZE_TOKEN_IS_NATIVE = true;

// The contract address of the lottery
export const CONTRACT_ADDRESS: Address =
  "0xD14E428C78C9dA280028C462aA3E5D2e3105497B";

// The address of the ETH adapter contract
export const LOOTERY_ETH_ADAPTER_ADDRESS: Address =
  "0x51A60D80Fa6d5FEDeb87E615Ed1D41661CB42A69";

// The URL of the GraphQL API to get ticket data
export const GRAPHQL_API =
  "https://zuzalotto-indexer-production.up.railway.app";

// The amount of money you're trying to raise.
// It will show a progress bar inside of the "funds raised" card.
// Set to null to disable the progress bar
export const FUNDRAISE_TARGET: bigint | null = null;
