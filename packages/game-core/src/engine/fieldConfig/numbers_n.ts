import getDefaultHandScoreOf from "../handConfig/index.js";
import type { DiceNum, GetFieldConfigBase, HandInput } from "./types.js";

const NUM_TO_ENG = {
  1: "ones",
  2: "twos",
  3: "threes",
  4: "fours",
  5: "fives",
  6: "sixes",
};

const getFieldConfigOfNumbersN = ((n: DiceNum) => ({
  default: () => ({
    getScore: (handInput: HandInput) =>
      getDefaultHandScoreOf.NumbersN(handInput, n),
    description: `Score is the sum of all ${NUM_TO_ENG[n]} in the hand.`,
    view: { name: `Numbers ${n}` },
  }),
  multiply: (operand: number) => ({
    getScore: (handInput: HandInput) =>
      getDefaultHandScoreOf.NumbersN(handInput, n) * operand,
    description: `Score is the sum of all ${NUM_TO_ENG[n]} multiplied by ${operand}.`,
    view: { name: `Numbers ${n} x${operand}` },
  }),
  pow: (operand: number) => ({
    getScore: (handInput: HandInput) =>
      getDefaultHandScoreOf.NumbersN(handInput, n) ** operand,
    description: `Score is the sum of all ${NUM_TO_ENG[n]} raised to the power of ${operand}.`,
    view: { name: `Numbers ${n} ^${operand}` },
  }),
  if_zero_become_n: (operand: number) => ({
    getScore: (handInput: HandInput) => {
      const baseScore = getDefaultHandScoreOf.NumbersN(handInput, n);
      return baseScore <= operand ? baseScore : 0;
    },
    description: `If the count of ${NUM_TO_ENG[n]} is less than or equal to ${operand}, score equals the count; otherwise, score is 0.`,
    view: { name: `Numbers ${n} (0 to ${operand})` },
  }),
})) satisfies GetFieldConfigBase;

export default getFieldConfigOfNumbersN;
