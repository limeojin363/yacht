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
    getScoreFrom: ({ handInputMap }) => {
      const targetHandInput = handInputMap.TRIPLE;
      if (targetHandInput === undefined)
        throw new Error(`No such hand: TRIPLE`);
      if (targetHandInput === null) return 0;

      return GetDefaultScoreOf.TRIPLE(targetHandInput);
    },
    description: "At least three dice showing the same number.",
    type: "NORMAL",
  },
  FOURCARD: {
    getScoreFrom: ({ handInputMap }) => {
      const handInput = handInputMap.FOURCARD;
      if (handInput === undefined)
        throw new Error(`No such hand: FOURCARD`);
      if (handInput === null) return 0;

      return GetDefaultScoreOf.FOURCARD(handInput);
    },
    description: "At least four dice showing the same number.",
    type: "NORMAL",
  },
  FULLHOUSE: {
    getScoreFrom: ({ handInputMap }) => {
      const handInput = handInputMap.FULLHOUSE;
      if (handInput === undefined)
        throw new Error(`No such hand: FULLHOUSE`);
      if (handInput === null) return 0;

      return GetDefaultScoreOf.FULLHOUSE(handInput);
    },
    description: "A combination of three of a kind and a pair.",
    type: "NORMAL",
  },
  STRAIGHT: {
    getScoreFrom: ({ handInputMap }) => {
      const handInput = handInputMap.STRAIGHT;
      if (handInput === undefined)
        throw new Error(`No such hand: STRAIGHT`);
      if (handInput === null) return 0;

      return GetDefaultScoreOf.STRAIGHT(handInput);
    },
    description: "All five dice showing a sequence of numbers.",
    type: "NORMAL",
  },
  YACHT: {
    getScoreFrom: ({ handInputMap }) => {
      const handInput = handInputMap.YACHT;
      if (handInput === undefined)
        throw new Error(`No such hand: YACHT`);
      if (handInput === null) return 0;

      return GetDefaultScoreOf.YACHT(handInput);
    },
    description: "All five dice showing the same number.",
    type: "NORMAL",
  },
  CHOICE: {
    getScoreFrom: ({ handInputMap }) => {
      const handInput = handInputMap.CHOICE;
      if (handInput === undefined)
        throw new Error(`No such hand: CHOICE`);
      if (handInput === null) return 0;

      return GetDefaultScoreOf.CHOICE(handInput);
    },
    description: "Sum of all dice, regardless of their values.",
    type: "NORMAL",
  },
  NUMBERS_1: {
    getScoreFrom: ({ handInputMap }) => {
      const handInput = handInputMap.NUMBERS_1;
      if (handInput === undefined)
        throw new Error(`No such hand: NUMBERS_1`);
      if (handInput === null) return 0;

      return GetDefaultScoreOf.NUMBERS_1(handInput);
    },
    description: "Sum of all dice showing the number 1.",
    type: "NORMAL",
  },
  NUMBERS_2: {
    getScoreFrom: ({ handInputMap }) => {
      const handInput = handInputMap.NUMBERS_2;
      if (handInput === undefined)
        throw new Error(`No such hand: NUMBERS_2`);
      if (handInput === null) return 0;

      return GetDefaultScoreOf.NUMBERS_2(handInput);
    },
    description: "Sum of all dice showing the number 2.",
    type: "NORMAL",
  },
  NUMBERS_3: {
    getScoreFrom: ({ handInputMap }) => {
      const handInput = handInputMap.NUMBERS_3;
      if (handInput === undefined)
        throw new Error(`No such hand: NUMBERS_3`);
      if (handInput === null) return 0;

      return GetDefaultScoreOf.NUMBERS_3(handInput);
    },
    description: "Sum of all dice showing the number 3.",
    type: "NORMAL",
  },
  NUMBERS_4: {
    getScoreFrom: ({ handInputMap }) => {
      const handInput = handInputMap.NUMBERS_4;
      if (handInput === undefined)
        throw new Error(`No such hand: NUMBERS_4`);
      if (handInput === null) return 0;

      return GetDefaultScoreOf.NUMBERS_4(handInput);
    },
    description: "Sum of all dice showing the number 4.",
    type: "NORMAL",
  },
  NUMBERS_5: {
    getScoreFrom: ({ handInputMap }) => {
      const handInput = handInputMap.NUMBERS_5;
      if (handInput === undefined)
        throw new Error(`No such hand: NUMBERS_5`);
      if (handInput === null) return 0;

      return GetDefaultScoreOf.NUMBERS_5(handInput);
    },
    description: "Sum of all dice showing the number 5.",
    type: "NORMAL",
  },
  NUMBERS_6: {
    getScoreFrom: ({ handInputMap }) => {
      const handInput = handInputMap.NUMBERS_6;
      if (handInput === undefined)
        throw new Error(`No such hand: NUMBERS_6`);
      if (handInput === null) return 0;

      return GetDefaultScoreOf.NUMBERS_6(handInput);
    },
    description: "Sum of all dice showing the number 6.",
    type: "NORMAL",
  },
});
