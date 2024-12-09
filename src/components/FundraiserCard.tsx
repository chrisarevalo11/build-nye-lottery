import type { ReactNode } from "react";
import type { Address } from "viem";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Amount } from "./Amount";
import { PRIZE_TOKEN_DECIMALS, PRIZE_TOKEN_TICKER } from "@/config";
import { FundingProgress } from "./FundingProgress";
import { Button } from "./ui/button";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FundraiserCard({
  title,
  description,
  targetAmount,
  address,
  isActive,
  onClick,
}: {
  title: string;
  description?: ReactNode;
  targetAmount?: bigint;
  address: Address;
  isActive: boolean;
  onClick: () => void;
}) {
  // const { prizeToken } = useGameConfig();
  // const { data: balance } = useReadContract({
  //   address: prizeToken,
  //   abi: erc20Abi,
  //   functionName: "balanceOf",
  //   args: [address],
  // });

  return (
    <Card className="sm:col-span-3">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {!!description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground">
          <span className="font-semibold text-card-foreground">
            <Amount value={0n} decimals={PRIZE_TOKEN_DECIMALS} />
          </span>{" "}
          {!!targetAmount ? (
            <>
              of <Amount value={targetAmount} decimals={PRIZE_TOKEN_DECIMALS} />{" "}
              {PRIZE_TOKEN_TICKER}
            </>
          ) : (
            <>{PRIZE_TOKEN_TICKER} raised</>
          )}
        </div>

        {!!targetAmount && (
          <FundingProgress amount={0n} target={targetAmount} />
        )}
      </CardContent>
      <CardFooter>
        <Button
          size="lg"
          disabled={isActive}
          className={cn("w-full", isActive && "opacity-50")}
          type="button"
          onClick={onClick}
        >
          {isActive ? (
            <>
              <CheckIcon size="1em" className="mr-1" /> Selected
            </>
          ) : (
            "Select to fund"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
