import getDefaultHandScoreOf from "../handConfig/index.js";
import type { GetFieldConfigBase } from "./types.js";

const getFieldConfigOfFullHouse = (() => ({
  default: () => ({
    getScore: (handInput) => getDefaultHandScoreOf.FullHouse(handInput),
    description:
      "If the hand contains a three-of-a-kind and a pair, score is the sum of all dice; otherwise, score is 0.",
    view: { name: "Full House" },
  }),
})) satisfies GetFieldConfigBase;

export default getFieldConfigOfFullHouse;
