import type { HandInput } from "../../gameState/schema/playerInfo.js";
import type { FieldInfoBase } from "../base.types.js";
import { isFilled } from "./utils/index.js";

const getNOfAKindDefaultScore = (n: number, handInput: HandInput) => {
  if (!isFilled(handInput, { errorMsg: `No such hand: N_OF_A_KIND` })) return 0;

  const counts: Record<number, number> = {};
  for (const die of handInput) {
    counts[die] = (counts[die] || 0) + 1;
  }

  const satisfying = Object.values(counts).some((count) => count >= n);
  if (!satisfying) return 0;

  return handInput.reduce((sum, eye) => sum + eye, 0);
};

export const RowInfoOfNOfAKind = {
  default: (n: number) => ({
    getScore: (handInput) => getNOfAKindDefaultScore(n, handInput),
    description: `If there are at least ${n} dice showing the same number, score is the sum of all ${n}; otherwise, score is 0.`,
    view: { name: `${n} of a Kind` },
  }),
} satisfies FieldInfoBase;
