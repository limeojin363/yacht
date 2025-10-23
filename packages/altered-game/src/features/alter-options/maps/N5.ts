import type { AlterOptionObject } from "..";

const N5TimesOptionParamList = [2, 3] as const;

export type N5TimesOptionName = typeof N5TimesOptionParamList[number] extends infer T
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
    };
    return acc;
  },
  {} as Record<N5TimesOptionName, AlterOptionObject>
);