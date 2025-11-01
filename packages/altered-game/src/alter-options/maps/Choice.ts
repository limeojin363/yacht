import type { AlterOptionObject } from ".";
import { GetDefaultScoreOf } from "../../score";

const ChoiceOptionParamList = [
  [1, 2],
  [2, 2],
  [3, 2],
  [1, 3],
  [2, 3],
] as const;

const Postfix = ["_A", "_B", "_C"] as const;

export type ChoiceOptionName =
  (typeof ChoiceOptionParamList)[number] extends infer T
    ? T extends readonly [infer A, infer B]
      ? `${A & number}-CHOICE_x${B & number}`
      : never
    : never;

export const ChoiceOptionMap = ChoiceOptionParamList.reduce(
  (acc, curr) => {
    const name = `${curr[0]}-CHOICE_x${curr[1]}` as ChoiceOptionName;
    acc[name] = {
      description: `CHOICE_x${curr[1]}을 ${curr[0]}개 생성`,
      handDependencies: [],
      onTrigger(gameStatus) {
        Array.from({ length: curr[1] }, (_, idx) => {
          gameStatus.rowCalculator[`CHOICE_x${curr[1]}_${Postfix[idx]}`] = (
            handInput: number[],
          ) => GetDefaultScoreOf.CHOICE(handInput) * curr[1];
        });
      },
    };
    return acc;
  },
  {} as Record<ChoiceOptionName, AlterOptionObject>,
);
