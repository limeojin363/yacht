import { useState } from "react";
import GameComponent from "../../../../../components/games/AlteredGame";
import type { GameContextValues } from "../../../../../components/games/AlteredGame/context";
import { Game, getInitialDataPart } from "@yacht/game-core";

const useProps = (totalPlayersNum: number): GameContextValues => {
  const playerNames = Array.from(
    { length: totalPlayersNum },
    (_, i) => `Player ${i + 1}`
  );

  const [gameStatus, setGameStatus] = useState(
    new Game(
      getInitialDataPart({
        playerNames,
        alterOptionMetaList: [
          { name: "HOLDING_LIMIT_1", revealed: false, time: 2 },
        ],
      })
    )
  );

  // useEffect(() => {
  //   console.log(gameStatus);
  // }, [gameStatus]);

  return {
    game: gameStatus,
    onClickCell: (handName) => {
      gameStatus.enterUserHandInput({
        handName,
        eyes: gameStatus.extractDiceEyes(),
      });
      setGameStatus(gameStatus.getShallowClone());
    },
    onClickDice: (diceIndex) => {
      if (!gameStatus.isDiceSetUsable())
        throw new Error("Dice set is not usable");

      gameStatus.toggleDice(diceIndex);

      setGameStatus(gameStatus.getShallowClone());
    },
    onClickRoll: () => {
      console.log("onClickRoll");

      if (!gameStatus.hasMoreRoll()) throw new Error("No more roll");
      gameStatus.diceSet = gameStatus.generateNextDiceSet();
      gameStatus.remainingRoll = gameStatus.remainingRoll - 1;

      setGameStatus(gameStatus.getShallowClone());
    },
    onExit: () => {},
  };
};

const AlteredGame_SingleDevice = () => {
  const props = useProps(2);
  return <GameComponent {...props} />;
};

export default AlteredGame_SingleDevice;
