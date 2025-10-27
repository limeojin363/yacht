import type { DiceEyes } from "../status";

export type TableUIData = {
  rowNames: string[];
  playerColumns: PlayerColumn[];
  decorators: Decorator[];
};

type ScoreCellData = {
  diceEyes: DiceEyes[];
  score: number;
  label: string;
};

export type PlayerColumn = {
  [key in string]: ScoreCellData | null;
};

export type Decorator =
  | { type: "SINGLE-ROW"; color: "blue"; hand: string; label: string }
  | {
      type: "MULTIPLE-ROWS";
      color: "red";
      hand: string[];
      label: string;
    }
  | {
      type: "ROLL";
      color: "pink";
      label: string;
    }
  | {
      type: "LIMIT-HOLDING";
      label: string;
    };
