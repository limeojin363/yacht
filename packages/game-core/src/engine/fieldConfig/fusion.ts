import getDefaultHandScoreOf from "../handConfig/index.js";
import type { DiceNum, GetFieldConfigBase } from "./types.js";

const getFieldConfigOfFusion = ((a: DiceNum, b: DiceNum) => ({
  default: () => ({
    getScore: (aHandInput, bHandInput) =>
      getDefaultHandScoreOf.NumbersN(aHandInput, a) *
      getDefaultHandScoreOf.NumbersN(bHandInput, b),
    description:
      "If the hand contains a combination of dice that meets the fusion criteria, score is the sum of all dice; otherwise, score is 0.",
    view: { name: "Fusion" },
  }),
})) satisfies GetFieldConfigBase;

export default getFieldConfigOfFusion;
