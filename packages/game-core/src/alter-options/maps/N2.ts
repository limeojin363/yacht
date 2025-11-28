import type { AlterOptionObject } from ".";
import { GetDefaultScoreOf } from "../../score";

const N2TimesOptionParamList = [-1, -2, 0.5, 3, 4, 5] as const;

export type N2TimesOptionName =
  (typeof N2TimesOptionParamList)[number] extends infer T
    ? T extends number
      ? `NUMBERS_2_${T}x`
      : never
    : never;

export const N2TimesOptionMap = N2TimesOptionParamList.reduce(
  (acc, curr) => {
    const name = `NUMBERS_2_${curr}x` as N2TimesOptionName;
    acc[name] = {
      description: `NUMBERS_2의 점수를 ${curr}배`,
      handDependencies: [`NUMBERS_2`],
      onTrigger: (gameStatus) => {
        gameStatus.updateRowInfo({
          rowName: `NUMBERS_2`,
          rowInfo: {
            getScoreFrom: ({ handInputMap }) => {
              const handInput = handInputMap["NUMBERS_2"];
              if (handInput === undefined)
                throw new Error(`No such hand: NUMBERS_2`);
              if (handInput === null) return 0;

              const baseScore = GetDefaultScoreOf[`NUMBERS_2`](handInput);
              return baseScore * curr;
            },
            description: `NUMBERS_2의 점수를 ${curr}배`,
            type: "SINGLE_ALTERED",
          },
        });
      },
    };
    return acc;
  },
  {} as Record<N2TimesOptionName, AlterOptionObject>
);

export const N2EtcOptionMap: Record<string, AlterOptionObject> = {
  NUMBERS_2_SQUARE: {
    description: `NUMBERS_2의 점수를 제곱`,
    handDependencies: [`NUMBERS_2`],
    onTrigger: (gameStatus) => {
      gameStatus.updateRowInfo({
        rowName: `NUMBERS_2`,
        rowInfo: {
          getScoreFrom: ({ handInputMap }) => {
            const handInput = handInputMap["NUMBERS_2"];
            if (handInput === undefined)
              throw new Error(`No such hand: NUMBERS_2`);
            if (handInput === null) return 0;

            const baseScore = GetDefaultScoreOf[`NUMBERS_2`](handInput);
            return baseScore * baseScore;
          },
          description: `NUMBERS_2의 점수를 제곱`,
          type: "SINGLE_ALTERED",
        },
      });
    },
  },
};
