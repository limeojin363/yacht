import type { AlterOptionObject } from ".";
import { GetDefaultScoreOf } from "../../score";

const N3TimesOptionParamList = [3, 4] as const;

export type N3TimesOptionName =
  (typeof N3TimesOptionParamList)[number] extends infer T
    ? T extends number
      ? `NUMBERS_3_${T}x`
      : never
    : never;

export const N3TimesOptionMap = N3TimesOptionParamList.reduce(
  (acc, curr) => {
    const name = `NUMBERS_3_${curr}x` as N3TimesOptionName;
    acc[name] = {
      description: `NUMBERS_3의 점수를 ${curr}배`,
      handDependencies: [`NUMBERS_3`],
      onTrigger: (gameStatus) => {
        const row = gameStatus.rowInfoMap[`NUMBERS_3`];
        if (!row) throw new Error("NUMBERS_3 row info not found");
        row.getScore = (handInput: number[]) => {
          const baseScore = GetDefaultScoreOf[`NUMBERS_3`](handInput);
          return baseScore * curr;
        };
      },
    };
    return acc;
  },
  {} as Record<N3TimesOptionName, AlterOptionObject>,
);
