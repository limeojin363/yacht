import type { HandInput } from "../../gameState/schema/playerInfo.js";
import type { GetFieldScoreBase, FieldInfoBase } from "../base.types.js";
import { isFilled } from "./utils/index.js";

const getChoiceBaseScore = ((handInput: HandInput) => {
  if (!isFilled(handInput, { errorMsg: `No such hand: CHOICE` })) return 0;

  return handInput.reduce((sum, die) => sum + die, 0);
}) satisfies GetFieldScoreBase;

export const RowInfoOfChoice = {
  default: () => ({
    description: "Score is the sum of all dice, regardless of their values.",
    getScore: getChoiceBaseScore,
    view: { name: "Choice" },
  }),
  multiply: (n: number) => ({
    description: `Score is the sum of all dice multiplied by ${n}.`,
    getScore: (handInput: HandInput) => getChoiceBaseScore(handInput) * n,
    view: { name: `Choice x${n}` },
  }),
} satisfies FieldInfoBase;
