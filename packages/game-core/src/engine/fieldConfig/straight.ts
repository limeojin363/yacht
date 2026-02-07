import type { GetFieldConfigBase } from "./types.js";
import getDefaultHandScoreOf from "../handConfig/index.js";

const getFieldConfigOfStraight = (() => ({
  default: () => ({
    getScore: (handInput) => getDefaultHandScoreOf.Straight(handInput),
    description:
      "Score is the sum of all dice if they form a straight; otherwise, score is 0.",
    view: { name: "Straight" },
  }),
})) satisfies GetFieldConfigBase;

export default getFieldConfigOfStraight;
