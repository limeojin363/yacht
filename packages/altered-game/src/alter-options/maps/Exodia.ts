import type { AlterOptionObject } from ".";

export const SpecialHandsExodiaMap = {
  SpecialHandsExodia: {
    description: `STRAIGHT - FULLHOUSE - TRIPLE - FOURCARD - YACHT를 전부 채우면 99999점을 얻고 게임 종료(해당 턴까지 진행후)`,
    handDependencies: ["STRAIGHT", "FULLHOUSE", "TRIPLE", "FOURCARD", "YACHT"],
    onTrigger(gameStatus) {
      gameStatus.getPlayerTotalScore = ({ playerName }) => {
        const playerSelection = gameStatus.playerHandSelectionObjectMap[playerName];
        if (playerSelection === undefined) throw new Error();

        let totalScore = 0;
        for (const [rowName, handInput] of Object.entries(playerSelection)) {
          const rowInfo = gameStatus.rowInfoMap[rowName];
          if (rowInfo === undefined) throw new Error();

          if (handInput !== null) totalScore += rowInfo.getScore(handInput as number[]);
        }

        if (
          ["STRAIGHT", "FULLHOUSE", "TRIPLE", "FOURCARD", "YACHT"].every(
              (rowName) => {
              const handInput = playerSelection[rowName];
              return (
                handInput !== null &&
                handInput !== undefined &&
                gameStatus.getScoreOf({ rowName, playerName }) !== 0
              );
            },
          )
        ) {
          totalScore += 99999;
        }

        return totalScore;
      };

      Object.defineProperty(gameStatus, "isFinished", {
        get: (): boolean => {
          const wasExodiaTriggered = () => {
            Object.entries(gameStatus.playerHandSelectionObjectMap).forEach(
              ([playerName, playerSelection]) => {
                if (
                  [
                    "STRAIGHT",
                    "FULLHOUSE",
                    "TRIPLE",
                    "FOURCARD",
                    "YACHT",
                  ].every((rowName) => {
                    const handInput = playerSelection[rowName];
                    return (
                      handInput !== null &&
                      handInput !== undefined &&
                      gameStatus.getScoreOf({
                        rowName,
                        playerName
                      }) !== 0
                    );
                  })
                ) {
                  return true;
                }
                return false;
              },
            );
            return false;
          };

          const wasThisTurnEnded = () => {
            let turn: null | number = null;
            Object.values(gameStatus.playerHandSelectionObjectMap).forEach(
              (playerSelection) => {
                const thisPlayerTurn = Object.values(playerSelection).filter(
                  (v) => v !== null,
                ).length;
                if (turn === null) {
                  turn = thisPlayerTurn;
                } else {
                  if (turn !== thisPlayerTurn) {
                    return false;
                  }
                }
              },
            );

            return true;
          };

          if (wasThisTurnEnded() && wasExodiaTriggered()) return true;

          for (const selection of Object.values(
            gameStatus.playerHandSelectionObjectMap,
          )) {
            if (Object.values(selection).some((v) => v === null)) {
              return false;
            }
          }
          return true;
        },
      });
    },
  },
} as const satisfies Record<string, AlterOptionObject>;

export const NumbersExodiaMap = {
  NumbersExodia: {
    handDependencies: [
      "NUMBERS_1",
      "NUMBERS_2",
      "NUMBERS_3",
      "NUMBERS_4",
      "NUMBERS_5",
      "NUMBERS_6",
    ],
    description: `NUMBERS의 점수 합이 90점 이상이면 99999점을 얻고 게임 종료(해당 턴까지 진행후)`,
    onTrigger(gameStatus) {
      gameStatus.getPlayerTotalScore = ({ playerName }) => {
        const playerSelection = gameStatus.playerHandSelectionObjectMap[playerName];
        if (playerSelection === undefined) throw new Error();

        let totalScore = 0;
        for (const [rowName, handInput] of Object.entries(playerSelection)) {
          const rowInfo = gameStatus.rowInfoMap[rowName];
          if (rowInfo === undefined) throw new Error();

          if (handInput !== null) totalScore += rowInfo.getScore(handInput as number[]);
        }

        let numbersScore = 0;

        for (const rowName of [
          "NUMBERS_1",
          "NUMBERS_2",
          "NUMBERS_3",
          "NUMBERS_4",
          "NUMBERS_5",
          "NUMBERS_6",
        ]) {
          const handInput = playerSelection[rowName];
          if (handInput === undefined) throw new Error();
          const rowInfo = gameStatus.rowInfoMap[rowName];
          if (rowInfo === undefined) throw new Error();

          if (handInput !== null) {
            numbersScore += rowInfo.getScore(handInput as number[]);
          }
        }

        if (numbersScore >= 90) {
          totalScore += 99999;
        }

        return totalScore;
      };

      Object.defineProperty(gameStatus, "isFinished", {
        get: (): boolean => {
          const wasExodiaTriggered = () =>
            Object.values(gameStatus.playerHandSelectionObjectMap).some(
              (playerSelection) => {
                let numbersScore = 0;

                for (const rowName of [
                  "NUMBERS_1",
                  "NUMBERS_2",
                  "NUMBERS_3",
                  "NUMBERS_4",
                  "NUMBERS_5",
                  "NUMBERS_6",
                ]) {
                  const handInput = playerSelection[rowName];
                  if (handInput === undefined) throw new Error();
                  const rowInfo = gameStatus.rowInfoMap[rowName];
                  if (rowInfo === undefined) throw new Error();

                  if (handInput !== null) {
                    numbersScore += rowInfo.getScore(handInput as number[]);
                  }
                }

                return numbersScore >= 90;
              },
            );

          const wasThisTurnEnded = () => {
            let turn: null | number = null;
            Object.values(gameStatus.playerHandSelectionObjectMap).forEach(
              (playerSelection) => {
                const thisPlayerTurn = Object.values(playerSelection).filter(
                  (v) => v !== null,
                ).length;
                if (turn === null) {
                  turn = thisPlayerTurn;
                } else {
                  if (turn !== thisPlayerTurn) {
                    return false;
                  }
                }
              },
            );

            return true;
          };

          if (wasThisTurnEnded() && wasExodiaTriggered()) return true;

          for (const selection of Object.values(
            gameStatus.playerHandSelectionObjectMap,
          )) {
            if (Object.values(selection).some((v) => v === null)) {
              return false;
            }
          }
          return true;
        },
      });
    },
  },
} as const satisfies Record<string, AlterOptionObject>;
