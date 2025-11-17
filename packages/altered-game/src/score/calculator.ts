import _ from "lodash";
import type { RowInfo } from "../status";

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


export const getInitialRowInfo = (): Record<string, RowInfo> => ({
  TRIPLE: {
    getScore: GetDefaultScoreOf.TRIPLE,
    description: "At least three dice showing the same number.",
    type: "NORMAL",
  },
  FOURCARD: {
    getScore: GetDefaultScoreOf.FOURCARD,
    description: "At least four dice showing the same number.",
    type: "NORMAL",
  },
  FULLHOUSE: {
    getScore: GetDefaultScoreOf.FULLHOUSE,
    description: "A combination of three of a kind and a pair.",
    type: "NORMAL",
  },
  STRAIGHT: {
    getScore: GetDefaultScoreOf.STRAIGHT,
    description: "All five dice showing a sequence of numbers.",
    type: "NORMAL",
  },
  YACHT: {
    getScore: GetDefaultScoreOf.YACHT,
    description: "All five dice showing the same number.",
    type: "NORMAL",
  },
  CHOICE: {
    getScore: GetDefaultScoreOf.CHOICE,
    description: "Sum of all dice, regardless of their values.",
    type: "NORMAL",
  },
  NUMBERS_1: {
    getScore: GetDefaultScoreOf.NUMBERS_1,
    description: "Sum of all dice showing the number 1.",
    type: "NORMAL",
  },
  NUMBERS_2: {
    getScore: GetDefaultScoreOf.NUMBERS_2,
    description: "Sum of all dice showing the number 2.",
    type: "NORMAL",
  },
  NUMBERS_3: {
    getScore: GetDefaultScoreOf.NUMBERS_3,
    description: "Sum of all dice showing the number 3.",
    type: "NORMAL",
  },
  NUMBERS_4: {
    getScore: GetDefaultScoreOf.NUMBERS_4,
    description: "Sum of all dice showing the number 4.",
    type: "NORMAL",
  },
  NUMBERS_5: {
    getScore: GetDefaultScoreOf.NUMBERS_5,
    description: "Sum of all dice showing the number 5.",
    type: "NORMAL",
  },
  NUMBERS_6: {
    getScore: GetDefaultScoreOf.NUMBERS_6,
    description: "Sum of all dice showing the number 6.",
    type: "NORMAL",
  },
});
