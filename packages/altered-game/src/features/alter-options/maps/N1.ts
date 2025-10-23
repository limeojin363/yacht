import type { AlterOptionObject } from "..";

const N1TimesOptionParamList = [-8, -9, -10, 5, 6, 7, 8] as const;

export type N1TimesOptionName = typeof N1TimesOptionParamList[number] extends infer T
  ? T extends number
    ? `NUMBERS_1_${T}x`
    : never
  : never;

export const N1TimesOptionMap = N1TimesOptionParamList.reduce(
  (acc, curr) => {
    const name = `NUMBERS_1_${curr}x` as N1TimesOptionName;
    acc[name] = {
      description: `NUMBERS_1의 점수를 ${curr}배`,
      handDependencies: [`NUMBERS_1`],
    };
    return acc;
  },
  {} as Record<string, AlterOptionObject>
);

export const N1IfZeroParamList = [10, 20, -10, -20] as const;

export type N1IfZeroOptionName = typeof N1IfZeroParamList[number] extends infer T
  ? T extends number
    ? `NUMBERS_1_If_ZERO_${T}`
    : never
  : never;

export const N1IfZeroOptionMap = N1IfZeroParamList.reduce(
  (acc, curr) => {
    const name = `NUMBERS_1_If_ZERO_${curr}`;
    acc[name] = {
      description: `NUMBERS_1의 점수가 0이라면 ${curr}가 됨`,
      handDependencies: [`NUMBERS_1`],
    };
    return acc;
  },
  {} as Record<string, AlterOptionObject>
);

export const N1EtcOptionMap = {
  NUMBERS_1_SQUARE: {
    description: `NUMBERS_1의 점수를 제곱`,
    handDependencies: [`NUMBERS_1`],
  },
  NUMBERS_1_CUBE: {
    description: `NUMBERS_1의 점수를 세제곱`,
    handDependencies: [`NUMBERS_1`],
  },
} as const satisfies Record<string, AlterOptionObject>;

export type N1EtcOptionName = keyof typeof N1EtcOptionMap