import { useState } from "react";
import GameComponent from "../../../../../components/games/AlteredGame";
import type { GameContextValues } from "../../../../../components/games/AlteredGame/context";
import { GameStatus, getInitialDataPart } from "@yacht/altered-game";

const useProps = (totalPlayersNum: number): GameContextValues => {
  const playerNames = Array.from(
    { length: totalPlayersNum },
    (_, i) => `Player ${i + 1}`
  );

  const [gameStatus, setGameStatus] = useState(
    new GameStatus(getInitialDataPart({ playerNames: playerNames }))
  );

  return {
    gameStatus,
    onClickCell: (handName) => {
      setGameStatus(
        gameStatus.dispatch({ type: "HAND-SELECT", payload: handName })
      );
    },
    onClickDice: (diceIndex) => {
      setGameStatus(
        gameStatus.dispatch({ type: "TOGGLE-HOLDING", payload: diceIndex })
      );
    },
    onClickRoll: () => {
      setGameStatus(
        gameStatus.dispatch({
          type: "ROLL",
          payload: gameStatus.generateNextDiceSet(),
        })
      );
    },
    onExit: () => {},
  };
};

const AlteredGame_SingleDevice = () => {
  const props = useProps(2);
  return <GameComponent {...props} />;
};

export default AlteredGame_SingleDevice;
