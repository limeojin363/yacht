import type { TotalPlayers } from "common/default-mode";
import { useState } from "react";
import Game from "./components/Game";

const DefaultMode_SingleDevice = () => {
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

  return <Game totalPlayers={tp} />
};

export default DefaultMode_SingleDevice;
