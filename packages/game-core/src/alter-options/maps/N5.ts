import type { AlterOptionObject } from ".";
import { GetDefaultScoreOf } from "../../score";

const N5TimesOptionParamList = [2, 3] as const;

export type N5TimesOptionName =
  (typeof N5TimesOptionParamList)[number] extends infer T
    ? T extends number
      ? `NUMBERS_5_${T}x`
      : never
    : never;

export const N5TimesOptionMap = N5TimesOptionParamList.reduce(
  (acc, curr) => {
    const name = `NUMBERS_5_${curr}x` as N5TimesOptionName;
    acc[name] = {
      description: `NUMBERS_5의 점수를 ${curr}배`,
      handDependencies: [`NUMBERS_5`],
      onTrigger(gameStatus) {
        gameStatus.updateRowInfo({
          rowName: `NUMBERS_5`,
          rowInfo: {
            getScoreFrom: ({ handInputMap }) => {
              const handInput = handInputMap["NUMBERS_5"];
              if (handInput === undefined)
                throw new Error(`No such hand: NUMBERS_5`);
              if (handInput === null) return 0;

              const baseScore = GetDefaultScoreOf[`NUMBERS_5`](handInput);
              return baseScore * curr;
            },
            description: `NUMBERS_5의 점수를 ${curr}배`,
            type: "SINGLE_ALTERED",
          },
        });
      }
    };
    return acc;
  },
  {} as Record<N5TimesOptionName, AlterOptionObject>,
);
