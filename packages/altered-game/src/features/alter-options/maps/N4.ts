import type { AlterOptionObject } from ".";
import { GetDefaultScoreOf } from "../../score";

const N4TimesOptionParamList = [0.5, 3] as const;

export type N4TimesOptionName =
  (typeof N4TimesOptionParamList)[number] extends infer T
    ? T extends number
      ? `NUMBERS_4_${T}x`
      : never
    : never;

export const N4TimesOptionMap = N4TimesOptionParamList.reduce(
  (acc, curr) => {
    const name = `NUMBERS_4_${curr}x` as N4TimesOptionName;
    acc[name] = {
      description: `NUMBERS_4의 점수를 ${curr}배`,
      handDependencies: [`NUMBERS_4`],
      onTrigger: (gameStatus) => {
        gameStatus.rowCalculator[`NUMBERS_4`] = (handInput: number[]) => {
          const baseScore = GetDefaultScoreOf[`NUMBERS_4`](handInput);
          return baseScore * curr;
        };
      },
    };
    return acc;
  },
  {} as Record<N4TimesOptionName, AlterOptionObject>
);
