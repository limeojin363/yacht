import type { AlterOptionObject } from "..";

const FusionOptionParamList = [
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
  [1, 6],
  [2, 3],
  [2, 4],
] as const;

// TODO: 원리 이해
// type Changer<T extends FusionParamTuple> = `FUSION_${T[0]}&${T[1]}`;
// export type FusionOptionName = Changer<FusionParamTuple>;

export type FusionOptionName = typeof FusionOptionParamList[number] extends infer T
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
    };
    return acc;
  },
  {} as Record<FusionOptionName, AlterOptionObject>
);
