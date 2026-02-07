import type { GetFieldConfigBase } from "./types.js";
import getDefaultHandScoreOf from "../handConfig/index.js";

const getFieldConfigOfYacht = (() => ({
  default: () => ({
    getScore: (handInput) => getDefaultHandScoreOf.Yacht(handInput),
    description:
      "Score is the sum of all dice if they all show the same number; otherwise, score is 0.",
    view: { name: "Yacht" },
  }),
})) satisfies GetFieldConfigBase;

export default getFieldConfigOfYacht;
