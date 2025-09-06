import { useState } from "react";
import GameRootComponent from "./components/GameRoot";
import type { TotalPlayersNum } from "@yacht/games/default";

const DefaultGame_SingleDevice = () => {
  const [tp, setTp] = useState<TotalPlayersNum | null>(null);

  if (!tp) return (
    <>
      {([2, 3, 4] as const).map((value) => (
        <div key={value} onClick={() => setTp(value)}>
            Select total players: {value}
        </div>
      ))}
    </>
  );

  return <GameRootComponent totalPlayers={tp} />
};

export default DefaultGame_SingleDevice;
