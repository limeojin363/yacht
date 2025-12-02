import type { AlterOptionObject } from ".";

const YachtOptionParamList = [70, 80, 90, 100] as const;

export type YachtOptionName =
  (typeof YachtOptionParamList)[number] extends infer T
    ? T extends number
      ? `YACHT_${T}`
      : never
    : never;

export const YachtOptionMap = YachtOptionParamList.reduce(
  (acc, curr) => {
    const name = `YACHT_${curr}` as YachtOptionName;
    acc[name] = {
      description: `YACHT가 ${curr}점이 됨`,
      handDependencies: ["YACHT"],
      onTrigger(gameStatus) {
        gameStatus.updateRowInfo({
          rowName: "YACHT",
          rowInfo: {
            getScoreFrom({ handInputMap }) {
              const handInput = handInputMap["YACHT"];

              if (handInput === undefined)
                throw new Error(`No such hand: YACHT`);
              if (handInput === null) return 0;

              if (handInput.every((n) => n === handInput[0])) {
                return curr;
              } else return 0;
            },
            description: `YACHT 완성 시 ${curr} 점 획득`,
            type: "SINGLE_ALTERED",
          },
        });
      },
    };
    return acc;
  },
  {} as Record<YachtOptionName, AlterOptionObject>
);
