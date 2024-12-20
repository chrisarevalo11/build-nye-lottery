"use client";

import { LOOTERY_ABI } from "@/abi/Lootery";
import { Amount } from "@/components/Amount";
import { FundingProgress } from "@/components/FundingProgress";
import { NumberPicker } from "@/components/NumberPicker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  CHAIN,
  CONTRACT_ADDRESS,
  PRIZE_TOKEN_DECIMALS,
  PRIZE_TOKEN_TICKER,
} from "@/config";
import { FUNDRAISERS } from "@/fundraisers";
import { useBalanceWithAllowance } from "@/hooks/useBalanceWithAllowance";
import { GameState, useCurrentGame } from "@/hooks/useCurrentGame";
import { useGameConfig } from "@/hooks/useGameConfig";
import { useGameData } from "@/hooks/useGameData";
import { useTickets } from "@/hooks/useTickets";
import { makeBridgeUrl } from "@/lib/bridge";
import { extractErrorMessages, handleTransactionError } from "@/lib/error";
import { getRandomPicks } from "@/lib/random";
import { cn } from "@/lib/utils";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  CheckIcon,
  DicesIcon,
  Loader2Icon,
  PlusIcon,
  WalletMinimalIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  array,
  check,
  minLength,
  number,
  object,
  optional,
  pipe,
  set,
  size,
  string,
  transform,
  type InferOutput,
} from "valibot";
import {
  erc20Abi,
  getAddress,
  isAddress,
  isAddressEqual,
  parseEther,
  zeroAddress,
  type Address,
  type Hex,
} from "viem";
import { usePublicClient } from "wagmi";
import FundraiserCard from "./FundraiserCard";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { motion } from "motion/react";
import Link from "next/link";
import LotteryCountdown from "./LotteryCountdown";
import Jackpot from "./Jackpot";

const makeFieldSchema = (numbersCount: number) =>
  object({
    recipient: pipe(
      string(),
      check((value) => isAddress(value)),
      transform((value) => getAddress(value)),
    ),
    tickets: pipe(
      array(
        object({
          numbers: pipe(
            set(number()),
            size(numbersCount, `You have to select ${numbersCount} numbers.`),
          ),
          recipient: optional(
            pipe(
              string(),
              check(
                (value) => isAddress(value),
                "Please enter a valid ethereum address",
              ),
              transform((value) => getAddress(value)),
            ),
          ),
        }),
      ),
      minLength(1, "You must select at least 1 ticket."),
    ),
  });

export type TicketPurchaseFields = InferOutput<
  ReturnType<typeof makeFieldSchema>
>;

export function TicketPurchase({ onPurchase }: { onPurchase?: () => void }) {
  const client = usePublicClient();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const addTicketRef = useRef<HTMLButtonElement>(null);

  const { primaryWallet } = useDynamicContext();
  const { gameId, gameState } = useCurrentGame();
  const { isActive, accruedCommunityFees } = useGameData({ gameId });
  const { pickLength, maxBallValue, ticketPrice, prizeToken } = useGameConfig();
  // const { refetch: refetchTickets } = useTickets({
  //   address: primaryWallet?.address as Address,
  //   gameId,
  // });

  const {
    balance,
    allowance,
    increaseAllowance,
    refetch: refetchAllowance,
    isPendingAllowance,
  } = useBalanceWithAllowance({
    address: primaryWallet?.address as Address,
    token: prizeToken,
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, isValid },
    reset,
  } = useForm<TicketPurchaseFields>({
    defaultValues: {
      tickets: [{ numbers: new Set() }],
      recipient: zeroAddress,
    },
    resolver: valibotResolver(makeFieldSchema(pickLength)),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tickets",
  });

  const [isConfirming, setIsConfirming] = useState(false);

  const tickets = useWatch({ name: "tickets", control });
  const recipient = useWatch({ name: "recipient", control });

  const isLoading = isSubmitting || isConfirming || isPendingAllowance;

  const totalPrice = ticketPrice * BigInt(tickets.length);

  const hasEnoughBalance = !!balance && balance >= totalPrice;
  const hasEnoughAllowance = !!allowance && allowance >= totalPrice;

  function onPurchaseComplete() {
    // setTimeout(() => refetchTickets(), 2000);
    refetchAllowance();
    reset();
    onPurchase?.();
  }

  async function onSubmit(fields: TicketPurchaseFields) {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) return null;
    if (!fields.tickets.length) return;

    try {
      let hash: Hex;

      const picks = fields.tickets.map(({ numbers, recipient }) => ({
        whomst: recipient ?? (primaryWallet.address as Address),
        pick: [...numbers].sort((a, b) => a - b),
      }));

      if (!hasEnoughAllowance) return;

      const walletClient = await primaryWallet.getWalletClient();
      setIsConfirming(true);

      hash = await walletClient.writeContract({
        chain: CHAIN,
        type: "eip1559",
        abi: LOOTERY_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "purchase",
        args: [picks, fields.recipient],
      });

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
        success: "Tickets have been purchased!",
        error(error) {
          const { message } = extractErrorMessages(error);
          return message;
        },
        finally: () => {
          setIsConfirming(false);
          onPurchaseComplete();
        },
      });
    } catch (error) {
      setIsConfirming(false);
      handleTransactionError(error);
    }
  }

  function scrollToLastItem() {
    setTimeout(() => {
      if (tickets.length > 1 && scrollAreaRef.current && addTicketRef.current) {
        scrollAreaRef.current.scrollLeft +=
          addTicketRef.current.offsetWidth +
          (addTicketRef.current.parentElement
            ? parseFloat(
                getComputedStyle(addTicketRef.current.parentElement).gap,
              )
            : 0);
      }
    });
  }

  function pickShortcut(amount: number) {
    setValue(
      "tickets",
      Array.from({ length: amount }, () => ({
        numbers: getRandomPicks(pickLength, maxBallValue),
      })),
    );
  }

  if (gameState === GameState.DrawPending) {
    return <p>Draw is pending</p>;
  }

  if (!isActive) {
    return <p>Game is not active.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset
        className="min-w-0 space-y-14"
        disabled={!isActive || isLoading}
      >
        <section className="flex items-center justify-around">
          <LotteryCountdown />
          <Jackpot />
        </section>

        <section id="cause" className="space-y-6">
          <header className="space-y-2">
            <h2 className="scroll-m-20 font-pixel text-2xl font-semibold first:mt-0 sm:text-3xl">
              Select a cause to fund
            </h2>
            <p>
              Select a fundraiser you want to support or contribute to the
              collective Fund.
            </p>
          </header>

          <div className="grid gap-6 sm:grid-cols-6">
            <Card className="text-background sm:col-span-3">
              <CardHeader className="h-full">
                <div className="items- flex h-full flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <CardTitle className="text-lg">Collective Fund</CardTitle>
                      <CardDescription>
                        Managed by the lottery organizer
                      </CardDescription>
                    </div>
                    <p>
                      <span className="font-semibold">
                        <Amount
                          value={accruedCommunityFees}
                          decimals={PRIZE_TOKEN_DECIMALS}
                        />
                      </span>{" "}
                      ETH raised
                    </p>
                  </div>

                  <div>
                    <Button
                      size="lg"
                      disabled={isAddressEqual(zeroAddress, recipient)}
                      className={cn(
                        "w-full",
                        isAddressEqual(zeroAddress, recipient) && "opacity-50",
                      )}
                      type="button"
                      onClick={() => setValue("recipient", zeroAddress)}
                    >
                      {isAddressEqual(zeroAddress, recipient) ? (
                        <>
                          <CheckIcon size="1em" className="mr-1" /> Selected
                        </>
                      ) : (
                        "Select to fund"
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
            {FUNDRAISERS.map((fundraiser, i) => {
              return (
                <FundraiserCard
                  key={i}
                  title={fundraiser.title}
                  description={fundraiser.description}
                  targetAmount={fundraiser.targetAmount}
                  address={fundraiser.address}
                  isActive={isAddressEqual(fundraiser.address, recipient)}
                  onClick={() => setValue("recipient", fundraiser.address)}
                />
              );
            })}
          </div>
        </section>

        <section id="numbers" className="space-y-4">
          <header className="space-y-2">
            <h2 className="scroll-m-20 font-pixel text-2xl font-semibold first:mt-0 sm:text-3xl">
              Pick your numbers
            </h2>
            <p>Make your picks.</p>
          </header>
          <ScrollArea
            viewportRef={scrollAreaRef}
            viewportClassName="overscroll scroll-smooth"
            className="mb-14 ml-[50%] w-[100vw] -translate-x-1/2"
          >
            <div className="mx-auto w-full max-w-[48.875rem] px-4">
              <div className="flex gap-6">
                {fields.map((field, index) => (
                  <fieldset
                    className="w-full max-w-[280px] flex-shrink-0 sm:max-w-[322px] md:max-w-[calc(50%-.75rem)]"
                    key={field.id}
                  >
                    <NumberPicker
                      index={index}
                      name={`tickets.${index}`}
                      onRemove={fields.length > 1 ? remove : undefined}
                      control={control}
                    />
                  </fieldset>
                ))}
                <button
                  type="button"
                  ref={addTicketRef}
                  onClick={() => {
                    append([{ numbers: new Set() }]);
                    scrollToLastItem();
                  }}
                  className="flex w-full max-w-[280px] flex-shrink-0 flex-col items-center justify-center gap-2 border-2 border-dashed border-black/15 bg-black/10 sm:max-w-[322px] md:max-w-[calc(50%-.75rem)]"
                >
                  <PlusIcon className="size-6" />
                  <p className="text-lg">Add a ticket</p>
                </button>
                <div>&nbsp;</div>
              </div>
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
          <div className="space-y-2">
            <p className="text-sm">Shortcuts</p>
            <div className="flex flex-col gap-2 overflow-x-auto sm:flex-row">
              <Button
                type="button"
                variant="white"
                className="gap-2"
                onClick={() => pickShortcut(5)}
              >
                <DicesIcon size="1em" /> Pick 5 random tickets
              </Button>
              <Button
                type="button"
                variant="white"
                className="gap-2"
                onClick={() => pickShortcut(10)}
              >
                <DicesIcon size="1em" /> Pick 10 random tickets
              </Button>
            </div>
          </div>
        </section>

        <section id="purchase" className="space-y-6 pb-10">
          <header className="space-y-2">
            <h2 className="scroll-m-20 font-pixel text-2xl font-semibold first:mt-0 sm:text-3xl">
              Checkout
            </h2>
            <p>Buy your tickets and contribute.</p>
          </header>
          {!isValid ? (
            <p className="text-center">
              Please complete your ticket selection to process your order.
            </p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Order summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex w-full items-center justify-between gap-2">
                    <p className="">
                      {tickets.length}{" "}
                      {tickets.length === 1 ? "ticket" : "tickets"}
                    </p>
                    <div className="mt-2 h-1 grow border-b-2 border-dashed border-background" />
                    <p>
                      <Amount
                        value={totalPrice}
                        decimals={PRIZE_TOKEN_DECIMALS}
                      />{" "}
                      {PRIZE_TOKEN_TICKER}
                    </p>
                  </div>
                  <div className="mt-5 flex justify-end gap-2 text-lg font-semibold">
                    <p>Total: </p>
                    <p>
                      <Amount
                        value={totalPrice}
                        decimals={PRIZE_TOKEN_DECIMALS}
                      />{" "}
                      {PRIZE_TOKEN_TICKER}
                    </p>
                  </div>
                  <div className="mt-5 flex flex-col items-center justify-between gap-2 sm:flex-row">
                    {!primaryWallet?.isAuthenticated ? (
                      <>
                        <p className="">
                          Connect wallet to purchase {tickets.length}{" "}
                          {tickets.length === 1 ? "ticket" : "tickets"}.
                        </p>
                        <DynamicWidget />
                      </>
                    ) : hasEnoughBalance ? (
                      <div className="flex w-full justify-end">
                        {hasEnoughAllowance ? (
                          <Button disabled={!hasEnoughBalance}>
                            {isLoading && (
                              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            )}{" "}
                            Buy {tickets.length}{" "}
                            {tickets.length === 1 ? "ticket" : "tickets"}
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            onClick={() =>
                              increaseAllowance({ amount: totalPrice })
                            }
                            disabled={!totalPrice || !hasEnoughBalance}
                          >
                            {isPendingAllowance && (
                              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            )}{" "}
                            Allow spending {PRIZE_TOKEN_TICKER}
                          </Button>
                        )}
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="text-center text-muted-foreground sm:text-left">
                            You don&apos;t enough balance.
                          </p>
                          <p className="flex gap-1">
                            <span className="font-semibold">Needed:</span>
                            <Amount
                              value={totalPrice}
                              decimals={PRIZE_TOKEN_DECIMALS}
                            />{" "}
                            {PRIZE_TOKEN_TICKER}.
                          </p>
                          <p className="flex gap-1">
                            <span className="font-semibold">Balance:</span>
                            <Amount
                              value={balance!}
                              decimals={PRIZE_TOKEN_DECIMALS}
                            />{" "}
                            {PRIZE_TOKEN_TICKER}
                          </p>
                        </div>{" "}
                        <div>
                          <Button asChild>
                            <Link
                              target="_blank"
                              href={makeBridgeUrl(BigInt(totalPrice))}
                            >
                              Swap {PRIZE_TOKEN_TICKER} using relay
                            </Link>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </section>
      </fieldset>
    </form>
  );
}
