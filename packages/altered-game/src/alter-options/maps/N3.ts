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

        gameStatus.updateRowInfo({
          rowName: `NUMBERS_3`,
          rowInfo: {
            getScoreFrom: ({ handInputMap }) => {
              const handInput = handInputMap["NUMBERS_3"];
              if (handInput === undefined || handInput === null)
                throw new Error();

              const baseScore = GetDefaultScoreOf[`NUMBERS_3`](handInput);
              return baseScore * curr;
            },
            description: `NUMBERS_3의 점수를 ${curr}배`,
            type: "SINGLE_ALTERED",
          },
        });
      }
    };
    return acc;
  },
  {} as Record<N3TimesOptionName, AlterOptionObject>,
);
