import _ from "lodash";
import { COUNT, EYES, SCORES } from "../../constants/index";
import AlterOptionMap from "../alter-options";

const count = (handInput: number[], number: number) =>
  handInput.filter((n) => n === number).length;

export const GetDefaultScoreOf: Record<
  string,
  (handInput: number[]) => number
> = {
  TRIPLE: (handInput: number[]) =>
    handInput.some((n) => count(handInput, n) >= COUNT.THREE)
      ? handInput.reduce((acc, n) => acc + n, 0)
      : 0,
  FOURCARD: (handInput: number[]) =>
    handInput.some((n) => count(handInput, n) >= COUNT.FOUR)
      ? handInput.reduce((acc, n) => acc + n, 0)
      : 0,
  FULLHOUSE: (handInput: number[]) =>
    handInput.some((n) => count(handInput, n) === COUNT.TWO) &&
    handInput.some((n) => count(handInput, n) === COUNT.THREE)
      ? SCORES.FULLHOUSE
      : 0,
  STRAIGHT: (handInput: number[]) =>
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
      : 0,
  YACHT: (handInput: number[]) =>
    handInput.some((n) => count(handInput, n) === COUNT.FIVE)
      ? SCORES.YACHT
      : 0,
  CHOICE: (handInput: number[]) =>
    handInput.reduce((acc, n) => acc + n, 0),
  NUMBERS_1: (handInput: number[]) =>
    count(handInput, EYES.ONE) * EYES.ONE,
  NUMBERS_2: (handInput: number[]) =>
    count(handInput, EYES.TWO) * EYES.TWO,
  NUMBERS_3: (handInput: number[]) =>
    count(handInput, EYES.THREE) * EYES.THREE,
  NUMBERS_4: (handInput: number[]) =>
    count(handInput, EYES.FOUR) * EYES.FOUR,
  NUMBERS_5: (handInput: number[]) =>
    count(handInput, EYES.FIVE) * EYES.FIVE,
  NUMBERS_6: (handInput: number[]) =>
    count(handInput, EYES.SIX) * EYES.SIX,
};

export const Calculator = (() => {
  const GetScoreOf = _.cloneDeep(GetDefaultScoreOf);

  const get = (handName: string, handInput: number[]) => {
    const scoreGetter = GetScoreOf[handName];
    if (!scoreGetter) throw new Error("등록되지 않은 hand입니다..");

    return scoreGetter(handInput);
  };

  const inject = (alterOptions: string[]): void => {
    alterOptions.forEach((optionName) => {
      const alterOption = AlterOptionMap[optionName];
      if (!alterOption) throw new Error("등록되지 않은 옵션명입니다..");

      if (alterOption.effectOnCalculator) {
        alterOption.effectOnCalculator(GetScoreOf);
      }
    });
  };

  return { get, inject };
})();
