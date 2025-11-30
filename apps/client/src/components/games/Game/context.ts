import { Game, getInitialDBPart } from "@yacht/game-core";
import { createContext } from "react";

export type GameContextValues = {
  game: Game;
  onClickCell: (handName: string, playerIdx: number) => void;
  onClickDice: (diceIndex: number) => void;
  onClickRoll: () => void;
  onExit: () => void;
};

const dummyGame = new Game(
  getInitialDBPart({
    alterOptionMetaList: [],
    playerPresetList: [],
  })
);

export const GameContext = createContext<GameContextValues>({
  game: dummyGame,
  onClickCell: () => {},
  onClickDice: () => {},
  onClickRoll: () => {},
  onExit: () => {},
});
