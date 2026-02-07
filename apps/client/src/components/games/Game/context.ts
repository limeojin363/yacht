import type { GameViewData } from "@yacht/game-core";
import { createContext, useContext } from "react";

export type GameContextValue = GameViewData & { meIdx: number };

const GameContext = createContext<GameContextValue | null>(
  null,
);

export const GameProvider = GameContext.Provider;

export const useGameContext = () => {
  const ctx = useContext(GameContext);

  if (!ctx) {
    throw new Error("useGameContext must be used within a GameProvider");
  }

  return ctx;
};
