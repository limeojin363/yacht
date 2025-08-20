import type { AvailableDiceEye, AvailableHand } from "./types";

const count = (handInput: AvailableDiceEye[], number: number) =>
  handInput.filter((n) => n === number).length;

const EYES  = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
} as const

const COUNT = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
} as const

const SCORES = {
  FULLHOUSE: 25,
  STRAIGHT: 40,
  YACHT: 50,
} as const

type AbstractCalculator = {
  [key in AvailableHand]: (handInput: AvailableDiceEye[]) => number;
}

class ScoreCalculator implements AbstractCalculator {
  TRIPLE = (handInput: AvailableDiceEye[]) =>
    handInput.some((n) => count(handInput, n) >= COUNT.THREE)
      ? handInput.reduce((acc, n) => acc + n, 0)
      : 0;
  FOURCARD = (handInput: AvailableDiceEye[]) =>
    handInput.some((n) => count(handInput, n) >= COUNT.FOUR)
      ? handInput.reduce((acc, n) => acc + n, 0)
      : 0;
  FULLHOUSE = (handInput: AvailableDiceEye[]) =>
    handInput.some((n) => count(handInput, n) === COUNT.TWO) &&
    handInput.some((n) => count(handInput, n) === COUNT.THREE)
      ? SCORES.FULLHOUSE
      : 0;
  STRAIGHT = (handInput: AvailableDiceEye[]) =>
    (handInput.includes(EYES.ONE) &&
      handInput.includes(EYES.TWO) &&
      handInput.includes(EYES.THREE) &&
      handInput.includes(EYES.FOUR) &&
      handInput.includes(EYES.FIVE)) ||
    (handInput.includes(EYES.TWO) &&
      handInput.includes(EYES.THREE) &&
      handInput.includes(EYES.FOUR) &&
      handInput.includes(EYES.FIVE) &&
      handInput.includes(EYES.SIX))
      ? SCORES.STRAIGHT
      : 0;
  YACHT = (handInput: AvailableDiceEye[]) =>
    handInput.some((n) => count(handInput, n) === COUNT.FIVE)
      ? SCORES.YACHT
      : 0;
  CHOICE = (handInput: AvailableDiceEye[]) => handInput.reduce((acc, n) => acc + n, 0);
  NUMBERS_1 = (handInput: AvailableDiceEye[]) =>
    count(handInput, EYES.ONE) * EYES.ONE;
  NUMBERS_2 = (handInput: AvailableDiceEye[]) =>
    count(handInput, EYES.TWO) * EYES.TWO;
  NUMBERS_3 = (handInput: AvailableDiceEye[]) =>
    count(handInput, EYES.THREE) * EYES.THREE;
  NUMBERS_4 = (handInput: AvailableDiceEye[]) =>
    count(handInput, EYES.FOUR) * EYES.FOUR;
  NUMBERS_5 = (handInput: AvailableDiceEye[]) =>
    count(handInput, EYES.FIVE) * EYES.FIVE;
  NUMBERS_6 = (handInput: AvailableDiceEye[]) =>
    count(handInput, EYES.SIX) * EYES.SIX;
}

export default ScoreCalculator;
