import getDefaultHandScoreOf from "../handConfig/index.js";
import type { GetFieldConfigBase } from "./types.js";

const getFieldConfigOfChoice = (() => ({
  default: () => ({
    getScore: (handInput) => getDefaultHandScoreOf.Choice(handInput),
    description: "Score is the sum of all dice.",
    view: { name: "Choice" },
  }),
  multiply: (operand: number) => ({
    getScore: (handInput) =>
      getDefaultHandScoreOf.Choice(handInput) * operand,
    description: `Score is the sum of all dice multiplied by ${operand}.`,
    view: { name: `Choice x${operand}` },
  }),
})) satisfies GetFieldConfigBase;

export default getFieldConfigOfChoice;
