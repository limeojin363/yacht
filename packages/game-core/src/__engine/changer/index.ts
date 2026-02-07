import type { GameState } from "../gameState/schema/gameState.js";

export type ChangerDefinition = {
  id: string;
  description: string;
  dependencies?: string[];
  effectOnState: (state: GameState) => void;
};
