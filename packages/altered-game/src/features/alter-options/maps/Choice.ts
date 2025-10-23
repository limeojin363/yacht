import type { AlterOptionObject } from "..";

const ChoiceOptionParamList = [
  [1, 2],
  [2, 2],
  [3, 2],
  [1, 3],
  [2, 3],
] as const;

export type ChoiceOptionName = typeof ChoiceOptionParamList[number] extends infer T
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
    };
    return acc;
  },
  {} as Record<ChoiceOptionName, AlterOptionObject>
);
