import type { AlterOptionObject } from ".";

const AllNumberBonusMissionOptionParamList = [
  [40, 10],
  [50, 25],
  [60, 40],
  [70, 60],
] as const;

export type AllNumberBonusMissionOptionName =
  (typeof AllNumberBonusMissionOptionParamList)[number] extends infer T
    ? T extends readonly [infer A, infer B]
      ? `ALL_NUMBERS_MISSION_${A & number}_${B & number}`
      : never
    : never;

export const AllNumberBonusMissionOptionMap =
  AllNumberBonusMissionOptionParamList.reduce(
    (acc, curr) => {
      const name =
        `ALL_NUMBERS_MISSION_${curr[0]}_${curr[1]}` as AllNumberBonusMissionOptionName;
      acc[name] = {
        description: `NUMBERS 점수의 합이 ${curr[0]}점 이상이면 ${curr[1]}점 획득`,
        handDependencies: [
          "NUMBERS_1",
          "NUMBERS_2",
          "NUMBERS_3",
          "NUMBERS_4",
          "NUMBERS_5",
          "NUMBERS_6",
        ],
        onTrigger(gameStatus) {
          const isMissionCleared = (
            handInputMap: Record<
              string,
              [number, number, number, number, number] | null
            >
          ) => {
            const allNumbersRowNames = [
              "NUMBERS_1",
              "NUMBERS_2",
              "NUMBERS_3",
              "NUMBERS_4",
              "NUMBERS_5",
              "NUMBERS_6",
            ];

            const NumbersRowScoreList = allNumbersRowNames.map((rowName) => {
              const rowInfo = gameStatus.getRowInfoOf(rowName);
              return rowInfo.getScoreFrom({ handInputMap });
            });

            const totalNumbersScore = NumbersRowScoreList.reduce(
              (acc, score) => acc + score,
              0
            );

            return totalNumbersScore >= curr[0];
          };

          gameStatus.getPlayerTotalScore = ({ playerIdx }) => {
            const baseTotalScore = gameStatus.getBasePlayerTotalScore({
              playerIdx,
            })
            const handInputMap = gameStatus.getHandInputMapOf({ playerIdx });

            if (isMissionCleared(handInputMap)) {
              return baseTotalScore + curr[1];
            } else {
              return baseTotalScore;
            }
          };
        },
      };
      return acc;
    },
    {} as Record<AllNumberBonusMissionOptionName, AlterOptionObject>
  );
