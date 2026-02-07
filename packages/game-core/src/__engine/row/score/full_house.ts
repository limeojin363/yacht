import type { HandInput } from "../../gameState/schema/playerInfo.js";
import type { FieldInfoBase } from "../base.types.js";
import { isFilled } from "./utils/index.js";

const getFullHouseBaseScore = (handInput: HandInput) => {
  if (!isFilled(handInput, { errorMsg: `No such hand: FULL_HOUSE` })) return 0;

  const valueCounts = new Map<number, number>();
  for (const die of handInput) {
    valueCounts.set(die, (valueCounts.get(die) || 0) + 1);
  }

  const counts = Array.from(valueCounts.values()).sort((a, b) => a - b);
  const isFullHouse = counts.length === 2 && counts[0] === 2 && counts[1] === 3;

  if (isFullHouse) {
    return handInput.reduce((sum, die) => sum + die, 0);
  }
  return 0;
};

export const RowInfoOfFullHouse = {
  default: () => ({
    description:
      "If the dice show a combination of three of one number and two of another (a full house), score is the sum of all dice; otherwise, score is 0.",
    getScore: getFullHouseBaseScore,
    view: { name: "Full House" },
  }),
} satisfies FieldInfoBase;
