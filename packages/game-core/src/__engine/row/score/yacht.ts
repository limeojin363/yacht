import type { HandInput } from "../../gameState/schema/playerInfo.js";
import type { FieldInfoBase } from "../base.types.js";
import { isFilled } from "./utils/index.js";

const getYachtBaseScore = (handInput: HandInput) => {
  if (!isFilled(handInput, { errorMsg: `No such hand: YACHT` })) return 0;

  const firstDie = handInput[0];
  const allSame = handInput.every((die) => die === firstDie);
  if (!allSame) return 0;

  return 50;
};

export const RowInfoOfYacht = {
  default: () => ({
    description:
      "If all five dice show the same number, score is 50; otherwise, score is 0.",
    getScore: getYachtBaseScore,
    view: { name: "Yacht" },
  }),
} satisfies FieldInfoBase;
