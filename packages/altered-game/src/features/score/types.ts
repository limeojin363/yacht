import type { AlterOptionName, DefaultHand } from "../status";

type FusionRowName = Extract<AlterOptionName, `FUSION${string}`>;

export type RowName = DefaultHand | FusionRowName;

export type ScoreTable = {
  rowNames: RowName[];
};
