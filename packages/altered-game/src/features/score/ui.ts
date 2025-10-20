import type { AvailableDiceEye } from "../status";
import type { RowName } from "./types";

export type TableUIData = {
  rowNames: RowName[];
  playerColumns: PlayerColumn[];
  decorators: Decorator[];
};

type ScoreCellData = {
  diceEyes: AvailableDiceEye[];
  score: number;
  label: string;
};

export type PlayerColumn = {
  [key in RowName]: ScoreCellData | null;
};


export type Decorator =
  | { type: "SINGLE-ROW"; color: "blue"; hand: RowName; label: string }
  | {
      type: "MULTIPLE-ROWS";
      color: "red";
      hand: RowName[];
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
