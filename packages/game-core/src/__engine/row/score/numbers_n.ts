import type { FieldInfoBase } from "../base.types.js";
import type { HandInput } from "../../gameState/schema/playerInfo.js";
import { isFilled } from "./utils/index.js";

const getNumbersDefaultScore = (n: DiceNum, handInput: HandInput) => {
  if (!isFilled(handInput, { errorMsg: "Hand input is undefined" })) return 0;

  return handInput
    .filter((eye) => eye === n)
    .reduce((sum, eye) => sum + eye, 0);
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const NUM_TO_ENG = {
  1: "ones",
  2: "twos",
  3: "threes",
  4: "fours",
  5: "fives",
  6: "sixes",
};

type DiceNum = 1 | 2 | 3 | 4 | 5 | 6;

export const RowInfoOfNumbers: FieldInfoBase = {
  default: (n: DiceNum) => ({
    getScore: (handInput) => getNumbersDefaultScore(n, handInput),
    description: `Sum of all ${NUM_TO_ENG[n]}.`,
    view: { name: capitalize(NUM_TO_ENG[n]) },
  }),
  multiply: (n: DiceNum, operand: number) => ({
    getScore: (handInput) => getNumbersDefaultScore(n, handInput) * operand,
    description: `Sum of all ${NUM_TO_ENG[n]} multiplied by ${operand}.`,
    view: { name: `${capitalize(NUM_TO_ENG[n])} x${operand}` },
  }),
  pow: (n: DiceNum, operand: number) => ({
    getScore: (handInput) => getNumbersDefaultScore(n, handInput) ** operand,
    description: `Sum of all ${NUM_TO_ENG[n]} raised to the power of ${operand}.`,
    view: { name: `${capitalize(NUM_TO_ENG[n])} ^${operand}` },
  }),
  if_zero_become_n: (n: DiceNum, operand: number) => ({
    getScore: (handInput) => {
      const baseScore = getNumbersDefaultScore(n, handInput);
      return baseScore <= operand ? baseScore : 0;
    },
    description: `If the count of ${NUM_TO_ENG[n]} is less than or equal to ${operand}, score equals the count; otherwise, score is 0.`,
    view: { name: `${capitalize(NUM_TO_ENG[n])} (0 to ${operand})` },
  }),
};
