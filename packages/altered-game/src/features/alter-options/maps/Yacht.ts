import type { AlterOptionObject } from "..";

const YachtOptionParamList = [70, 80, 90, 100] as const;

export type YachtOptionName = typeof YachtOptionParamList[number] extends infer T
  ? T extends number
    ? `YACHT_${T}`
    : never
  : never;

export const YachtOptionMap = YachtOptionParamList.reduce(
  (acc, curr) => {
    const name = `YACHT_${curr}` as YachtOptionName;
    acc[name] = {
      description: `YACHT가 ${curr}점이 됨`,
      handDependencies: [],
    };
    return acc;
  },
  {} as Record<YachtOptionName, AlterOptionObject>
);
