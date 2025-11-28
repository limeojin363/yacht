import { Game, getInitialDataPart } from "@yacht/game-core";
import { createContext } from "react";

export type GameContextValues = {
  game: Game;
  onClickCell: (handName: string, playerName: string) => void;
  onClickDice: (diceIndex: number) => void;
  onClickRoll: () => void;
  onExit: () => void;
};

export const GameContext = createContext<GameContextValues>({
  game: new Game(
    getInitialDataPart({ playerNames: ["PLAYER_1", "PLAYER_2"] })
  ),
  onClickCell: () => {},
  onClickDice: () => {},
  onClickRoll: () => {},
  onExit: () => {},
});
