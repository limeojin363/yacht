import { GameStatus, getInitialDataPart } from "@yacht/altered-game";
import { createContext } from "react";

export type GameContextValues = {
  gameStatus: GameStatus;
  onClickCell: (handName: string, playerId: number) => void;
  onClickDice: (diceIndex: number) => void;
  onClickRoll: () => void;
  onExit: () => void;
};

export const GameContext = createContext<GameContextValues>({
  gameStatus: new GameStatus(
    getInitialDataPart({ playerNames: ["PLAYER_1", "PLAYER_2"] })
  ),
  onClickCell: () => {},
  onClickDice: () => {},
  onClickRoll: () => {},
  onExit: () => {},
});