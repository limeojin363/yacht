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

// TODO: 타입 추출 원리 이해하기(GPT가 짜준 코드임)
// type Changer<T extends FusionParamTuple> = `FUSION_${T[0]}&${T[1]}`;
// export type FusionOptionName = Changer<FusionParamTuple>;
export type FusionOptionName =
  (typeof FusionOptionParamList)[number] extends infer T
    ? T extends readonly [infer A, infer B]
      ? `FUSION_${A & number}&${B & number}`
      : never
    : never;

export const FusionOptionMap = FusionOptionParamList.reduce(
  (acc, curr) => {
    const name = `FUSION_${curr[0]}&${curr[1]}` as FusionOptionName;
    acc[name] = {
      description: `NUMBERS_${curr[0]}과 NUMBERS_${curr[1]}를 곱연산`,
      handDependencies: [`NUMBERS_${curr[0]}`, `NUMBERS_${curr[1]}`],
      onTrigger: (gameStatus) => {
        delete gameStatus.rowInfoMap[`NUMBERS_${curr[0]}`];
        delete gameStatus.rowInfoMap[`NUMBERS_${curr[1]}`];

        gameStatus.rowInfoMap[name] = {
          getScore: (handInput: number[]) => {
            const baseScoreA = GetDefaultScoreOf[`NUMBERS_${curr[0]}`](handInput);
            const baseScoreB = GetDefaultScoreOf[`NUMBERS_${curr[1]}`](handInput);
            return baseScoreA * baseScoreB;
          },
          description: `NUMBERS_${curr[0]}와 NUMBERS_${curr[1]}의 곱 연산`,
          type: "FUSION",
        };
      },
    };
    return acc;
  },
  {} as Record<FusionOptionName, AlterOptionObject>,
);
