import { useCurrentGame } from "@/hooks/useCurrentGame";
import { useGameData } from "@/hooks/useGameData";
import Countdown, { type CountdownRendererFn } from "react-countdown";
import { Amount } from "./Amount";
import { PRIZE_TOKEN_DECIMALS, PRIZE_TOKEN_TICKER } from "@/config";

export default function LotteryCountdown() {
  const { gameId } = useCurrentGame();
  const { jackpot } = useGameData({ gameId });

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h2 className="text-xl font-semibold">Jackpot</h2>
      <p className="font-pixel">
        <span className="text-3xl font-extrabold sm:text-5xl">
          <Amount value={jackpot} decimals={PRIZE_TOKEN_DECIMALS} />
        </span>
        <span>{PRIZE_TOKEN_TICKER}</span>
      </p>
    </div>
  );
}
