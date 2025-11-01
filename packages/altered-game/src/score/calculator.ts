import _ from "lodash";

const count = (handInput: number[], number: number) =>
  handInput.filter((n) => n === number).length;

export const GetDefaultScoreOf = {
  TRIPLE: (handInput: number[]) =>
    handInput.some((n) => count(handInput, n) >= 3)
      ? handInput.reduce((acc, n) => acc + n, 0)
      : 0,
  FOURCARD: (handInput: number[]) =>
    handInput.some((n) => count(handInput, n) >= 4)
      ? handInput.reduce((acc, n) => acc + n, 0)
      : 0,
  FULLHOUSE: (handInput: number[]) =>
    handInput.some((n) => count(handInput, n) === 2) &&
    handInput.some((n) => count(handInput, n) === 3)
      ? 25
      : 0,
  STRAIGHT: (handInput: number[]) =>
    (handInput.includes(1) &&
      handInput.includes(2) &&
      handInput.includes(3) &&
      handInput.includes(4) &&
      handInput.includes(5)) ||
    (handInput.includes(2) &&
      handInput.includes(3) &&
      handInput.includes(4) &&
      handInput.includes(5) &&
      handInput.includes(6))
      ? 40
      : 0,
  YACHT: (handInput: number[]) =>
    handInput.some((n) => count(handInput, n) === 5) ? 50 : 0,
  CHOICE: (handInput: number[]) => handInput.reduce((acc, n) => acc + n, 0),
  NUMBERS_1: (handInput: number[]) => count(handInput, 1) * 1,
  NUMBERS_2: (handInput: number[]) => count(handInput, 2) * 2,
  NUMBERS_3: (handInput: number[]) => count(handInput, 3) * 3,
  NUMBERS_4: (handInput: number[]) => count(handInput, 4) * 4,
  NUMBERS_5: (handInput: number[]) => count(handInput, 5) * 5,
  NUMBERS_6: (handInput: number[]) => count(handInput, 6) * 6,
} as const satisfies Record<string, (handInput: number[]) => number>;
