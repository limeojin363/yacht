import type { AlterOptionObject } from ".";

const RollLimitOptionParamList = [1, 2, 4, 5] as const;

export type RollLimitOptionName =
  (typeof RollLimitOptionParamList)[number] extends infer T
    ? T extends number
      ? `ROLL_LIMIT_${T}`
      : never
    : never;

export const RollLimitOptionMap = RollLimitOptionParamList.reduce(
  (acc, curr) => {
    const name = `ROLL_LIMIT_${curr}` as RollLimitOptionName;
    acc[name] = {
      description: `롤 횟수를 ${curr}개로 제한`,
      handDependencies: [],
      onTrigger(gameStatus) {
        gameStatus.maxRoll = curr;
      },
    };
    return acc;
  },
  {} as Record<RollLimitOptionName, AlterOptionObject>,
);

const HoldingLimitParamList = [0, 1, 2, 3, 4] as const;

export type HoldingLimitOptionName =
  (typeof HoldingLimitParamList)[number] extends infer T
    ? T extends number
      ? `HOLDING_LIMIT_${T}`
      : never
    : never;

export const HoldingLimitOptionMap = HoldingLimitParamList.reduce(
  (acc, curr) => {
    const name = `HOLDING_LIMIT_${curr}` as HoldingLimitOptionName;
    acc[name] = {
      description: `주사위 고정 가능 최대 개수를 ${curr}개로 제한`,
      handDependencies: [],
      onTrigger(gameStatus) {
        gameStatus.maxHolding = curr;
      },
    };
    return acc;
  },
  {} as Record<HoldingLimitOptionName, AlterOptionObject>,
);
