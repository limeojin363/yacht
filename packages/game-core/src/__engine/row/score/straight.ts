import type { HandInput } from "../../gameState/schema/playerInfo.js";
import type { FieldInfoBase } from "../base.types.js";
import { isFilled } from "./utils/index.js";

const getStraightBaseScore = (handInput: HandInput) => {
  if (!isFilled(handInput, { errorMsg: `No such hand: STRAIGHT` })) return 0;

  const uniqueValues = new Set(handInput);
  const satisfying =
    uniqueValues.size === 5 &&
    [1, 2, 3, 4, 5].some((start) =>
      [start, start + 1, start + 2, start + 3, start + 4].every((num) =>
        uniqueValues.has(num),
      ),
    );

  if (satisfying) return 40;
  return 0;
};

export const RowInfoOfStraight = {
  default: () => ({
    description:
      "If the dice show a sequence of five consecutive numbers (1-5 or 2-6), score is 40; otherwise, score is 0.",
    getScore: getStraightBaseScore,
    view: { name: "Straight" },
  }),
} satisfies FieldInfoBase;
