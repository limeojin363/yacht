// hand는 입력의 단위
// field는 table에서 하나의 행, 즉 총점 계산의 단위

import type { HandInput } from "../../__engine/gameState/schema/playerInfo.js";

const getDefaultHandScoreOf = {
  NumbersN: (handInput, n) => {
    if (handInput === null) return 0;

    return handInput
      .filter((eye) => eye === n)
      .reduce((sum, eye) => sum + eye, 0);
  },
  Choice: (handInput) => {
    if (handInput === null) return 0;

    return handInput.reduce((sum, eye) => sum + eye, 0);
  },
  NOfAKind: (handInput, n) => {
    if (handInput === null) return 0;

    const counts: Record<number, number> = {};
    for (const die of handInput) {
      counts[die] = (counts[die] || 0) + 1;
    }

    const satisfying = Object.values(counts).some((count) => count >= n);
    if (!satisfying) return 0;

    return handInput.reduce((sum, eye) => sum + eye, 0);
  },
  FullHouse: (handInput) => {
    if (handInput === null) return 0;

    const counts: Record<number, number> = {};
    for (const die of handInput) {
      counts[die] = (counts[die] || 0) + 1;
    }

    const values = Object.values(counts);
    const hasThree = values.includes(3);
    const hasTwo = values.includes(2);

    const satisfying = hasThree && hasTwo;
    if (satisfying) return 25;

    return 0;
  },
  Straight: (handInput) => {
    if (handInput === null) return 0;

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
  },
  Yacht: (handInput) => {
    if (handInput === null) return 0;

    const firstDie = handInput[0];
    const satisfying = handInput.every((die) => die === firstDie);

    if (satisfying) return 50;

    return 0;
  },
} satisfies Record<
  string,
  (handInput: HandInput, ...additionalProps: number[]) => number
>;

export default getDefaultHandScoreOf;
