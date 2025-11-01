import type { AlterOptionObject } from ".";
import { GetDefaultScoreOf } from "../../score";

const N6TimesOptionParamList = [2, 3, 0.5] as const;

export type N6TimesOptionName =
  (typeof N6TimesOptionParamList)[number] extends infer T
    ? T extends number
      ? `NUMBERS_6_${T}x`
      : never
    : never;

export const N6TimesOptionMap = N6TimesOptionParamList.reduce(
  (acc, curr) => {
    const name = `NUMBERS_6_${curr}x` as N6TimesOptionName;
    acc[name] = {
      description: `NUMBERS_6의 점수를 ${curr}배`,
      handDependencies: [`NUMBERS_6`],
      onTrigger: (gameStatus) => {
        gameStatus.rowCalculator[`NUMBERS_6`] = (handInput: number[]) => {
          const baseScore = GetDefaultScoreOf[`NUMBERS_6`](handInput);
          return baseScore * curr;
        };
      },
    };
    return acc;
  },
  {} as Record<N6TimesOptionName, AlterOptionObject>,
);
