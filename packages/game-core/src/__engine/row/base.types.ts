import type { HandInput } from "../gameState/schema/playerInfo.js";
import type {
  FieldScoreCalculatorName,
  FieldBaseName,
} from "../gameState/schema/row.js";
import type { ScoreCellView } from "../view/index.js";

export type FieldInfoMap = Record<FieldBaseName, FieldInfoBase>;

export type GetFieldScoreBase = (...handInputs: HandInput[]) => number;

export type GetViewBase = () => ScoreCellView;

export type FieldInfoBase = Partial<
  Record<
    FieldScoreCalculatorName,
    (...props: never[]) => {
      getScore: GetFieldScoreBase;
      description: string;
    }
  >
>;
