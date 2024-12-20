import { useCurrentGame } from "@/hooks/useCurrentGame";
import { useGameData } from "@/hooks/useGameData";
import Countdown, { type CountdownRendererFn } from "react-countdown";

export default function LotteryCountdown() {
  const { gameId } = useCurrentGame();
  const { roundEndTime } = useGameData({ gameId });

  const renderer: CountdownRendererFn = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }) => {
    return completed ? (
      <p className="font-pixel text-3xl font-extrabold uppercase sm:text-5xl">
        ended
      </p>
    ) : (
      <span className="font-pixel text-3xl font-extrabold tabular-nums sm:text-5xl">
        {days ? `${days.toString().padStart(2, "0")}d ` : ""}
        {hours ? `${hours.toString().padStart(2, "0")}h ` : ""}
        {minutes.toString().padStart(2, "0")}m{" "}
        {!days ? `${seconds.toString().padStart(2, "0")}s ` : ""}
      </span>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h2 className="text-xl font-semibold">Time left</h2>
      <Countdown renderer={renderer} date={Number(roundEndTime) * 1000} />
    </div>
  );
}
