import type { TotalPlayers } from "common/default-game";
import { useState } from "react";
import GameRootComponent from "./components/GameRoot";

const DefaultGame_SingleDevice = () => {
  const [tp, setTp] = useState<TotalPlayers | null>(null);

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
