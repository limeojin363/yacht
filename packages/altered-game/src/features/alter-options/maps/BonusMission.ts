import type { AlterOptionObject } from "..";

const AllNumberBonusMissionOptionParamList = [
  [40, 10],
  [50, 25],
  [60, 40],
  [70, 60],
] as const;

export type AllNumberBonusMissionOptionName =
  typeof AllNumberBonusMissionOptionParamList[number] extends infer T
    ? T extends readonly [infer A, infer B]
      ? `ALL_NUMBERS_MISSION_${A & number}_${B & number}`
      : never
    : never;

export const AllNumberBonusMissionOptionMap =
  AllNumberBonusMissionOptionParamList.reduce(
    (acc, curr) => {
      const name = `ALL_NUMBERS_MISSION_${curr[0]}_${curr[1]}` as AllNumberBonusMissionOptionName;
      acc[name] = {
        description: `모든 NUMBERS 미션의 점수가 ${curr[0]}점 이상이면 ${curr[1]}점 획득`,
        handDependencies: [],
      };
      return acc;
    },
    {} as Record<AllNumberBonusMissionOptionName, AlterOptionObject>
  );