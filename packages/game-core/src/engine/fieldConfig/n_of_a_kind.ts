import getDefaultHandScoreOf from "../handConfig/index.js";
import type { GetFieldConfigBase } from "./types.js";

const getFieldConfigOfNOfAKind = ((n: number) => ({
  default: () => ({
    getScore: (handInput) => getDefaultHandScoreOf.NOfAKind(handInput, n),
    description: `If there are at least ${n} dice showing the same number, score is the sum of all ${n}; otherwise, score is 0.`,
    view: { name: `${n} of a Kind` },
  }),
})) satisfies GetFieldConfigBase;

export default getFieldConfigOfNOfAKind;
