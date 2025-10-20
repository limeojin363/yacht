import type { AlterOptionName, SelectableHand } from "../status";

type FusionRowName = Extract<AlterOptionName, `FUSION${string}`>;

export type RowName = SelectableHand | FusionRowName;

export type ScoreTable = {
  rowNames: RowName[];
};
