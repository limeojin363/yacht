import { Game, generateAlterOptions, getInitialDBPart } from "@yacht/game-core";
import { createContext } from "react";
import { generateRandomColor } from "../../../routes/_regardless-of-auth/single-device/default-game/-components";

export type GameContextValues = {
  game: Game;
  onClickCell: (handName: string, playerIdx: number) => void;
  onClickDice: (diceIndex: number) => void;
  onClickRoll: () => void;
  onExit: () => void;
};

export const GameContext = createContext<GameContextValues>({
  game: new Game(
    getInitialDBPart({
      alterOptionMetaList: generateAlterOptions(),
      playerPresetList: [
        { name: "Player 1", color: generateRandomColor() },
        { name: "Player 2", color: generateRandomColor() },
      ],
    })
  ),
  onClickCell: () => {},
  onClickDice: () => {},
  onClickRoll: () => {},
  onExit: () => {},
});
