import type { AlterOptionObject } from ".";
import { GetDefaultScoreOf } from "../../score";

const FusionOptionParamList = [
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
  [1, 6],
  [2, 3],
  [2, 4],
] as const;

// TODO: 어떻게 다른건지 원리 이해하기(GPT가 짜준 코등미)
// type Changer<T extends FusionParamTuple> = `FUSION_${T[0]}&${T[1]}`;
// export type FusionOptionName = Changer<FusionParamTuple>;
export type FusionOptionName =
  (typeof FusionOptionParamList)[number] extends infer T
    ? T extends readonly [infer A, infer B]
      ? `NUMBER${A & number}&${B & number}_FUSION`
      : never
    : never;

export const FusionOptionMap = FusionOptionParamList.reduce(
  (acc, curr) => {
    const name = `NUMBER${curr[0]}&${curr[1]}_FUSION` as FusionOptionName;
    acc[name] = {
      description: `NUMBERS_${curr[0]}과 NUMBERS_${curr[1]}를 곱연산`,
      handDependencies: [`NUMBERS_${curr[0]}`, `NUMBERS_${curr[1]}`],
      onTrigger: (gameStatus) => {
        delete gameStatus.rowCalculator[`NUMBERS_${curr[0]}`];
        delete gameStatus.rowCalculator[`NUMBERS_${curr[1]}`];

        gameStatus.rowCalculator[name] = (
          handInput: number[],
        ) => {
          const baseScoreA = GetDefaultScoreOf[`NUMBERS_${curr[0]}`](handInput);
          const baseScoreB = GetDefaultScoreOf[`NUMBERS_${curr[1]}`](handInput);
          return baseScoreA * baseScoreB;
        };
      },
    };
    return acc;
  },
  {} as Record<FusionOptionName, AlterOptionObject>,
);
