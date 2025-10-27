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
        description: `모든 NUMBERS 미션의 점수가 ${curr[0]}점 이상이면 ${curr[1]}점 획득`,
        handDependencies: [],
        onTrigger(gameStatus) {
          gameStatus.getTotalScore = ({ playerId }) => {
            const playerSelection = gameStatus.handSelectionObjects[playerId];
            if (playerSelection === undefined) throw new Error();

            let totalScore = 0;
            for (const [rowName, handInput] of Object.entries(
              playerSelection
            )) {
              const rowScoreGetter = gameStatus.rowCalculator[rowName];
              if (rowScoreGetter === undefined) throw new Error();

              if (handInput !== null)
                totalScore += rowScoreGetter(handInput);
            }

            if (
              [
                "NUMBERS_1",
                "NUMBERS_2",
                "NUMBERS_3",
                "NUMBERS_4",
                "NUMBERS_5",
                "NUMBERS_6",
              ].reduce((acc, rowName) => {
                const handInput = playerSelection[rowName];
                if (handInput === undefined) throw new Error();
                const rowScoreGetter = gameStatus.rowCalculator[rowName];
                if (rowScoreGetter === undefined) throw new Error();

                if (handInput !== null) {
                  return acc + rowScoreGetter(handInput);
                }
                return acc;
              }, 0) >= curr[0]
            )
              totalScore += curr[1];

            return totalScore;
          };
        },
      };
      return acc;
    },
    {} as Record<AllNumberBonusMissionOptionName, AlterOptionObject>
  );
