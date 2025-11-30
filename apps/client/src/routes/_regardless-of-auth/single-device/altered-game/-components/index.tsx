import GameComponent from "../../../../../components/games/Game";
import type { GameContextValues } from "../../../../../components/games/Game/context";
import { Game, generateAlterOptions, getInitialDBPart } from "@yacht/game-core";
import { generateRandomColor } from "../../default-game/-components";
import { useState } from "react";

const useProps = (totalPlayersNum: number): GameContextValues => {
  const [gameStatus, setGameStatus] = useState(
    new Game(
      getInitialDBPart({
        alterOptionMetaList: generateAlterOptions(),
        playerPresetList: Array.from({ length: totalPlayersNum }, (_, i) => ({
          name: `Player ${i + 1}`,
          color: generateRandomColor(),
        })),
      })
    )
  );

  return {
    game: gameStatus,
    onClickCell: (handName) => {
      setGameStatus((draft) => {
        return draft.enterUserHandInput({
          handName,
          eyes: draft.extractDiceEyes(),
        });
      });

      // gameStatus.enterUserHandInput({
      //   handName,
      //   eyes: gameStatus.extractDiceEyes(),
      // });
      // setGameStatus(gameStatus.getShallowClone());
    },
    onClickDice: (diceIndex) => {
      // if (!gameStatus.isDiceSetUsable())
      //   throw new Error("Dice set is not usable");

      // gameStatus.toggleDice(diceIndex);

      // setGameStatus(gameStatus.getShallowClone());
      setGameStatus((draft) => {
        if (!draft.isDiceSetUsable()) throw new Error("Dice set is not usable");

        return draft.toggleDice(diceIndex);
      });
    },
    onClickRoll: () => {
      // if (!gameStatus.hasMoreRoll()) throw new Error("No more roll");
      // gameStatus.diceSet = gameStatus.generateNextDiceSet();
      // gameStatus.remainingRoll = gameStatus.remainingRoll - 1;

      // setGameStatus(gameStatus.getShallowClone());

      setGameStatus((draft) => {
        if (!draft.hasMoreRoll()) throw new Error("No more roll");

        const rolledDiceSet = draft.generateRolledDiceSet();
        return draft.applyRolledDiceSet(rolledDiceSet);
      });
    },
    onExit: () => {},
  };
};

const AlteredGame_SingleDevice = () => {
  const props = useProps(2);
  return <GameComponent {...props} />;
};

export default AlteredGame_SingleDevice;
